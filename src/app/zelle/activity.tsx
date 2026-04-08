import { Stack } from 'expo-router';

import ZelleActivityScreen from '@/components/zelle/ZelleActivityScreen';

export default function ActivityScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Activity' }} />
      <ZelleActivityScreen />
    </>
  );
}
