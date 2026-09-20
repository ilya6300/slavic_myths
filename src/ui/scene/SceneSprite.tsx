import type { ImgHTMLAttributes, ReactNode, Ref } from 'react';

interface SceneSpriteProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'style'> {
  placementClassName: string;
  interactive?: boolean;
  onSpriteClick?: () => void;
  className?: string;
  containerRef?: Ref<HTMLDivElement>;
  children?: ReactNode;
}

export function SceneSprite({
  placementClassName,
  interactive = false,
  onSpriteClick,
  className,
  containerRef,
  children,
  alt = '',
  ...imgProps
}: SceneSpriteProps) {
  const handleClick = () => {
    if (interactive) onSpriteClick?.();
  };

  return (
    <div
      ref={containerRef}
      className={`scene-sprite ${placementClassName}${interactive ? ' scene-sprite--interactive' : ''}${className ? ` ${className}` : ''}`}
      onMouseDown={interactive ? (e) => e.preventDefault() : undefined}
      onClick={interactive ? handleClick : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick();
              }
            }
          : undefined
      }
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      <img {...imgProps} className="scene-sprite__img" alt={alt} draggable={false} />
      {children}
    </div>
  );
}
