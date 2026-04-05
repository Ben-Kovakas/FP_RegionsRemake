import GridContainer from "@/components/widgetGrid/GridContainer";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    
    <GridContainer headerContent={<Text style={{ fontSize: 24, fontWeight: 'bold' }}>My Dashboard</Text>}>
      {/* Example widgets */}
      <View style={{ backgroundColor: 'tomato', borderRadius: 8, flex: 1, margin: 4, height: 100 }} />
      <View style={{ backgroundColor: 'skyblue', borderRadius: 8, flex: 1, margin: 4, height: 100 }} />
      </GridContainer>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
