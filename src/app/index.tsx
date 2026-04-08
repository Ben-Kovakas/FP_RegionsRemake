import ClockWidget1 from "@/components/widget1/index";
import ClockWidget2 from "@/components/widget2/index";
import ClockWidget3 from "@/components/widget3/index";
import ClockWidget4 from "@/components/widget4/index";
import StockWidgetFull from "@/components/stockWidget/StockWidgetFull";
import StockWidgetCompact from "@/components/stockWidget/StockWidgetCompact";
import GridContainer from "@/components/widgetGrid/GridContainer";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={{ flex: 1 }}> 
        <GridContainer headerContent={<Text style={{ fontSize: 24, fontWeight: 'bold' }}>My Dashboard</Text>}>
      {/* Stock widgets */}
      <StockWidgetFull />
      <StockWidgetCompact />
      {/* Clock widgets */}
      <ClockWidget1 />
      <ClockWidget1 />
      <ClockWidget3 />
      <ClockWidget2 />
      <ClockWidget2 />
      <ClockWidget4 />
      <ClockWidget4 />
      <ClockWidget3 />
      <ClockWidget1 />
      <ClockWidget2 />
      <ClockWidget2 />
      <ClockWidget1 />
      <ClockWidget1 />
      
      </GridContainer>
      </View>



  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
