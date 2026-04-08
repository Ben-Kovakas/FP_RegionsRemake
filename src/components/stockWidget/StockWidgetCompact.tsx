import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WidgetShell from '../widgetGrid/WidgetShell';

type StockData = {
  ticker: string;
  company: string;
  price: number;
  changePercent: number;
};

const PLACEHOLDER: StockData = {
  ticker: 'AAPL',
  company: 'Apple Inc.',
  price: 189.42,
  changePercent: 2.34,
};

const CHART_POINTS = [30, 45, 38, 55, 50, 62, 58, 70, 65, 72, 68, 75];

function MiniChart() {
  const max = Math.max(...CHART_POINTS);
  const min = Math.min(...CHART_POINTS);
  const range = max - min || 1;
  const chartHeight = 50;

  return (
    <View style={chartStyles.container}>
      <View style={chartStyles.chart}>
        {CHART_POINTS.map((point, i) => {
          const height = ((point - min) / range) * chartHeight;
          return (
            <View key={i} style={chartStyles.barWrapper}>
              <View
                style={[
                  chartStyles.bar,
                  {
                    height,
                    backgroundColor: i === CHART_POINTS.length - 1 ? '#4CAF50' : 'rgba(76, 175, 80, 0.4)',
                  },
                ]}
              />
            </View>
          );
        })}
      </View>
      <View style={chartStyles.labels}>
        <Text style={chartStyles.label}>9:30</Text>
        <Text style={chartStyles.label}>4:00</Text>
      </View>
    </View>
  );
}

const chartStyles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 2 },
  chart: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  barWrapper: { flex: 1, justifyContent: 'flex-end' },
  bar: { borderRadius: 2, minHeight: 2 },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  label: { fontSize: 8, color: '#888', fontWeight: '500' },
});

export default function StockWidgetCompact({ data = PLACEHOLDER }: { data?: StockData }) {
  const isPositive = data.changePercent >= 0;
  const changeColor = isPositive ? '#4CAF50' : '#F44336';
  const changePrefix = isPositive ? '+' : '';

  return (
    <WidgetShell size="2x2" onPress={() => console.log('stock compact tapped')}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.ticker}>{data.ticker}</Text>
            <View style={[styles.badge, { backgroundColor: changeColor + '22' }]}>
              <Text style={[styles.badgeText, { color: changeColor }]}>
                {changePrefix}{data.changePercent.toFixed(2)}%
              </Text>
            </View>
            <Text style={styles.company}>{data.company}</Text>
          </View>
          <Text style={styles.price}>${data.price.toFixed(2)}</Text>
        </View>

        {/* Chart */}
        <View style={styles.chartSection}>
          <MiniChart />
        </View>
      </View>
    </WidgetShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ticker: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  badge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  company: {
    fontSize: 11,
    color: '#888',
    marginTop: 1,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
  chartSection: {
    flex: 1,
    marginTop: 8,
  },
});
