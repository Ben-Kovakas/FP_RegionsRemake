import { BalanceWidget1x1, BalanceWidget2x1, BalanceWidget2x2 } from "@/components/staticWidgets/balance";
import NotificationWidget2x1 from "@/components/staticWidgets/notifications";
import { RecurringWidget2x1, RecurringWidget2x2 } from "@/components/staticWidgets/recurringPayments";
import { Safe2SpendWidget1x1, Safe2SpendWidget2x1, Safe2SpendWidget2x2 } from "@/components/staticWidgets/safe2spend";
import StockWidgetCompact from "@/components/stockWidget/StockWidgetCompact";
import StockWidget1x1 from "@/components/stockWidget/StockWidget1x1";
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
          <StockWidgetFull />
          <StockWidgetCompact />
          <StockWidget1x1 />

          {/* 2x2 grouping: four 1x1 widgets */}
          <WidgetGroup key="group-four-1x1" variant="four_1x1">
            <BalanceWidget1x1 />
            <Safe2SpendWidget1x1 />
            <TransferWidget />
            <ZelleLogoWidget />
          </WidgetGroup>

          {/* 2x2 grouping: two 2x1 widgets */}
          <WidgetGroup key="group-two-2x1" variant="two_2x1">
            <ZelleActivityWidget />
            <Safe2SpendWidget2x1 />
          </WidgetGroup>

          {/* Static widgets */}
          <BalanceWidget2x1 />
          <BalanceWidget2x2 />
          <Safe2SpendWidget2x2 />
          <NotificationWidget2x1 />
          <RecurringWidget2x1 />
          <RecurringWidget2x2 />


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
