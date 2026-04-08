import GridContainer from "@/components/widgetGrid/GridContainer";
import { ZelleActivityWidget, ZelleLogoWidget } from "@/components/zelle/ZelleWidget";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <GridContainer
        headerContent={<Text style={styles.title}>My Dashboard</Text>}
      >
        <ZelleLogoWidget key="zelle-logo" />
        <ZelleActivityWidget key="zelle-activity" />
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
