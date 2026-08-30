import type { ReactNode } from 'react';

interface TutorialHighlightProps {
  active: boolean;
  children: ReactNode;
  className?: string;
}

export function TutorialHighlight({
  active,
  children,
  className = '',
}: TutorialHighlightProps) {
  return (
    <div
      className={`tutorial-highlight${active ? ' tutorial-highlight--active' : ''}${className ? ` ${className}` : ''}`}
    >
      {children}
    </div>
  );
}
