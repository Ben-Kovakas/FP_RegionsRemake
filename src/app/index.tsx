import { StyleSheet, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.parentView}>
        <View style={styles.box} />
        <View style={styles.box} />
        <View style={styles.box} />
      </View>
      <View style={styles.fullBox} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  parentView: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  box: {
    width: "30%",
    aspectRatio: 1,
    backgroundColor: "#55983d",
    borderRadius: 8,
  },
  fullBox: {
    width: "100%",
    height: 100,
    backgroundColor: "#55983d",
    borderRadius: 8,
    marginTop: 16,
  },
});
