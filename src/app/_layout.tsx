import { Stack } from "expo-router";

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
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="zelle/pay" options={{ ...zelleScreenOptions, title: "Pay" }} />
      <Stack.Screen name="zelle/request" options={{ ...zelleScreenOptions, title: "Request" }} />
      <Stack.Screen name="zelle/activity" options={{ ...zelleScreenOptions, title: "Activity" }} />
    </Stack>
  );
}
