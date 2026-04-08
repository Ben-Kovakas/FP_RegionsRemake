import { BalanceWidget1x1, BalanceWidget2x1, BalanceWidget2x2 } from "@/components/staticWidgets/balance";
import NotificationWidget2x1 from "@/components/staticWidgets/notifications";
import { Safe2SpendWidget1x1, Safe2SpendWidget2x1, Safe2SpendWidget2x2 } from "@/components/staticWidgets/safe2spend";
import StockWidgetCompact from "@/components/stockWidget/StockWidgetCompact";
import StockWidgetFull from "@/components/stockWidget/StockWidgetFull";
import GridContainer from "@/components/widgetGrid/GridContainer";
import { ZelleActivityWidget, ZelleLogoWidget } from "@/components/zelle/ZelleWidget";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}> 
        <GridContainer headerContent={<Text style={styles.title}>My Dashboard</Text>}>
          {/* Stock widgets */}
          <StockWidgetFull />
          <StockWidgetCompact />

          {/* Zello widgets */}
          <ZelleLogoWidget key="zelle-logo" />
          <ZelleActivityWidget key="zelle-activity" />
        
          {/* Static widgets */}
          <BalanceWidget1x1 />
          <BalanceWidget2x1 />
          <BalanceWidget2x2 />
          <Safe2SpendWidget1x1 />
          <Safe2SpendWidget2x1 />
          <Safe2SpendWidget2x2 />
          <NotificationWidget2x1 />
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
