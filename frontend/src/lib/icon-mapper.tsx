import * as Icons from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

const iconModules = import.meta.glob('../assets/Icon/*.svg', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const iconByName = Object.entries(iconModules).reduce<Record<string, string>>((acc, [path, url]) => {
  const fileName = path.split('/').pop();
  if (fileName) acc[fileName] = url;
  return acc;
}, {});

export const IconMapper = ({ name, className, size = 20 }: IconProps) => {
  const normalizedName = name.endsWith('.svg') ? name : `${name}.svg`;
  const assetUrl = iconByName[normalizedName];

  if (assetUrl) {
    return (
      <span
        aria-hidden="true"
        className={className}
        style={{
          display: 'inline-block',
          width: size,
          height: size,
          backgroundColor: 'currentColor',
          WebkitMaskImage: `url(${assetUrl})`,
          maskImage: `url(${assetUrl})`,
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
        }}
      />
    );
  }

  // Converte formatos do figma/lucide (ex: briefcase-business.svg para BriefcaseBusiness)
  const pascalCaseName = name
    .replace('.svg', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  const LucideIcon = (Icons as any)[pascalCaseName] || Icons.HelpCircle;
  return <LucideIcon className={className} size={size} />;
};