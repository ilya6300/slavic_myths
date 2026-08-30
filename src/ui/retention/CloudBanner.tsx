import { observer } from 'mobx-react-lite';
import { settingsUiContent } from '../../data/dialogContent';
import { resolveText } from '../../i18n/resolve';
import { useLocale } from '../../i18n/LocaleContext';
import { requestAuth } from '../../platform/platformService';
import { gameStore } from '../../store/GameStore';
import { saveService } from '../../services/saveService';
import { settingsUiStore } from '../../store/settingsUiStore';

export const CloudBanner = observer(function CloudBanner() {
  const { locale } = useLocale();

  if (!gameStore.isCloudBannerVisible(settingsUiStore.authorized)) {
    return null;
  }

  const handleSave = async () => {
    const ok = await requestAuth();
    await settingsUiStore.refreshAuth();
    if (ok) {
      await saveService.flushPersist();
      gameStore.dismissCloudBanner();
    }
  };

  const handleDismiss = () => {
    gameStore.dismissCloudBanner();
  };

  return (
    <div className="cloud-banner" role="region" aria-label="Cloud save">
      <p className="cloud-banner__text">
        {resolveText(settingsUiContent.cloudBannerText, locale)}
      </p>
      <div className="cloud-banner__actions">
        <button
          type="button"
          className="cloud-banner__save"
          onClick={() => void handleSave()}
        >
          {resolveText(settingsUiContent.cloudBannerSave, locale)}
        </button>
        <button
          type="button"
          className="cloud-banner__dismiss"
          onClick={handleDismiss}
        >
          {resolveText(settingsUiContent.cloudBannerDismiss, locale)}
        </button>
      </div>
    </div>
  );
});
