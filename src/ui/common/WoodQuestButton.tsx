import { bookUi } from '../../config/assetRegistry';

interface WoodQuestButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  className?: string;
}

export function WoodQuestButton({
  onClick,
  disabled = false,
  label,
  className,
}: WoodQuestButtonProps) {
  const classes = ['wood-quest-btn', className].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled}
      onClick={onClick}
    >
      <img
        className="wood-quest-btn__bg"
        src={bookUi.questBtn}
        alt=""
        draggable={false}
      />
      <span className="wood-quest-btn__label">{label}</span>
    </button>
  );
}
