import { parse, validate } from '@telegram-apps/init-data-node';
import { createClient } from '@supabase/supabase-js';
import { SignJWT } from 'jose';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { initData } = await req.json();

    if (!initData) {
      return new Response(
        JSON.stringify({ error: 'Missing initData' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get bot token from environment
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    if (!botToken) {
      return new Response(
        JSON.stringify({ error: 'Bot token not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate initData
    try {
      validate(initData, botToken);
    } catch (error) {
      console.error('Invalid initData:', error);
      return new Response(
        JSON.stringify({ error: 'Invalid initData' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse initData to get user info
    const parsedData = parse(initData);
    const telegramUser = parsedData.user as TelegramUser;

    if (!telegramUser?.id) {
      return new Response(
        JSON.stringify({ error: 'No user data in initData' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user exists in database
    let { data: existingUser, error: fetchError } = await supabase
      .from('profiles')
      .select('user_id, telegram_id, first_name, last_name, username')
      .eq('telegram_id', telegramUser.id.toString())
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Database error:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Database error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let userId: string;

    if (!existingUser) {
      // Create new user
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: `tg_${telegramUser.id}@telegram.local`,
        password: `tg_password_${telegramUser.id}_${Date.now()}`,
        email_confirm: true,
        user_metadata: {
          telegram_id: telegramUser.id.toString(),
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name || '',
          username: telegramUser.username || '',
          photo_url: telegramUser.photo_url || '',
          is_premium: telegramUser.is_premium || false,
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        return new Response(
          JSON.stringify({ error: 'Failed to create user' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      userId = authUser.user.id;
    } else {
      userId = existingUser.user_id;
      
      // Update user info if needed
      await supabase
        .from('profiles')
        .update({
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name || '',
          username: telegramUser.username || '',
          avatar_url: telegramUser.photo_url || '',
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);
    }

    // Generate JWT token
    const jwtSecret = Deno.env.get('SUPABASE_JWT_SECRET');
    if (!jwtSecret) {
      return new Response(
        JSON.stringify({ error: 'JWT secret not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const secret = new TextEncoder().encode(jwtSecret);
    const alg = 'HS256';

    const jwt = await new SignJWT({
      sub: userId,
      telegram_id: telegramUser.id.toString(),
      first_name: telegramUser.first_name,
      last_name: telegramUser.last_name || '',
      username: telegramUser.username || '',
      aud: 'authenticated',
      role: 'authenticated',
    })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    return new Response(
      JSON.stringify({
        access_token: jwt,
        token_type: 'bearer',
        expires_in: 86400,
        user: {
          id: userId,
          telegram_id: telegramUser.id.toString(),
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name || '',
          username: telegramUser.username || '',
          photo_url: telegramUser.photo_url || '',
          is_premium: telegramUser.is_premium || false,
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});