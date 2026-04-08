import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  size?: number;
  value?: string;
};

const MATRIX_SIZE = 21;

function hashValue(value: string) {
  return value.split('').reduce((total, character, index) => (
    (total + character.charCodeAt(0) * (index + 7)) % 9973
  ), 0);
}

function isFinderCell(row: number, col: number, top: number, left: number) {
  if (row < top || row > top + 6 || col < left || col > left + 6) {
    return false;
  }

  const localRow = row - top;
  const localCol = col - left;
  const isOuterRing = localRow === 0 || localRow === 6 || localCol === 0 || localCol === 6;
  const isInnerBlock = localRow >= 2 && localRow <= 4 && localCol >= 2 && localCol <= 4;
  return isOuterRing || isInnerBlock;
}

function isReservedCell(row: number, col: number) {
  return (
    isFinderCell(row, col, 0, 0)
    || isFinderCell(row, col, 0, MATRIX_SIZE - 7)
    || isFinderCell(row, col, MATRIX_SIZE - 7, 0)
  );
}

function createMatrix(value: string) {
  const seed = hashValue(value);

  return Array.from({ length: MATRIX_SIZE }, (_, row) => (
    Array.from({ length: MATRIX_SIZE }, (_, col) => {
      if (isReservedCell(row, col)) {
        return true;
      }

      if (row === 6 || col === 6) {
        return (row + col) % 2 === 0;
      }

      const bit = (row * 17 + col * 29 + seed) % 11;
      return bit === 0 || bit === 3 || (row + col + seed) % 5 === 0;
    })
  ));
}

export default function FakeQrCode({ size = 200, value = 'zelle-demo-code' }: Props) {
  const matrix = React.useMemo(() => createMatrix(value), [value]);
  const cellSize = size / MATRIX_SIZE;

  return (
    <View style={[styles.frame, { width: size, height: size }]}>
      {matrix.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((cell, columnIndex) => (
            <View
              key={`${rowIndex}-${columnIndex}`}
              style={[
                styles.cell,
                {
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: cell ? '#1b1324' : '#ffffff',
                },
              ]}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderRadius: 1,
  },
});
