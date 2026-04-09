import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import WidgetShell from "../../widgetGrid/WidgetShell";

const SAFE_AMOUNT = 482.50;
const TOTAL_BUDGET = 1200.00;
const NEXT_PAYDAY_DAYS = 6;
const RATIO = SAFE_AMOUNT / TOTAL_BUDGET;

//Donut ring component used in all widgets

function DonutRing({ size, strokeWidth }: { size: number; strokeWidth: number }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const greenArc = circumference * RATIO;
    const center = size / 2;

    return (
        <Svg width={size} height={size}>
            <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={strokeWidth}
                fill="none"
            />
            <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke="#ffffff"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${greenArc} ${circumference - greenArc}`}
                strokeDashoffset={circumference / 4}
                strokeLinecap="round"
            />
        </Svg>
    );
}

//1x1 — just the donut and amount, centered

export function Safe2SpendWidget1x1() {
    return (
        <WidgetShell size="1x1" onPress={() => console.log('tapped')}>
            <View style={styles.container1x1}>
                <View style={styles.donutWrap1x1}>
                    <DonutRing size={45} strokeWidth={5} />
                    <View style={styles.donutCenter}>
                        <Text style={styles.amountSmall}>${Math.round(SAFE_AMOUNT)}</Text>
                    </View>
                </View>
                <Text style={styles.label}>Safe to spend</Text>
            </View>
        </WidgetShell>
    );
}

//2x1 — donut on left, details on right

export function Safe2SpendWidget2x1() {
    return (
        <WidgetShell size="2x1" onPress={() => console.log('tapped')}>
            <View style={styles.container2x1}>
                <View style={styles.donutWrap2x1}>
                    <DonutRing size={70} strokeWidth={9} />
                    <View style={styles.donutCenter}>
                        <Text style={styles.amountMed}>${Math.round(SAFE_AMOUNT)}</Text>
                    </View>
                </View>
                <View style={styles.details}>
                    <Text style={styles.label}>Safe to spend</Text>
                    <Text style={styles.subLabel}>of ${TOTAL_BUDGET.toLocaleString()} budget</Text>
                    <View style={styles.divider} />
                    <Text style={styles.payday}>Next payday</Text>
                    <Text style={styles.paydayDays}>{NEXT_PAYDAY_DAYS} days</Text>
                </View>
            </View>
        </WidgetShell>
    );
}

//2x4 — larger donut on top, breakdown and payday info in rows below

export function Safe2SpendWidget2x2() {
    const spent = TOTAL_BUDGET - SAFE_AMOUNT;

    return (
        <WidgetShell size="2x4" onPress={() => console.log('tapped')}>
            <View style={styles.container2x2}>

                <View style={styles.donutWrap2x2}>
                    <DonutRing size={155} strokeWidth={10} />
                    <View style={styles.donutCenter}>
                        <Text style={styles.amountLarge}>${SAFE_AMOUNT.toFixed(2)}</Text>
                        <Text style={styles.amountCaption}>safe to spend</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Budget</Text>
                    <Text style={styles.rowValue}>${TOTAL_BUDGET.toLocaleString()}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Spent</Text>
                    <Text style={styles.rowValue}>${spent.toFixed(2)}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={[styles.rowLabel, styles.boldLabel]}>Safe to spend</Text>
                    <Text style={[styles.rowValue, styles.boldValue]}>${SAFE_AMOUNT.toFixed(2)}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.paydayRow}>
                    <Text style={styles.payday}>Next payday</Text>
                    <Text style={styles.paydayDays}>{NEXT_PAYDAY_DAYS} days</Text>
                </View>

            </View>
        </WidgetShell>
    );
}

const styles = StyleSheet.create({
    // 1x1
    container1x1: {
        flex: 1,
        backgroundColor: '#88bd40',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        padding: 1,
    },
    donutWrap1x1: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    amountSmall: {
        fontSize: 13,
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center',
    },

    // 2x1
    container2x1: {
        flex: 1,
        backgroundColor: '#88bd40',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 7,
        gap: 8,
    },
    donutWrap2x1: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    amountMed: {
        fontSize: 14,
        fontWeight: '500',
        color: '#ffffff',
    },
    details: {
        flex: 1,
        gap: 0,
    },
    subLabel: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.65)',
    },
    payday: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.65)',
    },
    paydayDays: {
        fontSize: 12,
        fontWeight: '500',
        color: '#ffffff',
    },

    // 2x2
    container2x2: {
        flex: 1,
        backgroundColor: '#88bd40',
        padding: 16,
        justifyContent: 'center',
        gap: 4,
    },
    donutWrap2x2: {
        alignSelf: 'center',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 25,
    },
    amountLarge: {
        fontSize: 20,
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center',
    },
    amountCaption: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.65)',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    rowLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.75)',
    },
    rowValue: {
        fontSize: 12,
        color: '#ffffff',
        fontWeight: '400',
    },
    boldLabel: {
        fontWeight: '500',
        color: '#ffffff',
    },
    boldValue: {
        fontWeight: '500',
    },
    paydayRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    // Shared
    donutCenter: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.75)',
        fontWeight: '400',
    },
    divider: {
        height: 0.5,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginVertical: 1,
    },
});