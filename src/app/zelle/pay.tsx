import { Stack } from 'expo-router';

import ZelleTransferScreen from '@/components/zelle/ZelleTransferScreen';

export default function PayScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Pay' }} />
      <ZelleTransferScreen mode="pay" />
    </>
  );
}
