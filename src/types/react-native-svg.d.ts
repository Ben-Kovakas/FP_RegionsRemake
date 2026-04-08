declare module 'react-native-svg' {
  import * as React from 'react';
    import { ViewProps } from 'react-native';

  export type SvgProps = ViewProps & {
    width?: number | string;
    height?: number | string;
    viewBox?: string;
    children?: React.ReactNode;
    [key: string]: any;
  };

  export const Circle: React.ComponentType<any>;
  export const Rect: React.ComponentType<any>;
  export const Path: React.ComponentType<any>;
  export const G: React.ComponentType<any>;
  export const Line: React.ComponentType<any>;
  export const Ellipse: React.ComponentType<any>;
  export const Polygon: React.ComponentType<any>;
  export const Polyline: React.ComponentType<any>;
  export const Defs: React.ComponentType<any>;
  export const Use: React.ComponentType<any>;
  export const Symbol: React.ComponentType<any>;
  export const LinearGradient: React.ComponentType<any>;
  export const RadialGradient: React.ComponentType<any>;
  export const Stop: React.ComponentType<any>;
  export const Text: React.ComponentType<any>;
  export const TSpan: React.ComponentType<any>;
  export const TextPath: React.ComponentType<any>;
  export const Image: React.ComponentType<any>;

  const Svg: React.ComponentType<SvgProps>;
  export default Svg;
}