import { Theme, useTheme } from '@/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WidgetShell from '../widgetGrid/WidgetShell';
import { StockData, STOCKS } from './stockData';

const PLACEHOLDER = STOCKS.AAPL;

const CHART_POINTS = [30, 45, 38, 55, 50, 62, 58, 70, 65, 72, 68, 75];

function MiniChart({ color }: { color: string }) {
  const theme = useTheme();
  const chartStyles = React.useMemo(() => makeChartStyles(theme), [theme]);
  const max = Math.max(...CHART_POINTS);
  const min = Math.min(...CHART_POINTS);
  const range = max - min || 1;
  const chartHeight = 80;

  return (
    <View style={chartStyles.container}>
      <View style={chartStyles.chart}>
        {CHART_POINTS.map((point, i) => {
          const height = ((point - min) / range) * chartHeight;
          const isLast = i === CHART_POINTS.length - 1;
          return (
            <View key={i} style={chartStyles.barWrapper}>
              <View
                style={[
                  chartStyles.bar,
                  {
                    height,
                    backgroundColor: isLast ? color : color + '66',
                  },
                ]}
              />
            </View>
          );
        })}
      </View>
      <View style={chartStyles.labels}>
        <Text style={chartStyles.label}>9:30</Text>
        <Text style={chartStyles.label}>12:00</Text>
        <Text style={chartStyles.label}>4:00</Text>
      </View>
    </View>
  );
}

function makeChartStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 4 },
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
      marginTop: 4,
    },
    label: { fontSize: 9, color: theme.colors.textMuted, fontWeight: '500' },
  });
}

export default function StockWidgetFull({ data = PLACEHOLDER }: { data?: StockData }) {
  const theme = useTheme();
  const styles = React.useMemo(() => makeStyles(theme), [theme]);
  const router = useRouter();
  const isPositive = data.changePercent >= 0;
  const changeColor = isPositive ? theme.colors.success : theme.colors.danger;
  const changePrefix = isPositive ? '+' : '';

  return (
    <WidgetShell size="2x4" onPress={() => router.push(`/stock/${data.ticker}` as any)}>
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
          <MiniChart color={changeColor} />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Key Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Key Stats</Text>
          <StatRow label="Open" value={data.open.toFixed(2)} />
          <StatRow label="High" value={data.high.toFixed(2)} />
          <StatRow label="Low" value={data.low.toFixed(2)} />
          <StatRow label="Volume" value={data.volume} />
        </View>
      </View>
    </WidgetShell>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  const styles = React.useMemo(() => makeStyles(theme), [theme]);
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 12,
      backgroundColor: theme.colors.surface,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    tickerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    ticker: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.colors.textPrimary,
      letterSpacing: 0.5,
    },
    badge: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
    },
    badgeText: {
      fontSize: 11,
      fontWeight: '700',
    },
    company: {
      fontSize: 12,
      color: theme.colors.textMuted,
      marginTop: 2,
    },
    price: {
      fontSize: 14,
      fontWeight: '800',
      color: theme.colors.textPrimary,
    },
    chartSection: {
      flex: 1,
      marginTop: 10,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.divider,
      marginVertical: 8,
    },
    statsSection: {
      gap: 4,
    },
    statsTitle: {
      fontSize: 11,
      fontWeight: '700',
      color: theme.colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 2,
    },
    statRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.textMuted,
      fontWeight: '500',
    },
    statValue: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontWeight: '600',
    },
  });
}
