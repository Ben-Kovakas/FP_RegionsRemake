import { Theme, useTheme } from '@/theme';
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
    const theme = useTheme();
    const styles = React.useMemo(() => makeStyles(theme), [theme]);
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
    const theme = useTheme();
    const styles = React.useMemo(() => makeStyles(theme), [theme]);
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
    const theme = useTheme();
    const styles = React.useMemo(() => makeStyles(theme), [theme]);
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

function makeStyles(theme: Theme) {
    const divider = 'rgba(255,255,255,0.35)';
    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 12,
            justifyContent: 'center',
            gap: 4,
            backgroundColor: theme.colors.primary,
        },
        container1x1: {
            flex: 1,
            padding: 12,
            justifyContent: 'center',
            gap: 2,
            backgroundColor: theme.colors.primary,
        },

        // Account name
        accountName: {
            fontSize: 10,
            color: theme.colors.onPrimary,
            fontWeight: 'bold',
        },

        // Large balance (1x1). Dark text is intentional on the lime-green tile
        // and stays constant across themes because the tile background itself
        // doesn't swap.
        balanceLarge: {
            fontSize: 18,
            fontWeight: '500',
            color: '#1A1F17',
            marginTop: 2,
        },

        // Small balance (2x1)
        balanceSmall: {
            fontSize: 12,
            fontWeight: '500',
            color: '#1A1F17',
        },
        negative: {
            color: theme.colors.danger,
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
            borderBottomColor: divider,
        },

        // 2x2 total section
        totalSection: {
            gap: 2,
        },
        totalLabel: {
            fontSize: 11,
            fontWeight: 'bold',
            color: theme.colors.onPrimary,
        },
        totalBalance: {
            fontSize: 26,
            fontWeight: 'bold',
            color: '#1A1F17',
        },
        caption: {
            fontSize: 11,
            color: theme.colors.onPrimary,
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
            backgroundColor: divider,
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
            // Darker lime so the dot reads on the primary fill in both themes.
            backgroundColor: '#55893D',
        },
        accountName2x2: {
            fontSize: 13,
            color: theme.colors.onPrimary,
            flex: 1,
        },
    });
}
