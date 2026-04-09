import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CHART_POINTS, STOCKS, StockData } from '@/components/stockWidget/stockData';

const TIME_RANGES = ['1D', '1W', '1M', '3M', '1Y', 'ALL'] as const;

export default function StockDetailScreen() {
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
  const changeColor = isPositive ? '#4CAF50' : '#F44336';
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
              valueColor="#4CAF50"
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
        <View style={modal.overlay}>
          <View style={modal.sheet}>
            <View style={modal.handle} />

            <Text style={modal.title}>
              {tradeModal === 'buy' ? 'Buy' : 'Sell'} {stock.ticker}
            </Text>
            <Text style={modal.subtitle}>
              Market Price: ${stock.price.toFixed(2)}
            </Text>

            {/* Order Type Toggle */}
            <View style={modal.toggleRow}>
              <Pressable
                style={[modal.toggleBtn, orderType === 'market' && modal.toggleActive]}
                onPress={() => setOrderType('market')}
              >
                <Text style={[modal.toggleText, orderType === 'market' && modal.toggleTextActive]}>
                  Market
                </Text>
              </Pressable>
              <Pressable
                style={[modal.toggleBtn, orderType === 'limit' && modal.toggleActive]}
                onPress={() => setOrderType('limit')}
              >
                <Text style={[modal.toggleText, orderType === 'limit' && modal.toggleTextActive]}>
                  Limit
                </Text>
              </Pressable>
            </View>

            {/* Shares Input */}
            <Text style={modal.inputLabel}>Number of Shares</Text>
            <TextInput
              style={modal.input}
              value={shares}
              onChangeText={setShares}
              placeholder="0"
              placeholderTextColor="#555"
              keyboardType="decimal-pad"
            />

            {/* Limit Price Input */}
            {orderType === 'limit' && (
              <>
                <Text style={modal.inputLabel}>Limit Price ($)</Text>
                <TextInput
                  style={modal.input}
                  value={limitPrice}
                  onChangeText={setLimitPrice}
                  placeholder={stock.price.toFixed(2)}
                  placeholderTextColor="#555"
                  keyboardType="decimal-pad"
                />
              </>
            )}

            {/* Estimated Cost */}
            <View style={modal.estimateRow}>
              <Text style={modal.estimateLabel}>
                Estimated {tradeModal === 'buy' ? 'Cost' : 'Credit'}
              </Text>
              <Text style={modal.estimateValue}>${estimatedCost.toFixed(2)}</Text>
            </View>

            {/* Submit */}
            <Pressable
              style={[
                modal.submitBtn,
                tradeModal === 'buy' ? modal.submitBuy : modal.submitSell,
                (!shares || parseFloat(shares) <= 0) && modal.submitDisabled,
              ]}
              onPress={handleSubmitOrder}
              disabled={!shares || parseFloat(shares) <= 0}
            >
              <Text style={modal.submitText}>
                Review {tradeModal === 'buy' ? 'Buy' : 'Sell'} Order
              </Text>
            </Pressable>

            <Pressable style={modal.cancelBtn} onPress={() => { setTradeModal(null); setShares(''); setLimitPrice(''); }}>
              <Text style={modal.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>

        {/* ─── Confirmation Sub-Modal ─── */}
        <Modal visible={confirmVisible} animationType="fade" transparent>
          <View style={confirm.overlay}>
            <View style={confirm.card}>
              <Text style={confirm.title}>Confirm Order</Text>
              <View style={confirm.row}>
                <Text style={confirm.label}>Action</Text>
                <Text style={[confirm.value, { color: tradeModal === 'buy' ? '#4CAF50' : '#F44336' }]}>
                  {tradeModal === 'buy' ? 'BUY' : 'SELL'}
                </Text>
              </View>
              <View style={confirm.row}>
                <Text style={confirm.label}>Ticker</Text>
                <Text style={confirm.value}>{stock.ticker}</Text>
              </View>
              <View style={confirm.row}>
                <Text style={confirm.label}>Shares</Text>
                <Text style={confirm.value}>{shares}</Text>
              </View>
              <View style={confirm.row}>
                <Text style={confirm.label}>Order Type</Text>
                <Text style={confirm.value}>{orderType === 'market' ? 'Market' : `Limit @ $${limitPrice || stock.price.toFixed(2)}`}</Text>
              </View>
              <View style={confirm.divider} />
              <View style={confirm.row}>
                <Text style={confirm.label}>Est. Total</Text>
                <Text style={[confirm.value, { fontWeight: '800' }]}>${estimatedCost.toFixed(2)}</Text>
              </View>

              <Pressable
                style={[confirm.btn, tradeModal === 'buy' ? modal.submitBuy : modal.submitSell]}
                onPress={handleConfirm}
              >
                <Text style={confirm.btnText}>
                  Confirm {tradeModal === 'buy' ? 'Buy' : 'Sell'}
                </Text>
              </Pressable>
              <Pressable onPress={() => setConfirmVisible(false)}>
                <Text style={confirm.back}>Go Back</Text>
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
  return (
    <View style={styles.positionRow}>
      <Text style={styles.positionLabel}>{label}</Text>
      <Text style={[styles.positionValue, valueColor ? { color: valueColor } : undefined]}>{value}</Text>
    </View>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCell}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

/* ─── Styles ─── */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0d0d1a' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  ticker: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  company: { fontSize: 14, color: '#888', marginTop: 2 },
  priceBlock: { alignItems: 'flex-end' },
  price: { fontSize: 26, fontWeight: '800', color: '#fff' },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
  },
  badgeText: { fontSize: 13, fontWeight: '700' },

  chartCard: {
    backgroundColor: '#141428',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
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
    backgroundColor: '#2a2a4e',
  },
  timeBtnText: { fontSize: 12, fontWeight: '600', color: '#666' },
  timeBtnTextActive: { color: '#fff' },

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
  buyBtn: { backgroundColor: '#4CAF50' },
  sellBtn: { backgroundColor: '#F44336' },
  actionBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },

  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },

  positionCard: {
    backgroundColor: '#141428',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  positionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  positionLabel: { fontSize: 14, color: '#888' },
  positionValue: { fontSize: 14, fontWeight: '600', color: '#fff' },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#141428',
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  statCell: {
    width: '48%',
    paddingVertical: 8,
  },
  statLabel: { fontSize: 11, color: '#666', marginBottom: 2 },
  statValue: { fontSize: 14, fontWeight: '600', color: '#ccc' },

  aboutText: { fontSize: 14, color: '#999', lineHeight: 20 },
});

