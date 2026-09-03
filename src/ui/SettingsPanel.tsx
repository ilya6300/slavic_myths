import { observer } from 'mobx-react-lite';
import { LOCALE_LABELS, LOCALES } from '../i18n/types';
import { resolveText } from '../i18n/resolve';
import { useLocale } from '../i18n/LocaleContext';
import { settingsUiContent } from '../data/dialogContent';
import { requestAuth } from '../platform/platformService';
import { saveService } from '../services/saveService';
import { gameStore } from '../store/GameStore';
import { settingsUiStore } from '../store/settingsUiStore';

export const SettingsPanel = observer(function SettingsPanel({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const { locale, setLocale } = useLocale();

  const handleLogin = async () => {
    await requestAuth();
    await settingsUiStore.refreshAuth();
    await saveService.flushPersist();
    if (settingsUiStore.authorized) {
      gameStore.dismissCloudBanner();
    }
  };

  const handleReset = async () => {
    settingsUiStore.closeResetConfirm();
    await gameStore.resetProgress();
    await settingsUiStore.refreshAuth();
  };

  return (
    <section className={`settings-panel${embedded ? ' settings-panel--embedded' : ''}`} aria-label="Settings">
      {!embedded && (
        <h2 className="settings-panel__heading">
          {resolveText(settingsUiContent.settingsHeading, locale)}
        </h2>
      )}

      <p className="settings-panel__cloud-hint">
        {resolveText(settingsUiContent.settingsCloudHint, locale)}
      </p>

      <label className="settings-panel__field">
        <span>{resolveText(settingsUiContent.language, locale)}</span>
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value as typeof locale)}
        >
          {LOCALES.map((code) => (
            <option key={code} value={code}>
              {LOCALE_LABELS[code]}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        className="settings-panel__btn settings-panel__btn--auth"
        onClick={() => void handleLogin()}
        disabled={settingsUiStore.authorized}
      >
        {resolveText(
          settingsUiStore.authorized
            ? settingsUiContent.settingsYandexOk
            : settingsUiContent.settingsYandexLogin,
          locale,
        )}
      </button>

      <button
        type="button"
        className="settings-panel__btn settings-panel__btn--danger"
        onClick={() => settingsUiStore.openResetConfirm()}
      >
        {resolveText(settingsUiContent.settingsReset, locale)}
      </button>

      {settingsUiStore.resetConfirmOpen && (
        <div className="settings-panel__confirm" role="alertdialog" aria-modal="true">
          <p>{resolveText(settingsUiContent.settingsResetConfirm, locale)}</p>
          <div className="settings-panel__confirm-actions">
            <button
              type="button"
              className="settings-panel__btn"
              onClick={() => settingsUiStore.closeResetConfirm()}
            >
              {resolveText(settingsUiContent.settingsResetCancel, locale)}
            </button>
            <button
              type="button"
              className="settings-panel__btn settings-panel__btn--danger"
              onClick={() => void handleReset()}
            >
              {resolveText(settingsUiContent.settingsResetOk, locale)}
            </button>
          </div>
        </div>
      )}
    </section>
  );
});
