import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import WidgetShell from '../widgetGrid/WidgetShell';
import { StockData, STOCKS } from './stockData';

const DEFAULT_DATA = STOCKS.AAPL;

export default function StockWidget1x1({ data = DEFAULT_DATA }: { data?: StockData }) {
  const router = useRouter();
  const isPositive = data.changePercent >= 0;
  const changeColor = isPositive ? '#4CAF50' : '#F44336';
  const changePrefix = isPositive ? '+' : '';
  const arrow = isPositive ? '\u25B2' : '\u25BC';

  return (
    <WidgetShell size="1x1" onPress={() => router.push(`/stock/${data.ticker}` as any)}>
      <View style={styles.container}>
        <Text style={styles.ticker} numberOfLines={1} adjustsFontSizeToFit>
          {data.ticker}
        </Text>
        <Text style={styles.price} numberOfLines={1} adjustsFontSizeToFit>
          ${data.price.toFixed(2)}
        </Text>
        <Text
          style={[styles.change, { color: changeColor }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {arrow} {changePrefix}{data.changePercent.toFixed(2)}%
        </Text>
      </View>
    </WidgetShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 8,
    justifyContent: 'space-between',
  },
  ticker: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  price: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  change: {
    fontSize: 10,
    fontWeight: '700',
  },
});
