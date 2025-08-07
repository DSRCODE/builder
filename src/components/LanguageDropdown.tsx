import React from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface LanguageDropdownProps {
  isScrolled?: boolean;
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ isScrolled = false }) => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, languages } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center space-x-2 ${
            isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-primary'
          }`}
        >
          <Globe size={16} />
          <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
          <ChevronDown size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
          {t('language.select')}
        </div>
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`flex items-center justify-between cursor-pointer ${
              currentLanguage.code === language.code ? 'bg-accent' : ''
            }`}
          >
            <span>{language.nativeName}</span>
            {currentLanguage.code === language.code && (
              <div className="w-2 h-2 bg-primary rounded-full" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdown;
