import { BalanceWidget1x1, BalanceWidget2x1, BalanceWidget2x2 } from "@/components/staticWidgets/balance";
import NotificationWidget2x1 from "@/components/staticWidgets/notifications";
import { Safe2SpendWidget1x1, Safe2SpendWidget2x1, Safe2SpendWidget2x2 } from "@/components/staticWidgets/safe2spend";
import StockWidgetCompact from "@/components/stockWidget/StockWidgetCompact";
import StockWidgetFull from "@/components/stockWidget/StockWidgetFull";
import { TransferWidget } from "@/components/transferWidgets/TransferWidget";
import GridContainer from "@/components/widgetGrid/GridContainer";
import WidgetGroup from "@/components/widgetGrid/WidgetGroup";
import { ZelleActivityWidget, ZelleLogoWidget } from "@/components/zelle/ZelleWidget";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
        <GridContainer headerContent={<Text style={styles.title}>My Dashboard</Text>}>
          {/* Stock widgets */}
          <StockWidgetFull key="stock-full" />
          <StockWidgetCompact key="stock-compact" />

          {/* 2x2 grouping: 4 x 1x1 */}
          <WidgetGroup key="group-four-1x1" variant="four_1x1">
            <BalanceWidget1x1 />
            <Safe2SpendWidget1x1 />
            <TransferWidget />
            <ZelleLogoWidget />
          </WidgetGroup>

          {/* 2x2 grouping: 2 x 2x1 */}
          <WidgetGroup key="group-two-2x1" variant="two_2x1">
            <ZelleActivityWidget />
            <Safe2SpendWidget2x1 />
          </WidgetGroup>

          {/* 2x2 grouping: 2 x 1x2 */}
          <WidgetGroup key="group-two-1x2" variant="two_1x2">
            <BalanceWidget2x1 />
            <BalanceWidget2x1 />
          </WidgetGroup>

          {/* 2x2 grouping: 2 x 1x1 + 1 x 1x2 (order: 1x2, 1x1, 1x1) */}
          <WidgetGroup key="group-two-1x1-plus-1x2" variant="two_1x1_plus_1x2">
            <BalanceWidget2x1 />
            <Safe2SpendWidget1x1 />
            <TransferWidget />
          </WidgetGroup>

          {/* 2x2 grouping: 2 x 1x1 + 1 x 2x1 (order: 2x1, 1x1, 1x1) */}
          <WidgetGroup key="group-two-1x1-plus-2x1" variant="two_1x1_plus_2x1">
            <ZelleActivityWidget />
            <BalanceWidget1x1 />
            <Safe2SpendWidget1x1 />
          </WidgetGroup>

          {/* Static widgets */}
          <BalanceWidget2x2 key="balance-2x2" />
          <Safe2SpendWidget2x2 key="safe-2x2" />
          <NotificationWidget2x1 key="notifications" />
      </GridContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
