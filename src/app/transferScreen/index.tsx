import { Theme, useTheme } from '@/theme';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Circle, Svg } from 'react-native-svg';

const accountBalances = {
  'Checking 3456': 1231,
  'Savings 7890': 8085,
};

const accountsList = [
  { label: 'Checking 3456', value: 'Checking 3456' },
  { label: 'Savings 7890', value: 'Savings 7890' },
];

export default function TransferPage() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [fromAccount, setFromAccount] = useState(null);
  const [toAccount, setToAccount] = useState(null);
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [amount, setAmount] = useState('');

  const maxAmount = useMemo(() => accountBalances[fromAccount] || 0, [fromAccount]);
  const progress = useMemo(() => {
    const val = parseFloat(amount) || 0;
    return Math.min(val / maxAmount, 1);
  }, [amount, maxAmount]);

  const filteredFromAccounts = accountsList.filter(acc => acc.value !== toAccount);
  const filteredToAccounts = accountsList.filter(acc => acc.value !== fromAccount);

  const router = useRouter();

  const handleTransfer = () => {
    const transferAmount = parseFloat(amount);
    if (!fromAccount || !toAccount || isNaN(transferAmount) || transferAmount <= 0) return;

    router.push(
      `/transferScreen/Success?from=${fromAccount}&to=${toAccount}&amount=${transferAmount}`
    );
  };

  const CIRCLE_SIZE = 120;
  const STROKE_WIDTH = 12;
  const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transfer Funds</Text>

      <View style={{ zIndex: 3000 }}>
        <Text style={styles.label}>From Account:</Text>
        <DropDownPicker
          open={openFrom}
          value={fromAccount}
          items={filteredFromAccounts}
          setOpen={setOpenFrom}
          setValue={setFromAccount}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          textStyle={{ color: theme.colors.textPrimary }}
          ArrowDownIconComponent={() => <Text style={{ color: theme.colors.textSecondary }}>▾</Text>}
          ArrowUpIconComponent={() => <Text style={{ color: theme.colors.textSecondary }}>▴</Text>}
          TickIconComponent={() => <Text style={{ color: theme.colors.primaryStrong }}>✓</Text>}
        />
      </View>

      <View style={{ zIndex: 2000, marginTop: 16 }}>
        <Text style={styles.label}>To Account:</Text>
        <DropDownPicker
          open={openTo}
          value={toAccount}
          items={filteredToAccounts}
          setOpen={setOpenTo}
          setValue={setToAccount}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          textStyle={{ color: theme.colors.textPrimary }}
          ArrowDownIconComponent={() => <Text style={{ color: theme.colors.textSecondary }}>▾</Text>}
          ArrowUpIconComponent={() => <Text style={{ color: theme.colors.textSecondary }}>▴</Text>}
          TickIconComponent={() => <Text style={{ color: theme.colors.primaryStrong }}>✓</Text>}
        />
      </View>

      <View style={{ marginTop: 16 }}>
        <Text style={styles.label}>Amount:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          placeholderTextColor={theme.colors.textMuted}
          keyboardType="numeric"
          value={amount}
          onChangeText={(text) => {
            const num = text.replace(/[^0-9]/g, '');
            setAmount(num);
          }}
        />
        <Text style={styles.balanceText}>Max available: ${maxAmount}</Text>

        <View style={styles.amountWrapper}>
            <View style={styles.circleWrapper}>
              <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
                <Circle
                  stroke={theme.colors.primarySoft}
                  fill="none"
                  cx={CIRCLE_SIZE / 2}
                  cy={CIRCLE_SIZE / 2}
                  r={RADIUS}
                  strokeWidth={STROKE_WIDTH}
                />
                <Circle
                  stroke={theme.colors.primary}
                  fill="none"
                  cx={CIRCLE_SIZE / 2}
                  cy={CIRCLE_SIZE / 2}
                  r={RADIUS}
                  strokeWidth={STROKE_WIDTH}
                  strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  rotation="-90"
                  origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}
                />
              </Svg>
              <Text style={styles.amountText}>${amount || 0}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleTransfer}>
          <Text style={styles.buttonText}>Submit Transfer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    header: {
      fontSize: 26,
      fontWeight: 'bold',
      marginBottom: 24,
      color: theme.colors.primaryStrong,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
      color: theme.colors.textSecondary,
    },
    dropdown: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      paddingHorizontal: 12,
      borderColor: theme.colors.border,
    },
    dropdownContainer: {
      backgroundColor: theme.colors.surfaceElevated,
      borderColor: theme.colors.border,
    },
    amountWrapper: {
      marginTop: 16,
      alignItems: 'center',
      width: '100%',
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 18,
      width: '100%',
      textAlign: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: 8,
      color: theme.colors.textPrimary,
    },
    balanceText: {
      color: theme.colors.textSecondary,
      fontWeight: '600',
      marginBottom: 16,
    },
    button: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 16,
      width: '100%',
    },
    buttonText: {
      color: theme.colors.onPrimary,
      fontWeight: 'bold',
      fontSize: 16,
    },
    circleWrapper: {
      width: 120,
      height: 120,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 16,
    },
    amountText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.colors.primaryStrong,
      position: 'absolute',
    },
  });
}
