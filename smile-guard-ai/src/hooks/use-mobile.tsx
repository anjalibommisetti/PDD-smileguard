import { useWindowDimensions } from "react-native";
import * as React from "react";

export function useIsMobile() {
  const { width } = useWindowDimensions();
  // In React Native, we're almost always on mobile, but we can define a breakpoint
  return width < 768;
}
