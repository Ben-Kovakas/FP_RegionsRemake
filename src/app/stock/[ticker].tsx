import { CHART_POINTS, STOCKS, StockData } from '@/components/stockWidget/stockData';
import { Theme, useTheme } from '@/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const TIME_RANGES = ['1D', '1W', '1M', '3M', '1Y', 'ALL'] as const;

export default function StockDetailScreen() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const modalStyles = useMemo(() => makeModalStyles(theme), [theme]);
  const confirmStyles = useMemo(() => makeConfirmStyles(theme), [theme]);
  const { ticker } = useLocalSearchParams<{ ticker: string }>();
  const router = useRouter();
  const stock: StockData = STOCKS[ticker ?? 'AAPL'] ?? STOCKS.AAPL;

  const [selectedRange, setSelectedRange] = useState<string>('1D');
  const [tradeModal, setTradeModal] = useState<'buy' | 'sell' | null>(null);
  const [shares, setShares] = useState('');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [limitPrice, setLimitPrice] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(false);

  const isPositive = stock.changePercent >= 0;
  const changeColor = isPositive ? theme.colors.success : theme.colors.danger;
  const changePrefix = isPositive ? '+' : '';

  const estimatedCost = (parseFloat(shares) || 0) * (orderType === 'limit' ? (parseFloat(limitPrice) || stock.price) : stock.price);

  function handleSubmitOrder() {
    setConfirmVisible(true);
  }

  function handleConfirm() {
    setConfirmVisible(false);
    setTradeModal(null);
    setShares('');
    setLimitPrice('');
    setOrderType('market');
  }

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* ─── Header ─── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.ticker}>{stock.ticker}</Text>
            <Text style={styles.company}>{stock.company}</Text>
          </View>
          <View style={styles.priceBlock}>
            <Text style={styles.price}>${stock.price.toFixed(2)}</Text>
            <View style={[styles.badge, { backgroundColor: changeColor + '22' }]}>
              <Text style={[styles.badgeText, { color: changeColor }]}>
                {changePrefix}{stock.changePercent.toFixed(2)}%
              </Text>
            </View>
          </View>
        </View>

        {/* ─── Chart ─── */}
        <View style={styles.chartCard}>
          <View style={styles.chart}>
            {CHART_POINTS.map((point, i) => {
              const max = Math.max(...CHART_POINTS);
              const min = Math.min(...CHART_POINTS);
              const range = max - min || 1;
              const height = ((point - min) / range) * 120;
              return (
                <View key={i} style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height,
                        backgroundColor:
                          i === CHART_POINTS.length - 1
                            ? changeColor
                            : changeColor + '55',
                      },
                    ]}
                  />
                </View>
              );
            })}
          </View>
          <View style={styles.timeRow}>
            {TIME_RANGES.map((range) => (
              <Pressable
                key={range}
                onPress={() => setSelectedRange(range)}
                style={[
                  styles.timeBtn,
                  selectedRange === range && styles.timeBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.timeBtnText,
                    selectedRange === range && styles.timeBtnTextActive,
                  ]}
                >
                  {range}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ─── Buy / Sell Buttons ─── */}
        <View style={styles.actionRow}>
          <Pressable
            style={[styles.actionBtn, styles.buyBtn]}
            onPress={() => setTradeModal('buy')}
          >
            <Text style={styles.actionBtnText}>Buy</Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtn, styles.sellBtn]}
            onPress={() => setTradeModal('sell')}
          >
            <Text style={styles.actionBtnText}>Sell</Text>
          </Pressable>
        </View>

        {/* ─── Your Position ─── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Position</Text>
          <View style={styles.positionCard}>
            <PositionRow label="Shares" value="12.5" />
            <PositionRow label="Avg Cost" value={`$${(stock.price * 0.95).toFixed(2)}`} />
            <PositionRow label="Total Value" value={`$${(stock.price * 12.5).toFixed(2)}`} />
            <PositionRow
              label="Total Return"
              value={`+$${(stock.price * 12.5 * 0.05).toFixed(2)} (5.00%)`}
              valueColor={theme.colors.success}
            />
          </View>
        </View>

        {/* ─── Key Stats ─── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Statistics</Text>
          <View style={styles.statsGrid}>
            <StatCell label="Open" value={stock.open.toFixed(2)} />
            <StatCell label="High" value={stock.high.toFixed(2)} />
            <StatCell label="Low" value={stock.low.toFixed(2)} />
            <StatCell label="Volume" value={stock.volume} />
            <StatCell label="Market Cap" value={stock.marketCap} />
            <StatCell label="P/E Ratio" value={stock.peRatio.toFixed(1)} />
            <StatCell label="52W High" value={stock.weekHigh52.toFixed(2)} />
            <StatCell label="52W Low" value={stock.weekLow52.toFixed(2)} />
            <StatCell label="Avg Volume" value={stock.avgVolume} />
            <StatCell label="Dividend" value={stock.dividend} />
          </View>
        </View>

        {/* ─── About ─── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About {stock.company}</Text>
          <Text style={styles.aboutText}>
            {stock.company} is a publicly traded company listed on the NASDAQ exchange under the
            ticker symbol {stock.ticker}. Next earnings report is expected on {stock.earningsDate}.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ─── Trade Modal (Buy / Sell) ─── */}
      <Modal visible={tradeModal !== null} animationType="slide" transparent>
        <View style={modalStyles.overlay}>
          <View style={modalStyles.sheet}>
            <View style={modalStyles.handle} />

            <Text style={modalStyles.title}>
              {tradeModal === 'buy' ? 'Buy' : 'Sell'} {stock.ticker}
            </Text>
            <Text style={modalStyles.subtitle}>
              Market Price: ${stock.price.toFixed(2)}
            </Text>

            {/* Order Type Toggle */}
            <View style={modalStyles.toggleRow}>
              <Pressable
                style={[modalStyles.toggleBtn, orderType === 'market' && modalStyles.toggleActive]}
                onPress={() => setOrderType('market')}
              >
                <Text style={[modalStyles.toggleText, orderType === 'market' && modalStyles.toggleTextActive]}>
                  Market
                </Text>
              </Pressable>
              <Pressable
                style={[modalStyles.toggleBtn, orderType === 'limit' && modalStyles.toggleActive]}
                onPress={() => setOrderType('limit')}
              >
                <Text style={[modalStyles.toggleText, orderType === 'limit' && modalStyles.toggleTextActive]}>
                  Limit
                </Text>
              </Pressable>
            </View>

            {/* Shares Input */}
            <Text style={modalStyles.inputLabel}>Number of Shares</Text>
            <TextInput
              style={modalStyles.input}
              value={shares}
              onChangeText={setShares}
              placeholder="0"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="decimal-pad"
            />

            {/* Limit Price Input */}
            {orderType === 'limit' && (
              <>
                <Text style={modalStyles.inputLabel}>Limit Price ($)</Text>
                <TextInput
                  style={modalStyles.input}
                  value={limitPrice}
                  onChangeText={setLimitPrice}
                  placeholder={stock.price.toFixed(2)}
                  placeholderTextColor={theme.colors.textMuted}
                  keyboardType="decimal-pad"
                />
              </>
            )}

            {/* Estimated Cost */}
            <View style={modalStyles.estimateRow}>
              <Text style={modalStyles.estimateLabel}>
                Estimated {tradeModal === 'buy' ? 'Cost' : 'Credit'}
              </Text>
              <Text style={modalStyles.estimateValue}>${estimatedCost.toFixed(2)}</Text>
            </View>

            {/* Submit */}
            <Pressable
              style={[
                modalStyles.submitBtn,
                tradeModal === 'buy' ? modalStyles.submitBuy : modalStyles.submitSell,
                (!shares || parseFloat(shares) <= 0) && modalStyles.submitDisabled,
              ]}
              onPress={handleSubmitOrder}
              disabled={!shares || parseFloat(shares) <= 0}
            >
              <Text style={modalStyles.submitText}>
                Review {tradeModal === 'buy' ? 'Buy' : 'Sell'} Order
              </Text>
            </Pressable>

            <Pressable style={modalStyles.cancelBtn} onPress={() => { setTradeModal(null); setShares(''); setLimitPrice(''); }}>
              <Text style={modalStyles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>

        {/* ─── Confirmation Sub-Modal ─── */}
        <Modal visible={confirmVisible} animationType="fade" transparent>
          <View style={confirmStyles.overlay}>
            <View style={confirmStyles.card}>
              <Text style={confirmStyles.title}>Confirm Order</Text>
              <View style={confirmStyles.row}>
                <Text style={confirmStyles.label}>Action</Text>
                <Text style={[confirmStyles.value, { color: tradeModal === 'buy' ? theme.colors.success : theme.colors.danger }]}>
                  {tradeModal === 'buy' ? 'BUY' : 'SELL'}
                </Text>
              </View>
              <View style={confirmStyles.row}>
                <Text style={confirmStyles.label}>Ticker</Text>
                <Text style={confirmStyles.value}>{stock.ticker}</Text>
              </View>
              <View style={confirmStyles.row}>
                <Text style={confirmStyles.label}>Shares</Text>
                <Text style={confirmStyles.value}>{shares}</Text>
              </View>
              <View style={confirmStyles.row}>
                <Text style={confirmStyles.label}>Order Type</Text>
                <Text style={confirmStyles.value}>{orderType === 'market' ? 'Market' : `Limit @ $${limitPrice || stock.price.toFixed(2)}`}</Text>
              </View>
              <View style={confirmStyles.divider} />
              <View style={confirmStyles.row}>
                <Text style={confirmStyles.label}>Est. Total</Text>
                <Text style={[confirmStyles.value, { fontWeight: '800' }]}>${estimatedCost.toFixed(2)}</Text>
              </View>

              <Pressable
                style={[confirmStyles.btn, tradeModal === 'buy' ? modalStyles.submitBuy : modalStyles.submitSell]}
                onPress={handleConfirm}
              >
                <Text style={confirmStyles.btnText}>
                  Confirm {tradeModal === 'buy' ? 'Buy' : 'Sell'}
                </Text>
              </Pressable>
              <Pressable onPress={() => setConfirmVisible(false)}>
                <Text style={confirmStyles.back}>Go Back</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </Modal>
    </View>
  );
}

