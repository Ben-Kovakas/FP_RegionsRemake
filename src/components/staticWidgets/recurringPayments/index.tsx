import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WidgetShell from "../../widgetGrid/WidgetShell";

//Data

const payments = [
    { name: 'Netflix',     amount: 15.99,  daysLeft: 1,  cycleDays: 30 },
    { name: 'Rent',        amount: 1250.00, daysLeft: 8,  cycleDays: 30 },
    { name: 'Spotify',     amount: 9.99,   daysLeft: 14, cycleDays: 30 },
    { name: 'Electric',    amount: 94.00,  daysLeft: 21, cycleDays: 30 },
];

//progress Bar

function ProgressBar({ daysLeft, cycleDays }: { daysLeft: number; cycleDays: number }) {
    const progress = 1 - daysLeft / cycleDays;
    const urgent = daysLeft <= 3;

    return (
        <View style={styles.trackOuter}>
            <View style={[
                styles.trackFill,
                { width: `${Math.round(progress * 100)}%` as any },
                urgent && styles.trackUrgent,
            ]} />
        </View>
    );
}

//2x1 — next payment + 2 upcoming, with mini progress bars

export function RecurringWidget2x1() {
    const next = payments[0];

    return (
        <WidgetShell size="2x1" onPress={() => console.log('tapped')}>
            <View style={styles.container}>
                <View style={styles.row}>
                    <Text style={styles.sectionLabel}>Next due</Text>
                    <Text style={styles.urgentTag}>{next.daysLeft} day{next.daysLeft !== 1 ? 's' : ''}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.paymentName}>{next.name}</Text>
                    <Text style={styles.paymentAmount}>${next.amount.toFixed(2)}</Text>
                </View>
                <ProgressBar daysLeft={next.daysLeft} cycleDays={next.cycleDays} />
                <View style={styles.divider} />
                {payments.slice(1, 3).map((p, i) => (
                    <View key={i} style={styles.miniRow}>
                        <Text style={styles.miniName}>{p.name}</Text>
                        <Text style={styles.miniDays}>{p.daysLeft}d</Text>
                        <View style={styles.miniTrackOuter}>
                            <View style={[
                                styles.miniTrackFill,
                                { width: `${Math.round((1 - p.daysLeft / p.cycleDays) * 100)}%` as any },
                            ]} />
                        </View>
                        <Text style={styles.miniAmount}>${p.amount.toFixed(2)}</Text>
                    </View>
                ))}
            </View>
        </WidgetShell>
    );
}

//2x2 — list of 4 upcoming payments with details and progress bars

export function RecurringWidget2x2() {
    const total = payments.reduce((sum, p) => sum + p.amount, 0);

    return (
        <WidgetShell size="2x2" onPress={() => console.log('tapped')}>
            <View style={styles.container}>
                <View style={styles.row}>
                    <Text style={styles.sectionLabel}>Recurring payments</Text>
                    <Text style={styles.totalLabel}>${total.toFixed(2)}/mo</Text>
                </View>
                <View style={styles.divider} />
                {payments.map((p, i) => (
                    <View key={i} style={styles.paymentBlock}>
                        <View style={styles.row}>
                            <Text style={styles.paymentName}>{p.name}</Text>
                            <Text style={styles.paymentAmount}>${p.amount.toFixed(2)}</Text>
                        </View>
                        <View style={styles.progressRow}>
                            <ProgressBar daysLeft={p.daysLeft} cycleDays={p.cycleDays} />
                            <Text style={[
                                styles.daysLabel,
                                p.daysLeft <= 3 && styles.daysUrgent,
                            ]}>
                                {p.daysLeft}d
                            </Text>
                        </View>
                        {i < payments.length - 1 && <View style={styles.dividerThin} />}
                    </View>
                ))}
                <View style={styles.divider} />
                <Text style={styles.footerLabel}>Next payday in 6 days</Text>
            </View>
        </WidgetShell>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#88bd40',
        padding: 14,
        justifyContent: 'center',
        gap: 6,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionLabel: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.65)',
    },
    totalLabel: {
        fontSize: 11,
        fontWeight: '500',
        color: '#ffffff',
    },
    urgentTag: {
        fontSize: 11,
        fontWeight: '500',
        color: '#fff8e0',
    },
    paymentName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#ffffff',
    },
    paymentAmount: {
        fontSize: 13,
        fontWeight: '500',
        color: '#ffffff',
    },

    // Progress bar
    trackOuter: {
        height: 5,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.25)',
        overflow: 'hidden',
        marginTop: 4,
    },
    trackFill: {
        height: '100%',
        borderRadius: 3,
        backgroundColor: '#ffffff',
    },
    trackUrgent: {
        backgroundColor: '#fff176',
    },

    divider: {
        height: 0.5,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginVertical: 2,
    },
    dividerThin: {
        height: 0.5,
        backgroundColor: 'rgba(255,255,255,0.15)',
        marginVertical: 4,
    },

    // Mini rows (2x1)
    miniRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    miniName: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.75)',
        width: 48,
    },
    miniDays: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.55)',
        width: 18,
        textAlign: 'right',
    },
    miniTrackOuter: {
        flex: 1,
        height: 3,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.2)',
        overflow: 'hidden',
    },
    miniTrackFill: {
        height: '100%',
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.7)',
    },
    miniAmount: {
        fontSize: 11,
        color: '#ffffff',
        width: 44,
        textAlign: 'right',
    },

    // 2x2 payment blocks
    paymentBlock: {
        gap: 2,
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    daysLabel: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.55)',
        width: 20,
        textAlign: 'right',
    },
    daysUrgent: {
        color: '#fff176',
    },
    footerLabel: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.55)',
        textAlign: 'center',
    },
});