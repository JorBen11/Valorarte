import { useTranslation } from 'react-i18next';

import { Screen } from '@/components/ui/screen';
import { StateView } from '@/components/ui/state-view';

export default function ProductsScreen() {
  const { t } = useTranslation();
  return (
    <Screen title={t('products.title')}>
      <StateView icon="timer-sand" title={t('common.comingSoon')} message={t('common.notAvailableYet')} />
    </Screen>
  );
}
