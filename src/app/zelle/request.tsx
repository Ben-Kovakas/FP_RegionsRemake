import { Stack } from 'expo-router';

import ZelleTransferScreen from '@/components/zelle/ZelleTransferScreen';

export default function RequestScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Request' }} />
      <ZelleTransferScreen mode="request" />
    </>
  );
}
