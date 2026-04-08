import React from 'react';

import { WidgetRect, WidgetSize } from './widgetLayout';

type WidgetGridContextValue = {
  isEditMode: boolean;
  selectedWidgetId: string | null;
  draggingWidgetId: string | null;
  registerShellMeta: (widgetId: string, size: WidgetSize) => void;
  reportShellLayout: (widgetId: string, rect: WidgetRect) => void;
  onShellPress: (widgetId: string) => void;
  onDragStart: (widgetId: string) => void;
  onDragMove: (widgetId: string, pointX: number, pointY: number) => void;
  onDragEnd: (widgetId: string, pointX: number, pointY: number) => void;
};

export const WidgetGridContext = React.createContext<WidgetGridContextValue | null>(null);
export const WidgetSlotIdContext = React.createContext<string | null>(null);
export const WidgetGridParticipationContext = React.createContext<boolean>(true);

export function useWidgetGridContext() {
  return React.useContext(WidgetGridContext);
}

export function useWidgetSlotId() {
  return React.useContext(WidgetSlotIdContext);
}

export function useWidgetGridParticipation() {
  return React.useContext(WidgetGridParticipationContext);
}
