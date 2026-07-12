import * as Icons from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const IconMapper = ({ name, className, size = 20 }: IconProps) => {
  // Converte formatos do figma/lucide (ex: briefcase-business.svg para BriefcaseBusiness)
  const pascalCaseName = name
    .replace('.svg', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  const LucideIcon = (Icons as any)[pascalCaseName] || Icons.HelpCircle;
  return <LucideIcon className={className} size={size} />;
};