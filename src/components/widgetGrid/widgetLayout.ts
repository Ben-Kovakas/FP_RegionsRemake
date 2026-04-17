import { ViewStyle } from 'react-native';

export type WidgetSize = '1x1' | '2x1' | '1x2' | '2x2' | '2x4' | '4x2';

export const GRID_COLUMNS = 4;
export const UNIT = 80;
export const GAP = 8;

export type WidgetCellSize = {
  cols: number;
  rows: number;
};

export type WidgetRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const WIDGET_CELL_SIZES: Record<WidgetSize, WidgetCellSize> = {
  '1x1': { cols: 1, rows: 1 },
  '2x1': { cols: 2, rows: 1 },
  '1x2': { cols: 1, rows: 2 },
  '2x2': { cols: 2, rows: 2 },
  '2x4': { cols: 2, rows: 4 },
  '4x2': { cols: 4, rows: 2 },
};

export const WIDGET_PIXEL_SIZES: Record<WidgetSize, ViewStyle> = {
  '1x1': { width: UNIT, height: UNIT },
  '2x1': { width: UNIT * 2 + GAP, height: UNIT },
  '1x2': { width: UNIT, height: UNIT * 2 + GAP },
  '2x2': { width: UNIT * 2 + GAP, height: UNIT * 2 + GAP },
  '2x4': { width: UNIT * 2 + GAP, height: UNIT * 4 + GAP * 3 },
  '4x2': { width: UNIT * 4 + GAP * 3, height: UNIT * 2 + GAP },
};

export function hasWidgetSize(value: string): value is WidgetSize {
  return value in WIDGET_CELL_SIZES;
}
