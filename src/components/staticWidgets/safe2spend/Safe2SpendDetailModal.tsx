import { Theme, useTheme } from '@/theme';
import React from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

type Props = {
    visible: boolean;
    onClose: () => void;
};

// Hard-coded example data for the Safe2Spend detail view.
// Today is assumed to be the first day of the week (Monday). Payday lands on Sunday.
const STARTING_BALANCE = 1682.50;
const SAFE_AMOUNT = 482.50;
const DAYS_UNTIL_PAYDAY = 6;
const COMFORTABLE_DAILY_SPEND = SAFE_AMOUNT / DAYS_UNTIL_PAYDAY;

type DayEvent = {
    label: string;
    amount: number;
    kind: 'bill' | 'payday' | 'spend';
};

type DayEntry = {
    dayShort: string;
    dateNumber: number;
    projectedBalance: number;
    events: DayEvent[];
    isToday?: boolean;
    isPayday?: boolean;
};

const WEEK: DayEntry[] = [
    {
        dayShort: 'Mon',
        dateNumber: 20,
        projectedBalance: 1682.50,
        events: [{ label: 'Today', amount: 0, kind: 'spend' }],
        isToday: true,
    },
    {
        dayShort: 'Tue',
        dateNumber: 21,
        projectedBalance: 1602.08,
        events: [{ label: 'Daily spend', amount: -80, kind: 'spend' }],
    },
    {
        dayShort: 'Wed',
        dateNumber: 22,
        projectedBalance: 1402.08,
        events: [
            { label: 'Daily spend', amount: -80, kind: 'spend' },
            { label: 'Internet bill', amount: -120, kind: 'bill' },
        ],
    },
    {
        dayShort: 'Thu',
        dateNumber: 23,
        projectedBalance: 1322.08,
        events: [{ label: 'Daily spend', amount: -80, kind: 'spend' }],
    },
    {
        dayShort: 'Fri',
        dateNumber: 24,
        projectedBalance: 1197.08,
        events: [
            { label: 'Daily spend', amount: -80, kind: 'spend' },
            { label: 'Streaming', amount: -45, kind: 'bill' },
        ],
    },
    {
        dayShort: 'Sat',
        dateNumber: 25,
        projectedBalance: 1117.08,
        events: [{ label: 'Daily spend', amount: -80, kind: 'spend' }],
    },
    {
        dayShort: 'Sun',
        dateNumber: 26,
        projectedBalance: 2537.08,
        events: [
            { label: 'Daily spend', amount: -80, kind: 'spend' },
            { label: 'Payday', amount: 1500, kind: 'payday' },
        ],
        isPayday: true,
    },
];

function formatCurrency(value: number, opts?: { showSign?: boolean }) {
    const sign = opts?.showSign && value > 0 ? '+' : '';
    const abs = Math.abs(value);
    const formatted = abs.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return `${sign}${value < 0 ? '-' : ''}$${formatted}`;
}

// Redundantly encoded: shape (circle vs square) + symbol (+ vs −) + color.
// Size can be tuned per-usage (calendar strip cells are tight).
function Marker({
    kind,
    size = 14,
}: {
    kind: 'bill' | 'payday';
    size?: number;
}) {
    const theme = useTheme();
    const styles = React.useMemo(() => makeStyles(theme), [theme]);
    const isPayday = kind === 'payday';
    return (
        <View
            style={[
                {
                    width: size,
                    height: size,
                    borderRadius: isPayday ? size / 2 : 3,
                    backgroundColor: isPayday ? theme.colors.primary : theme.colors.danger,
                },
                styles.markerBase,
            ]}
        >
            <Text
                style={[
                    styles.markerGlyph,
                    { fontSize: Math.max(size - 4, 8), lineHeight: size },
                ]}
            >
                {isPayday ? '+' : '−'}
            </Text>
        </View>
    );
}

// Balance-over-the-week line chart. Draws the line/area in SVG and overlays
// day labels + event markers as absolutely-positioned RN Views so the existing
// Marker component (shapes + symbols) is reused consistently.
// Pick a "nice" axis step (1 / 2 / 5 × power of 10) for the given range.
function niceTickStep(range: number, targetTicks: number = 4): number {
    if (range <= 0) return 1;
    const raw = range / targetTicks;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const normalized = raw / mag;
    const factor = normalized < 1.5 ? 1 : normalized < 3 ? 2 : normalized < 7 ? 5 : 10;
    return factor * mag;
}

