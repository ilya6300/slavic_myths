import { bookUi } from '../../config/assetRegistry';
import { settingsUiContent } from '../../data/dialogContent';
import { resolveText } from '../../i18n/resolve';
import { useLocale } from '../../i18n/LocaleContext';

interface ModalCloseButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function ModalCloseButton({
  onClick,
  disabled = false,
  className,
  ariaLabel,
}: ModalCloseButtonProps) {
  const { locale } = useLocale();

  const classes = ['modal-close', className].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel ?? resolveText(settingsUiContent.dialogClose, locale)}
    >
      <img src={bookUi.closeBtn} alt="" draggable={false} />
    </button>
  );
}
