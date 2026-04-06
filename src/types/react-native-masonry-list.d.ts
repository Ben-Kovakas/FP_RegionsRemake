declare module 'react-native-masonry-list' {
  import React from 'react';
    import { FlatListProps, ViewStyle } from 'react-native';

  interface MasonryListProps<T> extends Omit<FlatListProps<T>, 'renderItem' | 'data'> {
    data: T[];
    numColumns?: number;
    renderItem: (info: { item: T; index: number }) => React.ReactElement | null;
    keyExtractor?: (item: T, index: number) => string;
    contentContainerStyle?: ViewStyle;
    style?: ViewStyle;
    ListHeaderComponent?: React.ReactElement | null;
  }

  export default function MasonryList<T>(props: MasonryListProps<T>): React.ReactElement;
}