function WeekBalanceChart({ days }: { days: DayEntry[] }) {
    const theme = useTheme();
    const styles = React.useMemo(() => makeStyles(theme), [theme]);
    const [width, setWidth] = React.useState(0);
    const height = 170;
    const padTop = 26; // room above line for markers
    const padBottom = 32; // room below plot for day labels
    const padLeft = 46; // room on the left for $ tick labels
    const padRight = 14;

    const plotW = Math.max(width - padLeft - padRight, 0);
    const plotH = height - padTop - padBottom;

    const balances = days.map((d) => d.projectedBalance);
    const minBal = Math.min(...balances);
    const maxBal = Math.max(...balances);
    // Pad the range a bit so the line never hugs the top/bottom edges.
    const range = (maxBal - minBal) || 1;
    const yPad = range * 0.15;
    const yMin = minBal - yPad;
    const yMax = maxBal + yPad;
    const yRange = yMax - yMin;

    const xFor = (i: number) =>
        padLeft + (days.length <= 1 ? plotW / 2 : (i / (days.length - 1)) * plotW);
    const yFor = (b: number) => padTop + (1 - (b - yMin) / yRange) * plotH;

    // Generate tick values snapped to nice round dollar amounts.
    const tickStep = niceTickStep(yRange, 4);
    const firstTick = Math.ceil(yMin / tickStep) * tickStep;
    const lastTick = Math.floor(yMax / tickStep) * tickStep;
    const ticks: { value: number; y: number }[] = [];
    for (let v = firstTick; v <= lastTick + 0.0001; v += tickStep) {
        ticks.push({ value: v, y: yFor(v) });
    }

    const points = days.map((d, i) => ({
        x: xFor(i),
        y: yFor(d.projectedBalance),
    }));

    const linePath = points
        .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
        .join(' ');

    const areaPath =
        linePath +
        ` L${xFor(days.length - 1).toFixed(2)},${(padTop + plotH).toFixed(2)}` +
        ` L${xFor(0).toFixed(2)},${(padTop + plotH).toFixed(2)} Z`;

    const primary = theme.colors.primary;
    const primaryStrong = theme.colors.primaryStrong;
    const gridStroke =
        theme.mode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
    const pointFillToday = theme.colors.textPrimary;
    const pointFillRest = theme.colors.surface;

    return (
        <View
            style={styles.chartContainer}
            onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        >
            {width > 0 && (
                <>
                    <Svg width={width} height={height}>
                        <Defs>
                            <LinearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                                <Stop offset="0" stopColor={primary} stopOpacity="0.45" />
                                <Stop offset="1" stopColor={primary} stopOpacity="0.02" />
                            </LinearGradient>
                        </Defs>

                        {/* Horizontal gridlines at each tick */}
                        {ticks.map((t) => (
                            <Path
                                key={`grid-${t.value}`}
                                d={`M${padLeft},${t.y.toFixed(2)} L${(padLeft + plotW).toFixed(2)},${t.y.toFixed(2)}`}
                                stroke={gridStroke}
                                strokeWidth={1}
                            />
                        ))}

                        <Path d={areaPath} fill="url(#areaFill)" />
                        <Path
                            d={linePath}
                            stroke={primaryStrong}
                            strokeWidth={2}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {points.map((p, i) => {
                            const d = days[i];
                            const r = d.isToday ? 5 : 3;
                            return (
                                <Circle
                                    key={d.dayShort}
                                    cx={p.x}
                                    cy={p.y}
                                    r={r}
                                    fill={d.isToday ? pointFillToday : pointFillRest}
                                    stroke={primaryStrong}
                                    strokeWidth={2}
                                />
                            );
                        })}
                    </Svg>

                    {/* Y-axis dollar labels (left gutter) */}
                    {ticks.map((t) => (
                        <Text
                            key={`ylabel-${t.value}`}
                            style={[
                                styles.chartYLabel,
                                {
                                    top: t.y - 7,
                                    width: padLeft - 6,
                                },
                            ]}
                            numberOfLines={1}
                        >
                            ${t.value.toLocaleString()}
                        </Text>
                    ))}

                    {/* Day labels under the plot area */}
                    {days.map((d, i) => (
                        <Text
                            key={`label-${d.dayShort}`}
                            style={[
                                styles.chartDayLabel,
                                {
                                    left: xFor(i) - 20,
                                    top: padTop + plotH + 8,
                                },
                                d.isToday && styles.chartDayLabelToday,
                            ]}
                            numberOfLines={1}
                        >
                            {d.dayShort}
                        </Text>
                    ))}

                    {/* Event markers floating above each event day */}
                    {days.map((d, i) => {
                        const hasBill = d.events.some((e) => e.kind === 'bill');
                        const isPayday = d.isPayday === true;
                        if (!hasBill && !isPayday) return null;
                        const markerSize = 14;
                        const count = (hasBill ? 1 : 0) + (isPayday ? 1 : 0);
                        const groupWidth = markerSize * count + (count - 1) * 3;
                        return (
                            <View
                                key={`marker-${d.dayShort}`}
                                style={[
                                    styles.chartMarkerStack,
                                    {
                                        left: xFor(i) - groupWidth / 2,
                                        top: yFor(d.projectedBalance) - markerSize - 10,
                                    },
                                ]}
                            >
                                {hasBill && <Marker kind="bill" size={markerSize} />}
                                {isPayday && <Marker kind="payday" size={markerSize} />}
                            </View>
                        );
                    })}

                    {/* Today callout: small balance chip above today's dot */}
                    {days.map((d, i) => {
                        if (!d.isToday) return null;
                        return (
                            <View
                                key={`today-chip-${d.dayShort}`}
                                style={[
                                    styles.chartTodayChip,
                                    {
                                        left: xFor(i) - 32,
                                        top: yFor(d.projectedBalance) - 32,
                                    },
                                ]}
                            >
                                <Text style={styles.chartTodayChipText}>
                                    ${Math.round(d.projectedBalance).toLocaleString()}
                                </Text>
                            </View>
                        );
                    })}
                </>
            )}
        </View>
    );
}