/* ─── Small helper components ─── */

function PositionRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <View style={styles.positionRow}>
      <Text style={styles.positionLabel}>{label}</Text>
      <Text style={[styles.positionValue, valueColor ? { color: valueColor } : undefined]}>{value}</Text>
    </View>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <View style={styles.statCell}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

/* ─── Styles ─── */

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.colors.background },
    scroll: { flex: 1 },
    scrollContent: { padding: 20 },

    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 20,
    },
    ticker: { fontSize: 28, fontWeight: '800', color: theme.colors.textPrimary, letterSpacing: 1 },
    company: { fontSize: 14, color: theme.colors.textMuted, marginTop: 2 },
    priceBlock: { alignItems: 'flex-end' },
    price: { fontSize: 26, fontWeight: '800', color: theme.colors.textPrimary },
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      marginTop: 4,
    },
    badgeText: { fontSize: 13, fontWeight: '700' },

    chartCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 14,
      padding: 16,
      marginBottom: 20,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    chart: {
      height: 140,
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 4,
    },
    barWrapper: { flex: 1, justifyContent: 'flex-end' },
    bar: { borderRadius: 3, minHeight: 3 },
    timeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 14,
    },
    timeBtn: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    timeBtnActive: {
      backgroundColor: theme.colors.surfaceMuted,
    },
    timeBtnText: { fontSize: 12, fontWeight: '600', color: theme.colors.textMuted },
    timeBtnTextActive: { color: theme.colors.textPrimary },

    actionRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
    },
    actionBtn: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
    },
    buyBtn: { backgroundColor: theme.colors.primary },
    sellBtn: { backgroundColor: theme.colors.danger },
    actionBtnText: { fontSize: 16, fontWeight: '800', color: '#ffffff' },

    section: { marginBottom: 24 },
    sectionTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 10,
    },

    positionCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 14,
      gap: 10,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    positionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    positionLabel: { fontSize: 14, color: theme.colors.textMuted },
    positionValue: { fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary },

    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 14,
      gap: 4,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    statCell: {
      width: '48%',
      paddingVertical: 8,
    },
    statLabel: { fontSize: 11, color: theme.colors.textMuted, marginBottom: 2 },
    statValue: { fontSize: 14, fontWeight: '600', color: theme.colors.textSecondary },

    aboutText: { fontSize: 14, color: theme.colors.textSecondary, lineHeight: 20 },
  });
}

