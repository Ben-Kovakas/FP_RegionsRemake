import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { placeWidgets } from './placeWidgets';
import {
  WidgetGridContext,
  WidgetSlotIdContext,
} from './widgetGridContext';
import {
  GAP,
  GRID_COLUMNS,
  UNIT,
  WIDGET_CELL_SIZES,
  WidgetRect,
  WidgetSize,
} from './widgetLayout';

type Props = {
  children: React.ReactNode;
  headerContent?: React.ReactNode;
};

const ENABLE_NATIVE_PLACER = true;

function moveWidgetBefore(list: string[], sourceId: string, targetId: string) {
  if (sourceId === targetId) {
    return list;
  }

  const sourceIndex = list.indexOf(sourceId);
  const targetIndex = list.indexOf(targetId);
  if (sourceIndex === -1 || targetIndex === -1) {
    return list;
  }

  const next = [...list];
  next.splice(sourceIndex, 1);
  const nextTargetIndex = next.indexOf(targetId);
  next.splice(nextTargetIndex, 0, sourceId);
  return next;
}

function swapWidgets(list: string[], a: string, b: string) {
  if (a === b) {
    return list;
  }
  const aIndex = list.indexOf(a);
  const bIndex = list.indexOf(b);
  if (aIndex === -1 || bIndex === -1) {
    return list;
  }
  const next = [...list];
  [next[aIndex], next[bIndex]] = [next[bIndex], next[aIndex]];
  return next;
}

function getWidgetId(child: React.ReactNode, index: number) {
  if (React.isValidElement(child) && child.key != null) {
    return String(child.key);
  }
  return `widget-${index}`;
}

function pickClosestWidget(
  pointX: number,
  pointY: number,
  layouts: Record<string, WidgetRect>,
  excludeWidgetId: string,
) {
  let closestWidgetId: string | null = null;
  let smallestDistance = Number.POSITIVE_INFINITY;

  Object.entries(layouts).forEach(([widgetId, rect]) => {
    if (widgetId === excludeWidgetId) {
      return;
    }
    const centerX = rect.x + rect.width / 2;
    const centerY = rect.y + rect.height / 2;
    const distance = (pointX - centerX) ** 2 + (pointY - centerY) ** 2;
    if (distance < smallestDistance) {
      smallestDistance = distance;
      closestWidgetId = widgetId;
    }
  });

  return closestWidgetId;
}

