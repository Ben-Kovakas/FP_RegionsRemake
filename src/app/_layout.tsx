import DemoBottomNavBar from "@/components/DemoBottomNavBar";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export const unstable_settings = {
  initialRouteName: "index",
};

const zelleScreenOptions = {
  contentStyle: { backgroundColor: "#f2f4f8" },
  headerStyle: { backgroundColor: "#ffffff" },
  headerTintColor: "#21142d",
  headerTitleStyle: { fontWeight: "900" as const },
};

export default function RootLayout() {
  return (
    <View style={styles.root}>
      <View style={styles.stackWrap}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="transferScreen/index" options={{ ...zelleScreenOptions, title: "Transfer Funds" }} />
          <Stack.Screen name="transferScreen/Success" options={{ ...zelleScreenOptions, title: "Transfer Successful" }} />
          <Stack.Screen name="zelle/pay" options={{ ...zelleScreenOptions, title: "Pay" }} />
          <Stack.Screen name="zelle/request" options={{ ...zelleScreenOptions, title: "Request" }} />
          <Stack.Screen name="zelle/activity" options={{ ...zelleScreenOptions, title: "Activity" }} />
          <Stack.Screen name="stocks/index" options={{ ...zelleScreenOptions, title: "Stocks" }} />
          <Stack.Screen
            name="stock/[ticker]"
            options={{
              contentStyle: { backgroundColor: "#0d0d1a" },
              headerStyle: { backgroundColor: "#0d0d1a" },
              headerTintColor: "#ffffff",
              headerTitleStyle: { fontWeight: "900" as const },
              title: "Stock",
            }}
          />
        </Stack>
      </View>
      <DemoBottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f5faf6",
  },
  stackWrap: {
    flex: 1,
  },
});
