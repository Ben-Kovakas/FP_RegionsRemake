import { Theme, useTheme } from '@/theme';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function TransferSuccess() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const navigation = useNavigation();

  const { from, to, amount } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.checkmarkCircle}>
          <Icon name="check" size={80} color={theme.colors.onPrimary} />
      </View>
      <Text style={styles.header}>Transfer Successful!</Text>

      <View style={styles.details}>
        <Text style={styles.detailText}>From: {from}</Text>
        <Text style={styles.detailText}>To: {to}</Text>
        <Text style={styles.detailText}>Amount: ${amount}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
                navigation.pop(2);
          }}
      >
        <Text style={styles.buttonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    checkmark: {
      fontSize: 80,
      marginBottom: 24,
    },
    checkmarkCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    header: {
      fontSize: 26,
      fontWeight: 'bold',
      color: theme.colors.primaryStrong,
      marginBottom: 32,
    },
    details: {
      width: '100%',
      backgroundColor: theme.colors.surface,
      padding: 20,
      borderRadius: 12,
      marginBottom: 40,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    detailText: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.textPrimary,
      marginBottom: 8,
    },
    button: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 12,
    },
    buttonText: {
      color: theme.colors.onPrimary,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
}
