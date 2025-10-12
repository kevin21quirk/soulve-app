import { Languages, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TranslationButtonProps {
  isTranslated: boolean;
  isLoading: boolean;
  detectedLanguage: string;
  onTranslate: () => void;
  onToggle: () => void;
  className?: string;
}

const languageNames: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean',
  ar: 'Arabic',
  hi: 'Hindi',
  ru: 'Russian',
  nl: 'Dutch',
  pl: 'Polish',
  tr: 'Turkish',
};

export const TranslationButton = ({
  isTranslated,
  isLoading,
  detectedLanguage,
  onTranslate,
  onToggle,
  className = '',
}: TranslationButtonProps) => {
  const languageName = languageNames[detectedLanguage] || detectedLanguage;

  if (isTranslated) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className={`text-xs text-muted-foreground hover:text-foreground ${className}`}
      >
        <Languages className="h-3 w-3 mr-1" />
        See Original
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onTranslate}
      disabled={isLoading}
      className={`text-xs text-muted-foreground hover:text-foreground ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          Translating...
        </>
      ) : (
        <>
          <Languages className="h-3 w-3 mr-1" />
          Translate from {languageName}
        </>
      )}
    </Button>
  );
};