export default function Safe2SpendDetailModal({ visible, onClose }: Props) {
    const theme = useTheme();
    const styles = React.useMemo(() => makeStyles(theme), [theme]);
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.backdrop} onPress={onClose}>
                {/* Inner Pressable swallows taps so the card itself doesn't close the modal */}
                <Pressable style={styles.card} onPress={() => { }}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Safe to spend</Text>
                        <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
                            <Text style={styles.closeBtnText}>✕</Text>
                        </Pressable>
                    </View>

                    <View style={styles.heroBlock}>
                        <Text style={styles.heroCaption}>You can comfortably spend</Text>
                        <Text style={styles.heroAmount}>
                            ${COMFORTABLE_DAILY_SPEND.toFixed(2)}
                            <Text style={styles.heroUnit}> / day</Text>
                        </Text>
                        <Text style={styles.heroSubtitle}>
                            until your next payday in {DAYS_UNTIL_PAYDAY} days
                        </Text>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statCell}>
                            <Text style={styles.statLabel}>Current</Text>
                            <Text style={styles.statValue}>
                                ${STARTING_BALANCE.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statCell}>
                            <Text style={styles.statLabel}>Safe to spend</Text>
                            <Text style={[styles.statValue, styles.statValueAccent]}>
                                ${SAFE_AMOUNT.toFixed(2)}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.sectionLabel}>This week</Text>

                    <WeekBalanceChart days={WEEK} />

                    <View style={styles.legendRow}>
                        <View style={styles.legendItem}>
                            <Marker kind="bill" size={14} />
                            <Text style={styles.legendText}>Bill</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <Marker kind="payday" size={14} />
                            <Text style={styles.legendText}>Payday</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionLabel}>Upcoming this week</Text>

                    <View style={styles.eventList}>
                        {WEEK.flatMap((day) =>
                            day.events
                                .filter((e) => e.kind !== 'spend')
                                .map((e) => (
                                    <View key={`${day.dayShort}-${e.label}`} style={styles.eventRow}>
                                        <View style={styles.eventLeft}>
                                            <Marker kind={e.kind === 'payday' ? 'payday' : 'bill'} size={18} />
                                            <View>
                                                <Text style={styles.eventLabel}>{e.label}</Text>
                                                <Text style={styles.eventDay}>
                                                    {day.dayShort} {day.dateNumber}
                                                </Text>
                                            </View>
                                        </View>
                                        <Text
                                            style={[
                                                styles.eventAmount,
                                                e.amount > 0 && styles.eventAmountPositive,
                                            ]}
                                        >
                                            {formatCurrency(e.amount, { showSign: true })}
                                        </Text>
                                    </View>
                                ))
                        )}
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

