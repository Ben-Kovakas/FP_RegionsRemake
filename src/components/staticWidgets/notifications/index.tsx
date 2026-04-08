import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WidgetShell from "../../widgetGrid/WidgetShell";

export default function NotificationWidget2x1() {
    return (
        <WidgetShell size="2x2" onPress={() => console.log('tapped')}>
            <View style={styles.container}>
                <View style={styles.banner}>
                    <Text style={styles.bannerText}>ALERTS</Text>
                </View>
                <View style={styles.row}>
                    <View style={styles.dot} />
                    <Text style={styles.title}>3 New Alerts</Text>
                </View>
                <Text style={styles.subtitle}>· Unusual login</Text>
                <Text style={styles.subtitle}>· Low balance</Text>
                <Text style={styles.subtitle}>· Statement ready</Text>
                <Text style={styles.caption}>Just now</Text>
            </View>
        </WidgetShell>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        gap: 6,
        padding: 12,
        backgroundColor: '#88bd40',
        borderLeftWidth: 5,
        borderLeftColor: '#dd2b2b',
    },
    banner: {
        marginHorizontal: -12,
        marginTop: -12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#dd2b2b',
    },
    bannerText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#dd2b2b',
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    title: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1A0000',
    },
    subtitle: {
        fontSize: 12,
        color: '#3E2723',
        fontWeight: 'bold',
        lineHeight: 16,
    },
    caption: {
        fontSize: 11,
        fontWeight: '700',
        color: '#ffffff',
        marginTop: 2,
        fontStyle: 'italic',
    },
});