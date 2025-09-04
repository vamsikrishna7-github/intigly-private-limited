import React, { useMemo, useRef, useState } from 'react';
import { PanResponder, View, TouchableOpacity, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function DrawingCanvas({ onPathsChange, initialPaths = [] }) {
  const [paths, setPaths] = useState(initialPaths);
  const [color, setColor] = useState('#ff4757');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const currentPath = useRef("");

  const update = (next) => {
    setPaths(next);
    onPathsChange && onPathsChange(next);
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
          const { locationX, locationY } = evt.nativeEvent;
          currentPath.current = `M ${locationX} ${locationY}`;
          update([...paths, { d: currentPath.current, color, strokeWidth }]);
        },
        onPanResponderMove: (evt) => {
          const { locationX, locationY } = evt.nativeEvent;
          currentPath.current += ` L ${locationX} ${locationY}`;
          const next = [...paths];
          next[next.length - 1] = { d: currentPath.current, color, strokeWidth };
          update(next);
        },
        onPanResponderRelease: () => {
          currentPath.current = "";
        },
        onPanResponderTerminate: () => {
          currentPath.current = "";
        },
      }),
    [paths, color, strokeWidth]
  );

  const clear = () => {
    update([]);
  };

  return (
    <View className="absolute inset-0" pointerEvents="box-none">
      <View className="absolute inset-0" {...panResponder.panHandlers}>
        <Svg width="100%" height="100%">
          {paths.map((p, i) => (
            <Path key={i} d={p.d} stroke={p.color} strokeWidth={p.strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          ))}
        </Svg>
      </View>
      <View className="absolute right-2 top-2 flex-row gap-2">
        <TouchableOpacity onPress={clear} className="px-3 py-1 rounded bg-white/90">
          <Text>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


