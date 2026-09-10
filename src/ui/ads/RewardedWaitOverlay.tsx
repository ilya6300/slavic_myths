import { observer } from 'mobx-react-lite';
import type { CSSProperties } from 'react';

import { hudIcons } from '../../config/assetRegistry';
import { settingsUiContent } from '../../data/dialogContent';
import { resolveText } from '../../i18n/resolve';
import { useLocale } from '../../i18n/LocaleContext';
import {
  adsUiStore,
  REWARDED_STUB_DURATION_SEC,
} from '../../store/adsUiStore';
import { ModalCloseButton } from '../common/ModalCloseButton';

export const RewardedWaitOverlay = observer(function RewardedWaitOverlay() {
  const { locale } = useLocale();

  if (!adsUiStore.isWaitVisible) return null;

  const lore =
    adsUiStore.loreContext === 'chest'
      ? resolveText(settingsUiContent.rewardedWaitChest, locale)
      : resolveText(settingsUiContent.rewardedWaitSmetana, locale);

  const icon =
    adsUiStore.loreContext === 'chest' ? hudIcons.coin : hudIcons.smetana;

  return (
    <div className="rewarded-wait layer-modal" role="dialog" aria-modal="true">
      <div className="rewarded-wait__panel">
        <ModalCloseButton
          onClick={() => adsUiStore.cancel()}
          disabled={!adsUiStore.canCancel}
          ariaLabel={resolveText(settingsUiContent.rewardedWaitCancel, locale)}
        />
        <img className="rewarded-wait__icon" src={icon} alt="" draggable={false} />
        <p className="rewarded-wait__lore">{lore}</p>
        <div className="rewarded-wait__progress" aria-hidden>
          <div
            className="rewarded-wait__progress-fill"
            style={{ '--rewarded-progress': adsUiStore.progress } as CSSProperties}
          />
        </div>
        <p className="rewarded-wait__timer">
          {adsUiStore.remainingSec} / {REWARDED_STUB_DURATION_SEC}
        </p>
        {adsUiStore.canCancel && (
          <button
            type="button"
            className="rewarded-wait__cancel"
            onClick={() => adsUiStore.cancel()}
          >
            {resolveText(settingsUiContent.rewardedWaitCancel, locale)}
          </button>
        )}
      </div>
    </div>
  );
});