const modal = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#333',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 20 },

  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#0d0d1a',
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
  toggleActive: { backgroundColor: '#2a2a4e' },
  toggleText: { fontSize: 14, fontWeight: '600', color: '#666' },
  toggleTextActive: { color: '#fff' },

  inputLabel: { fontSize: 12, color: '#888', marginBottom: 6 },
  input: {
    backgroundColor: '#0d0d1a',
    borderRadius: 10,
    padding: 14,
    color: '#fff',
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
    borderTopColor: '#2a2a3e',
  },
  estimateLabel: { fontSize: 14, color: '#888' },
  estimateValue: { fontSize: 18, fontWeight: '800', color: '#fff' },

  submitBtn: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitBuy: { backgroundColor: '#4CAF50' },
  submitSell: { backgroundColor: '#F44336' },
  submitDisabled: { opacity: 0.4 },
  submitText: { fontSize: 16, fontWeight: '800', color: '#fff' },

  cancelBtn: { alignItems: 'center', paddingVertical: 8 },
  cancelText: { fontSize: 14, color: '#888' },
});

const confirm = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  card: {
    width: '85%',
    backgroundColor: '#1a1a2e',
    borderRadius: 18,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  label: { fontSize: 14, color: '#888' },
  value: { fontSize: 14, fontWeight: '600', color: '#fff' },
  divider: { height: 1, backgroundColor: '#2a2a3e', marginVertical: 8 },
  btn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  btnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  back: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 12,
  },
});
