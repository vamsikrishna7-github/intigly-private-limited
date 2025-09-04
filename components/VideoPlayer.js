import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Video } from 'expo-av';

// simple video player with play/pause and current time
export default function VideoPlayer({ onTimeUpdate, onRegisterSeek, overlay, style }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // expose seek function to parent
  useEffect(() => {
    if (!onRegisterSeek) return;
    const seek = async (seconds) => {
      if (!videoRef.current) return;
      try {
        await videoRef.current.setPositionAsync(seconds * 1000);
        setCurrentTime(seconds);
      } catch (e) {
        // ignore
      }
    };
    onRegisterSeek(seek);
  }, [onRegisterSeek]);

  const onStatusUpdate = (status) => {
    if (!status) return;
    if (status.positionMillis != null) {
      const t = Math.max(0, status.positionMillis / 1000);
      setCurrentTime(t);
      // report up
      onTimeUpdate && onTimeUpdate(t);
    }
    if (status.durationMillis != null) {
      setDuration(status.durationMillis / 1000);
    }
  };

  const togglePlay = async () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      // pause video
      await videoRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      // play video
      await videoRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const format = (s) => {
    const total = Math.floor(s || 0);
    const mm = Math.floor(total / 60).toString().padStart(2, '0');
    const ss = (total % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  return (
    <View className="w-full" style={style}>
      <View className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
        <Video
          ref={videoRef}
          // sample video
          source={{ uri: 'https://www.w3schools.com/html/mov_bbb.mp4' }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
          shouldPlay={false}
          onPlaybackStatusUpdate={onStatusUpdate}
        />
        {overlay ? (
          <View pointerEvents="box-none" className="absolute inset-0">
            {overlay}
          </View>
        ) : null}
      </View>
      <View className="flex-row items-center justify-between mt-3">
        <TouchableOpacity onPress={togglePlay} className="px-4 py-2 bg-blue-600 rounded">
          <Text className="text-white">{isPlaying ? 'Pause' : 'Play'}</Text>
        </TouchableOpacity>
        <Text className="text-gray-800">{format(currentTime)} / {format(duration)}</Text>
      </View>
    </View>
  );
}


