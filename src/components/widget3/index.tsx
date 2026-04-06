import { Text } from "react-native";
import WidgetShell from "../widgetGrid/WidgetShell";

export default function ClockWidget3() {
  return (
    <WidgetShell size="2x1" onPress={() => console.log('tapped')}>
      <Text>12:45</Text>
    </WidgetShell>
  );
}