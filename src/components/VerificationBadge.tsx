import React from 'react';
import { Check, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface VerificationBadgeProps {
  isVerified?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

const VerificationBadge = ({ isVerified = false, className = "", size = "md" }: VerificationBadgeProps) => {
  const navigate = useNavigate();

  if (!isVerified) return null;

  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`p-0 h-auto min-w-0 hover:bg-transparent ${className}`}
            onClick={(e) => {
              e.stopPropagation();
              navigate('/verification-info');
            }}
          >
            <div className={`${iconSize} bg-primary rounded-full flex items-center justify-center`}>
              <Check className={`${size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5'} text-primary-foreground stroke-[3]`} />
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center space-x-2">
            <Info className="w-3 h-3" />
            <span>Верифицированный профиль</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VerificationBadge;