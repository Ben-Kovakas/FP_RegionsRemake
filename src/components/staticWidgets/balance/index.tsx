import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WidgetShell from "../../widgetGrid/WidgetShell";

const accounts = [
    { name: 'CHECKING 3456', balance: '$1,231.00' },
    { name: 'SAVINGS 7890', balance: '$8,085.47' },
    { name: 'CREDIT CARD 1234', balance: '$340.22' },
];

//1x1 — single account, name + balance centered in widget

export function BalanceWidget1x1() {
    return (
        <WidgetShell size="1x1" onPress={() => console.log('tapped')}>
            <View style={styles.container1x1}>
                <Text style={styles.accountName}>{accounts[0].name}</Text>
                <Text style={styles.balanceLarge}>{accounts[0].balance}</Text>
            </View>
        </WidgetShell>
    );
}

//2x1 — list of accounts with balances

export function BalanceWidget2x1() {
    return (
        <WidgetShell size="2x1" onPress={() => console.log('tapped')}>
            <View style={styles.container}>
                {accounts.map((acct, i) => (
                    <View key={i} style={[styles.accountRow, i < accounts.length - 1 && styles.accountRowBorder]}>
                        <Text style={styles.accountName}>{acct.name}</Text>
                        <Text style={[styles.balanceSmall, acct.balance.startsWith('-') && styles.negative]}>
                            {acct.balance}
                        </Text>
                    </View>
                ))}
            </View>
        </WidgetShell>
    );
}

// 2x2 — total balance + list of accounts with corresponding balances

const totalBalance = accounts.reduce((sum, acct) => {
    const num = parseFloat(acct.balance.replace(/[$,]/g, ''));
    return sum + (isNaN(num) ? 0 : num);
}, 0);

export function BalanceWidget2x2() {
    return (
        <WidgetShell size="2x4" onPress={() => console.log('tapped')}>
            <View style={styles.container}>

                <View style={styles.totalSection}>
                    <Text style={styles.totalLabel}>Total balance</Text>
                    <Text style={styles.totalBalance}>${totalBalance}</Text>
                    <Text style={[styles.caption, styles.bold]}>↑ $240.00 this month</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.accountList}>
                    {accounts.map((acct, i) => (
                        <View key={i} style={styles.accountRow2x2}>
                            <View style={styles.accountDot} />
                            <Text style={styles.accountName2x2}>{acct.name}</Text>
                            <Text style={[styles.balanceSmall, acct.balance.startsWith('-') && styles.negative]}>
                                {acct.balance}
                            </Text>
                        </View>
                    ))}
                </View>

                <Text style={[styles.caption, styles.italic]}>Updated just now</Text>

            </View>
        </WidgetShell>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
        gap: 4,
        backgroundColor: '#88bd40'
    },
    container1x1: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
        gap: 2,
        backgroundColor: '#88bd40'

    },

    // Account name
    accountName: {
        fontSize: 10,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },

    // Large balance (1x1)
    balanceLarge: {
        fontSize: 18,
        fontWeight: '500',
        color: '#1A1A1A',
        marginTop: 2,
    },

    // Small balance (2x1)
    balanceSmall: {
        fontSize: 12,
        fontWeight: '500',
        color: '#1A1A1A',
    },
    negative: {
        color: '#A32D2D',
    },

    // Row (2x1)
    accountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 3,
    },
    accountRowBorder: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#55893D',
    },

    // 2x2 total section
    totalSection: {
        gap: 2,
    },
    totalLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    totalBalance: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    caption: {
        fontSize: 11,
        color: '#FFFFFF',
        marginTop: 2,
    },
    italic: {
        fontStyle: 'italic',
    },
    bold: {
        fontWeight: 'bold',
    },

    divider: {
        height: 0.5,
        backgroundColor: '#55893D',
        marginVertical: 8,
    },

    // 2x2 account list
    accountList: {
        gap: 30,
        flex: 1,
        justifyContent: 'center',
    },
    accountRow2x2: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    accountDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#55893D',
    },
    accountName2x2: {
        fontSize: 13,
        color: '#FFFFFF',
        flex: 1,
    },
});