import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';

export default function ProductsScreen() {
  const { t } = useTranslation();
  return (
    <Screen title={t('products.title')}>
      <EmptyState message={t('common.notAvailableYet')} />
    </Screen>
  );
}
