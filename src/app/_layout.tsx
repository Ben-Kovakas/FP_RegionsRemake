import DemoBottomNavBar from "@/components/DemoBottomNavBar";
import { ThemeProvider, useTheme } from "@/theme";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export const unstable_settings = {
  initialRouteName: "index",
};

function ThemedStack() {
  const theme = useTheme();

  const neutralScreen = React.useMemo(() => ({
    contentStyle: { backgroundColor: theme.colors.background },
    headerStyle: { backgroundColor: theme.colors.surface },
    headerTintColor: theme.colors.textPrimary,
    headerTitleStyle: { fontWeight: "900" as const },
  }), [theme]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="transferScreen/index" options={{ ...neutralScreen, title: "Transfer Funds" }} />
      <Stack.Screen name="transferScreen/Success" options={{ ...neutralScreen, title: "Transfer Successful" }} />
      <Stack.Screen name="zelle/pay" options={{ ...neutralScreen, title: "Pay" }} />
      <Stack.Screen name="zelle/request" options={{ ...neutralScreen, title: "Request" }} />
      <Stack.Screen name="zelle/activity" options={{ ...neutralScreen, title: "Activity" }} />
      <Stack.Screen name="stocks/index" options={{ ...neutralScreen, title: "Stocks" }} />
      <Stack.Screen
        name="stock/[ticker]"
        options={{
          ...neutralScreen,
          title: "Stock",
        }}
      />
    </Stack>
  );
}

function ThemedRoot() {
  const theme = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <View style={styles.stackWrap}>
        <ThemedStack />
      </View>
      <DemoBottomNavBar />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider initialMode="light">
      <ThemedRoot />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  stackWrap: {
    flex: 1,
  },
});