function makeModalStyles(theme: Theme) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.6)',
    },
    sheet: {
      backgroundColor: theme.colors.surfaceElevated,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      paddingBottom: 40,
    },
    handle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.colors.border,
      alignSelf: 'center',
      marginBottom: 20,
    },
    title: { fontSize: 22, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 4 },
    subtitle: { fontSize: 14, color: theme.colors.textMuted, marginBottom: 20 },

    toggleRow: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: 10,
      padding: 3,
      marginBottom: 20,
    },
    toggleBtn: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      borderRadius: 8,
    },
    toggleActive: { backgroundColor: theme.colors.surface },
    toggleText: { fontSize: 14, fontWeight: '600', color: theme.colors.textMuted },
    toggleTextActive: { color: theme.colors.textPrimary },

    inputLabel: { fontSize: 12, color: theme.colors.textMuted, marginBottom: 6 },
    input: {
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: 10,
      padding: 14,
      color: theme.colors.textPrimary,
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 16,
    },

    estimateRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.divider,
    },
    estimateLabel: { fontSize: 14, color: theme.colors.textMuted },
    estimateValue: { fontSize: 18, fontWeight: '800', color: theme.colors.textPrimary },

    submitBtn: {
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 12,
    },
    submitBuy: { backgroundColor: theme.colors.primary },
    submitSell: { backgroundColor: theme.colors.danger },
    submitDisabled: { opacity: 0.4 },
    submitText: { fontSize: 16, fontWeight: '800', color: '#ffffff' },

    cancelBtn: { alignItems: 'center', paddingVertical: 8 },
    cancelText: { fontSize: 14, color: theme.colors.textMuted },
  });
}

function makeConfirmStyles(theme: Theme) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.7)',
    },
    card: {
      width: '85%',
      backgroundColor: theme.colors.surfaceElevated,
      borderRadius: 18,
      padding: 24,
    },
    title: {
      fontSize: 20,
      fontWeight: '800',
      color: theme.colors.textPrimary,
      textAlign: 'center',
      marginBottom: 20,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    label: { fontSize: 14, color: theme.colors.textMuted },
    value: { fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary },
    divider: { height: 1, backgroundColor: theme.colors.divider, marginVertical: 8 },
    btn: {
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 16,
    },
    btnText: { fontSize: 16, fontWeight: '800', color: '#ffffff' },
    back: {
      fontSize: 14,
      color: theme.colors.textMuted,
      textAlign: 'center',
      marginTop: 12,
    },
  });
}
