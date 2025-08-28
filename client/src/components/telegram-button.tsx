import { FaTelegramPlane } from 'react-icons/fa';

export function TelegramButton() {
  return (
    <div className="telegram-float">
      <a
        href="https://t.me/Dark090111"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-primary text-primary-foreground w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-lg hover:opacity-90 transition-opacity"
        data-testid="button-telegram-float"
      >
        <FaTelegramPlane />
      </a>
    </div>
  );
}