function GridContainer({ children, headerContent }: Props) {
  // Content widgets stay opaque: this container only manages shell order and edit interactions.
  const childArray = React.useMemo(() => React.Children.toArray(children), [children]);
  const childEntries = React.useMemo(
    () => childArray.map((child, index) => ({ id: getWidgetId(child, index), child })),
    [childArray],
  );
  const childMap = React.useMemo(
    () => Object.fromEntries(childEntries.map((entry) => [entry.id, entry.child])),
    [childEntries],
  );

  const [isEditMode, setIsEditMode] = React.useState(false);
  const [selectedWidgetId, setSelectedWidgetId] = React.useState<string | null>(null);
  const [draggingWidgetId, setDraggingWidgetId] = React.useState<string | null>(null);
  const [orderedWidgetIds, setOrderedWidgetIds] = React.useState(() => childEntries.map((entry) => entry.id));
  const [sizesById, setSizesById] = React.useState<Record<string, WidgetSize>>({});
  const layoutsRef = React.useRef<Record<string, WidgetRect>>({});
  const didRunInitialSizeCheckRef = React.useRef(false);

  React.useEffect(() => {
    const incomingIds = childEntries.map((entry) => entry.id);
    setOrderedWidgetIds((current) => {
      const retained = current.filter((id) => incomingIds.includes(id));
      const appended = incomingIds.filter((id) => !retained.includes(id));
      return [...retained, ...appended];
    });
  }, [childEntries]);

  React.useEffect(() => {
    setSelectedWidgetId((current) => (current && !orderedWidgetIds.includes(current) ? null : current));
    setDraggingWidgetId((current) => (current && !orderedWidgetIds.includes(current) ? null : current));
  }, [orderedWidgetIds]);

  const orderedRenderableIds = React.useMemo(() => {
    const available = orderedWidgetIds.filter((id) => childMap[id] != null);
    const missing = childEntries.map((entry) => entry.id).filter((id) => !available.includes(id));
    return [...available, ...missing];
  }, [childEntries, childMap, orderedWidgetIds]);

  React.useEffect(() => {
    if (!__DEV__) {
      return;
    }
    if (!didRunInitialSizeCheckRef.current) {
      didRunInitialSizeCheckRef.current = true;
      return;
    }
    const missingSizeIds = orderedRenderableIds.filter((widgetId) => sizesById[widgetId] == null);
    if (missingSizeIds.length > 0) {
      console.warn(`[GridContainer] Missing shell size metadata for: ${missingSizeIds.join(', ')}`);
    }
  }, [orderedRenderableIds, sizesById]);

  const registerShellMeta = React.useCallback((widgetId: string, size: WidgetSize) => {
    if (__DEV__ && WIDGET_CELL_SIZES[size] == null) {
      console.warn(`[GridContainer] Unknown widget size "${size}" for ${widgetId}`);
    }
    setSizesById((current) => (
      current[widgetId] === size
        ? current
        : { ...current, [widgetId]: size }
    ));
  }, []);

  const reportShellLayout = React.useCallback((widgetId: string, rect: WidgetRect) => {
    layoutsRef.current[widgetId] = rect;
  }, []);

  const onShellPress = React.useCallback((widgetId: string) => {
    if (!isEditMode) {
      return;
    }
    setSelectedWidgetId((current) => {
      if (current == null) {
        return widgetId;
      }
      if (current === widgetId) {
        return null;
      }
      setOrderedWidgetIds((list) => swapWidgets(list, current, widgetId));
      return null;
    });
  }, [isEditMode]);

  const onDragStart = React.useCallback((widgetId: string) => {
    if (!isEditMode) {
      return;
    }
    setDraggingWidgetId(widgetId);
    setSelectedWidgetId(widgetId);
  }, [isEditMode]);

  const onDragMove = React.useCallback((_: string, __: number, ___: number) => {
    // Gesture point is consumed on drop; move events are intentionally lightweight.
  }, []);

  const onDragEnd = React.useCallback((widgetId: string, pointX: number, pointY: number) => {
    if (!isEditMode) {
      return;
    }
    const dropTargetId = pickClosestWidget(pointX, pointY, layoutsRef.current, widgetId);
    if (dropTargetId != null) {
      setOrderedWidgetIds((list) => moveWidgetBefore(list, widgetId, dropTargetId));
    }
    setDraggingWidgetId(null);
    setSelectedWidgetId(null);
  }, [isEditMode]);

  const gridContextValue = React.useMemo(() => ({
    isEditMode,
    selectedWidgetId,
    draggingWidgetId,
    registerShellMeta,
    reportShellLayout,
    onShellPress,
    onDragStart,
    onDragMove,
    onDragEnd,
  }), [
    draggingWidgetId,
    isEditMode,
    onDragEnd,
    onDragMove,
    onDragStart,
    onShellPress,
    registerShellMeta,
    reportShellLayout,
    selectedWidgetId,
  ]);

  const futurePlacements = React.useMemo(() => {
    if (!ENABLE_NATIVE_PLACER) {
      return null;
    }
    return placeWidgets(
      orderedRenderableIds.map((widgetId) => ({
        widgetId,
        cellSize: WIDGET_CELL_SIZES[sizesById[widgetId] ?? '1x1'],
      })),
      GRID_COLUMNS,
    );
  }, [orderedRenderableIds, sizesById]);

  const usingNativePlacer = ENABLE_NATIVE_PLACER && futurePlacements != null;
  const futureContainerHeight = React.useMemo(() => {
    if (futurePlacements == null) {
      return 0;
    }
    let maxRow = 0;
    futurePlacements.forEach((placement) => {
      maxRow = Math.max(maxRow, placement.row + placement.rowSpan);
    });
    return maxRow * UNIT + Math.max(maxRow - 1, 0) * GAP
      + maxRow * GAP;
  }, [futurePlacements]);

  const toggleEditMode = React.useCallback(() => {
    setIsEditMode((current) => {
      const next = !current;
      if (!next) {
        setSelectedWidgetId(null);
        setDraggingWidgetId(null);
      }
      return next;
    });
  }, []);

  return (
    <WidgetGridContext.Provider value={gridContextValue}>
      <View style={styles.wrapper}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          scrollEnabled={draggingWidgetId == null}
          nestedScrollEnabled={true}
        >
          <View style={[styles.grid, usingNativePlacer && { height: futureContainerHeight }]}>
            {orderedRenderableIds.map((widgetId, index) => {
              const child = childMap[widgetId];
              if (child == null) {
                return null;
              }

              const placement = usingNativePlacer ? futurePlacements?.[index] : null;
              const absoluteStyle = placement == null
                ? null
                : {
                  position: 'absolute' as const,
                  left: placement.col * (UNIT + GAP),
                  top: placement.row * (UNIT + GAP),
                };

              return (
                <WidgetSlotIdContext.Provider key={widgetId} value={widgetId}>
                  <View style={absoluteStyle}>{child}</View>
                </WidgetSlotIdContext.Provider>
              );
            })}
          </View>
        </ScrollView>
        <View style={styles.header}>
          <View style={styles.headerContent}>{headerContent}</View>
          <Pressable onPress={toggleEditMode} style={[styles.editButton, isEditMode && styles.editButtonActive]}>
            <Text style={[styles.editButtonText, isEditMode && styles.editButtonTextActive]}>
              {isEditMode ? 'Done' : 'Edit'}
            </Text>
          </Pressable>
        </View>
      </View>
    </WidgetGridContext.Provider>
  );
}

export default GridContainer;

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 60, paddingBottom: 32 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#2a2a2a',
    backgroundColor: '#0b0b0f',
  },
  headerContent: {
    flex: 1,
  },
  editButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#8e8e8e',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editButtonActive: {
    borderColor: '#4f8cff',
    backgroundColor: 'rgba(79, 140, 255, 0.12)',
  },
  editButtonText: {
    color: '#cfcfcf',
    fontWeight: '600',
  },
  editButtonTextActive: {
    color: '#8bb4ff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    alignSelf: 'center',
    width: GRID_COLUMNS * (UNIT + GAP),
  },
});
