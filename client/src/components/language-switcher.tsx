import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Language } from '@/lib/i18n';

interface LanguageSwitcherProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageSwitcher({ language, onLanguageChange }: LanguageSwitcherProps) {
  return (
    <Select value={language} onValueChange={(value: Language) => onLanguageChange(value)} data-testid="select-language">
      <SelectTrigger className="w-20 bg-input border-border text-foreground">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en" data-testid="option-english">EN</SelectItem>
        <SelectItem value="ru" data-testid="option-russian">RU</SelectItem>
        <SelectItem value="he" data-testid="option-hebrew">HE</SelectItem>
      </SelectContent>
    </Select>
  );
}
