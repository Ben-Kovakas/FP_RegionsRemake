import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';

const accountBalances = {
  'Checking 3456': 1231,
  'Savings 7890': 8085,
};

const accountsList = [
  { label: 'Checking 3456', value: 'Checking 3456' },
  { label: 'Savings 7890', value: 'Savings 7890' },
];

export default function TransferPage() {
  const [fromAccount, setFromAccount] = useState(null);
  const [toAccount, setToAccount] = useState(null);
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [amount, setAmount] = useState(0);

  const maxAmount = useMemo(() => accountBalances[fromAccount] || 0, [fromAccount]);

  const filteredFromAccounts = accountsList.filter(acc => acc.value !== toAccount);
  const filteredToAccounts = accountsList.filter(acc => acc.value !== fromAccount);

  const router = useRouter();

  const handleTransfer = () => {
    if (!fromAccount || !toAccount || amount <= 0) return;

    router.push(
      `/transferScreen/Success?from=${fromAccount}&to=${toAccount}&amount=${amount}`
    );
  };

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
        />
      </View>

      <View style={styles.sliderWrapper}>
        <Text style={styles.label}>Amount: ${amount}</Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={maxAmount}
              step={1}
              value={amount}
              onValueChange={setAmount}
              minimumTrackTintColor="#22c55e"
              maximumTrackTintColor="#065f46"
              thumbTintColor="#16a34a"
            />
        <Text style={styles.balanceText}>Max available: ${maxAmount}</Text>

        <TouchableOpacity style={styles.button} onPress={handleTransfer}>
          <Text style={styles.buttonText}>Submit Transfer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#16a34a',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#166534',
  },
  dropdown: {
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  dropdownContainer: {
    backgroundColor: '#dcfce7',
  },
  sliderWrapper: {
    marginTop: 32,
  },
  balanceText: {
    marginTop: 8,
    color: '#166534',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});