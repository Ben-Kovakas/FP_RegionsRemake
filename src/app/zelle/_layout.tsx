import { Stack } from 'expo-router';

export default function ZelleLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: '#f2f4f8' },
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: '#21142d',
        headerTitleStyle: { fontWeight: '900' },
      }}
    />
  );
}
