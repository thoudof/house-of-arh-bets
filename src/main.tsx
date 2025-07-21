import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Инициализация Telegram WebApp перед загрузкой приложения
import { initTelegramSDK } from './lib/telegram';

// Инициализируем Telegram как можно раньше
if (typeof window !== 'undefined') {
  // Ждем загрузки Telegram WebApp скрипта
  const initTelegram = () => {
    if (window.Telegram?.WebApp) {
      initTelegramSDK();
    } else {
      // Если скрипт еще не загружен, ждем
      setTimeout(initTelegram, 100);
    }
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTelegram);
  } else {
    initTelegram();
  }
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);