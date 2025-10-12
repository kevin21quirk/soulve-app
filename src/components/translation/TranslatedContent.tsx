import { Badge } from '@/components/ui/badge';
import TaggedText from '@/components/dashboard/tagging/TaggedText';

interface TranslatedContentProps {
  translatedText: string;
  originalLanguage: string;
  onUserClick?: (username: string) => void;
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

export const TranslatedContent = ({
  translatedText,
  originalLanguage,
  onUserClick,
  className = '',
}: TranslatedContentProps) => {
  const languageName = languageNames[originalLanguage] || originalLanguage;

  return (
    <div className={className}>
      <TaggedText 
        text={translatedText}
        onUserClick={onUserClick}
      />
      <div className="flex items-center gap-2 mt-2">
        <Badge variant="secondary" className="text-xs">
          Translated from {languageName}
        </Badge>
        <span className="text-xs text-muted-foreground">
          • Powered by AI
        </span>
      </div>
    </div>
  );
};