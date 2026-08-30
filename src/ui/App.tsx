import { observer } from 'mobx-react-lite';
import { LocaleProvider } from '../i18n/LocaleContext';
import { IzbaScene } from './scene/IzbaScene';

export const App = observer(function App() {
  return (
    <LocaleProvider>
      <IzbaScene />
    </LocaleProvider>
  );
});
