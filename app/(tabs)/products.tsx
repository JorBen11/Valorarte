import { useTranslation } from 'react-i18next';

import { Screen } from '@/components/ui/screen';
import { StateView } from '@/components/ui/state-view';

export default function ProductsScreen() {
  const { t } = useTranslation();
  return (
    <Screen title={t('products.title')}>
      <StateView title={t('products.unavailableTitle')} message={t('products.unavailable')} />
    </Screen>
  );
}
