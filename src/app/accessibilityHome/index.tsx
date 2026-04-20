import { BalanceWidget2x2 } from '@/components/staticWidgets/balance';
import NotificationWidget2x1 from '@/components/staticWidgets/notifications';
import { RecurringWidget2x2 } from '@/components/staticWidgets/recurringPayments';
import { Safe2SpendWidget4x4 } from '@/components/staticWidgets/safe2spend/Safe2SpendWidget4x4';
import StockWidgetFull from '@/components/stockWidget/StockWidgetFull';
import GridContainer from '@/components/widgetGrid/GridContainer';
import { useTheme } from '@/theme';
import { StyleSheet, Text, View } from 'react-native';

export default function AccessibilityHome() {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <GridContainer
        headerContent={
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Accessibility View
          </Text>
        }
      >
        <Safe2SpendWidget4x4 key="a11y-safe-4x4" />
        <RecurringWidget2x2 key="a11y-recurring" />
        <BalanceWidget2x2 key="a11y-balance" />
        <NotificationWidget2x1 key="a11y-alerts" />
        <StockWidgetFull key="a11y-stock" />
      </GridContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 28, fontWeight: '900' },
});