function makeStyles(theme: Theme) {
    const isDark = theme.mode === 'dark';
    const subtleFill = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
    const softFill = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
    const rowFill = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.035)';
    const chartFill = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';
    const chipBg = isDark ? theme.colors.textPrimary : theme.colors.textPrimary;
    const chipText = isDark ? theme.colors.surface : theme.colors.textInverse;
    return StyleSheet.create({
        backdrop: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.55)',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
        },
        card: {
            width: '100%',
            maxWidth: 420,
            backgroundColor: theme.colors.surfaceElevated,
            borderRadius: 18,
            padding: 20,
            gap: 14,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        headerTitle: {
            color: theme.colors.textPrimary,
            fontSize: 18,
            fontWeight: '600',
        },
        closeBtn: {
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: softFill,
            alignItems: 'center',
            justifyContent: 'center',
        },
        closeBtnText: {
            color: theme.colors.textPrimary,
            fontSize: 14,
            lineHeight: 16,
        },

        heroBlock: {
            backgroundColor: theme.colors.primary,
            borderRadius: 14,
            padding: 16,
            alignItems: 'center',
            gap: 4,
        },
        heroCaption: {
            color: theme.colors.onPrimaryMuted,
            fontSize: 12,
        },
        heroAmount: {
            color: theme.colors.onPrimary,
            fontSize: 34,
            fontWeight: '700',
        },
        heroUnit: {
            fontSize: 16,
            fontWeight: '500',
            color: theme.colors.onPrimaryMuted,
        },
        heroSubtitle: {
            color: theme.colors.onPrimaryMuted,
            fontSize: 13,
        },

        statsRow: {
            flexDirection: 'row',
            backgroundColor: subtleFill,
            borderRadius: 12,
            paddingVertical: 12,
            alignItems: 'center',
        },
        statCell: {
            flex: 1,
            alignItems: 'center',
            gap: 2,
        },
        statDivider: {
            width: 1,
            alignSelf: 'stretch',
            backgroundColor: softFill,
        },
        statLabel: {
            color: theme.colors.textMuted,
            fontSize: 11,
        },
        statValue: {
            color: theme.colors.textPrimary,
            fontSize: 16,
            fontWeight: '600',
        },
        statValueAccent: {
            color: theme.colors.primaryStrong,
        },

        sectionLabel: {
            color: theme.colors.textSecondary,
            fontSize: 12,
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: 0.6,
        },

        chartContainer: {
            width: '100%',
            height: 170,
            position: 'relative',
            backgroundColor: chartFill,
            borderRadius: 12,
            overflow: 'hidden',
        },
        chartYLabel: {
            position: 'absolute',
            left: 4,
            color: theme.colors.textMuted,
            fontSize: 10,
            fontWeight: '500',
            textAlign: 'right',
        },
        chartDayLabel: {
            position: 'absolute',
            width: 40,
            textAlign: 'center',
            color: theme.colors.textMuted,
            fontSize: 11,
            fontWeight: '500',
        },
        chartDayLabelToday: {
            color: theme.colors.textPrimary,
            fontWeight: '700',
        },
        chartMarkerStack: {
            position: 'absolute',
            flexDirection: 'row',
            gap: 3,
        },
        chartTodayChip: {
            position: 'absolute',
            width: 64,
            alignItems: 'center',
            paddingVertical: 2,
            borderRadius: 6,
            backgroundColor: chipBg,
        },
        chartTodayChipText: {
            color: chipText,
            fontSize: 11,
            fontWeight: '700',
        },

        markerBase: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        markerGlyph: {
            color: '#ffffff',
            fontWeight: '800',
            textAlign: 'center',
            includeFontPadding: false,
        },

        legendRow: {
            flexDirection: 'row',
            gap: 14,
        },
        legendItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        legendText: {
            color: theme.colors.textSecondary,
            fontSize: 11,
        },

        eventList: {
            gap: 10,
        },
        eventRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 8,
            paddingHorizontal: 12,
            backgroundColor: rowFill,
            borderRadius: 10,
        },
        eventLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        },
        eventLabel: {
            color: theme.colors.textPrimary,
            fontSize: 13,
            fontWeight: '500',
        },
        eventDay: {
            color: theme.colors.textMuted,
            fontSize: 11,
        },
        eventAmount: {
            color: theme.colors.danger,
            fontSize: 14,
            fontWeight: '600',
        },
        eventAmountPositive: {
            color: theme.colors.primaryStrong,
        },
    });
}
