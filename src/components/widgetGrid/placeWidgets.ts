import { GRID_COLUMNS, WidgetCellSize } from './widgetLayout';

export type WidgetDescriptor = {
  widgetId: string;
  cellSize: WidgetCellSize;
};

export type WidgetPlacement = {
  widgetId: string;
  col: number;
  row: number;
  colSpan: number;
  rowSpan: number;
};

function ensureRow(occupancy: boolean[][], row: number, columns: number) {
  while (occupancy.length <= row) {
    occupancy.push(Array.from({ length: columns }, () => false));
  }
}

function canPlaceAt(
  occupancy: boolean[][],
  row: number,
  col: number,
  rowSpan: number,
  colSpan: number,
  columns: number,
) {
  if (col + colSpan > columns) {
    return false;
  }

  for (let r = row; r < row + rowSpan; r += 1) {
    ensureRow(occupancy, r, columns);
    for (let c = col; c < col + colSpan; c += 1) {
      if (occupancy[r][c]) {
        return false;
      }
    }
  }

  return true;
}

function markPlaced(
  occupancy: boolean[][],
  row: number,
  col: number,
  rowSpan: number,
  colSpan: number,
  columns: number,
) {
  for (let r = row; r < row + rowSpan; r += 1) {
    ensureRow(occupancy, r, columns);
    for (let c = col; c < col + colSpan; c += 1) {
      occupancy[r][c] = true;
    }
  }
}

/**
 * Future native gap-filling layout placer (currently behind feature flag).
 * Deterministic first-fit: top-to-bottom, then left-to-right.
 */
export function placeWidgets(
  descriptors: WidgetDescriptor[],
  columns: number = GRID_COLUMNS,
): WidgetPlacement[] {
  const occupancy: boolean[][] = [];
  const placements: WidgetPlacement[] = [];

  for (const descriptor of descriptors) {
    const colSpan = Math.min(descriptor.cellSize.cols, columns);
    const rowSpan = Math.max(descriptor.cellSize.rows, 1);
    let placed = false;
    let row = 0;

    while (!placed) {
      for (let col = 0; col <= columns - colSpan; col += 1) {
        if (!canPlaceAt(occupancy, row, col, rowSpan, colSpan, columns)) {
          continue;
        }

        markPlaced(occupancy, row, col, rowSpan, colSpan, columns);
        placements.push({
          widgetId: descriptor.widgetId,
          col,
          row,
          colSpan,
          rowSpan,
        });
        placed = true;
        break;
      }
      row += placed ? 0 : 1;
    }
  }

  return placements;
}
