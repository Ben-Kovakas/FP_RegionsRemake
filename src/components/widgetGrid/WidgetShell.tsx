import React from 'react';
import {
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import {
  useWidgetGridContext,
  useWidgetGridParticipation,
  useWidgetSlotId,
} from './widgetGridContext';
import { GAP, WIDGET_PIXEL_SIZES, WidgetRect, WidgetSize } from './widgetLayout';

type Props = {
  size: WidgetSize;
  onPress?: () => void;
  children: React.ReactNode;
  widgetId?: string;
  transparentBackground?: boolean;
  isEditMode?: boolean;
  isSelected?: boolean;
  onMoveIntent?: () => void;
  onSelectIntent?: () => void;
};

export default function WidgetShell({
  size,
  onPress,
  children,
  widgetId,
  transparentBackground = false,
}: Props) {
  // Shell owns placement/edit affordances; children remain fully opaque widget content.
  const gridContext = useWidgetGridContext();
  const doesParticipateInGrid = useWidgetGridParticipation();
  const slotWidgetId = useWidgetSlotId();
  const resolvedWidgetId = widgetId ?? slotWidgetId;
  const shellRef = React.useRef<View>(null);
  const isEditMode = (gridContext?.isEditMode ?? false) && doesParticipateInGrid;
  const disableInnerPointerEvents = !doesParticipateInGrid && (gridContext?.isEditMode ?? false);
  const isSelected = doesParticipateInGrid
    && resolvedWidgetId != null
    && gridContext?.selectedWidgetId === resolvedWidgetId;
  const isDragging = doesParticipateInGrid
    && resolvedWidgetId != null
    && gridContext?.draggingWidgetId === resolvedWidgetId;

  React.useEffect(() => {
    if (!doesParticipateInGrid || gridContext == null || resolvedWidgetId == null) {
      return;
    }
    gridContext.registerShellMeta(resolvedWidgetId, size);
  }, [doesParticipateInGrid, gridContext, resolvedWidgetId, size]);

  const reportLayout = React.useCallback(() => {
    if (!doesParticipateInGrid || gridContext == null || resolvedWidgetId == null || shellRef.current == null) {
      return;
    }

    shellRef.current.measureInWindow((x, y, width, height) => {
      const rect: WidgetRect = { x, y, width, height };
      gridContext.reportShellLayout(resolvedWidgetId, rect);
    });
  }, [doesParticipateInGrid, gridContext, resolvedWidgetId]);

  const handlePress = React.useCallback(() => {
    if (!doesParticipateInGrid) {
      if (!gridContext?.isEditMode) {
        onPress?.();
      }
      return;
    }
    if (isEditMode) {
      if (resolvedWidgetId != null) {
        gridContext?.onShellPress(resolvedWidgetId);
      }
      return;
    }
    onPress?.();
  }, [doesParticipateInGrid, gridContext, isEditMode, onPress, resolvedWidgetId]);

  const panResponder = React.useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => doesParticipateInGrid && isEditMode && resolvedWidgetId != null,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      if (!doesParticipateInGrid || !isEditMode || resolvedWidgetId == null) {
        return false;
      }
      return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
    },
    onPanResponderGrant: (_, gestureState) => {
      if (!doesParticipateInGrid || !isEditMode || resolvedWidgetId == null) {
        return;
      }
      gridContext?.onDragStart(resolvedWidgetId);
      gridContext?.onDragMove(resolvedWidgetId, gestureState.moveX, gestureState.moveY);
    },
    onPanResponderMove: (_, gestureState) => {
      if (!doesParticipateInGrid || !isEditMode || resolvedWidgetId == null) {
        return;
      }
      gridContext?.onDragMove(resolvedWidgetId, gestureState.moveX, gestureState.moveY);
    },
    onPanResponderRelease: (_, gestureState) => {
      if (!doesParticipateInGrid || !isEditMode || resolvedWidgetId == null) {
        return;
      }
      gridContext?.onDragEnd(resolvedWidgetId, gestureState.moveX, gestureState.moveY);
    },
    onPanResponderTerminate: (_, gestureState) => {
      if (!doesParticipateInGrid || !isEditMode || resolvedWidgetId == null) {
        return;
      }
      gridContext?.onDragEnd(resolvedWidgetId, gestureState.moveX, gestureState.moveY);
    },
  }), [doesParticipateInGrid, gridContext, isEditMode, resolvedWidgetId]);

  return (
    <View
      ref={shellRef}
      pointerEvents={disableInnerPointerEvents ? 'none' : 'auto'}
      style={[
        styles.base,
        transparentBackground && styles.transparentBackground,
        WIDGET_PIXEL_SIZES[size],
        !doesParticipateInGrid && styles.groupInnerBase,
        isEditMode && styles.baseEditMode,
        isSelected && styles.selected,
        isDragging && styles.dragging,
      ]}
      onLayout={reportLayout}
    >
      <Pressable style={styles.pressableArea} onPress={handlePress} android_ripple={undefined}>
        <View style={styles.contentClip}>
          {children}
        </View>
      </Pressable>
      {isEditMode && (
        <View style={styles.dragHandle} {...panResponder.panHandlers}>
          <View style={styles.dragHandleGrip} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    margin: GAP / 2,
    borderRadius: 12,
    backgroundColor: '#1e1e1e',
    overflow: 'visible',
  },
  transparentBackground: {
    backgroundColor: 'transparent',
  },
  groupInnerBase: {
    margin: 0,
  },
  baseEditMode: {
    borderWidth: 1,
    borderColor: '#4a4a4a',
  },
  selected: {
    borderWidth: 2,
    borderColor: '#4f8cff',
  },
  dragging: {
    opacity: 0.85,
    transform: [{ scale: 1.02 }],
    zIndex: 20,
    elevation: 20,
  },
  pressableArea: {
    flex: 1,
    margin: 2,
    borderRadius: 10,
  },
  contentClip: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  dragHandle: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(20, 20, 20, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragHandleGrip: {
    width: 10,
    height: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e6e6e6',
  },
});
