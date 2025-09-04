import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';

// simple video player with play/pause and current time
export default function VideoPlayer({ onTimeUpdate, onRegisterSeek, overlay, style }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // player
  const player = useVideoPlayer(
    { uri: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    (p) => {
      // initial setup
      p.loop = false;
    }
  );

  // expose seek function to parent
  useEffect(() => {
    if (!onRegisterSeek) return;
    const seek = async (seconds) => {
      try {
        player.seekTo(seconds);
        setCurrentTime(seconds);
      } catch (e) {
        // ignore
      }
    };
    onRegisterSeek(seek);
  }, [onRegisterSeek, player]);

  // track time
  useEffect(() => {
    const id = setInterval(() => {
      const t = player.currentTime;
      const d = player.duration ?? 0;
      if (typeof t === 'number') {
        setCurrentTime(t);
        onTimeUpdate && onTimeUpdate(t);
      }
      if (typeof d === 'number') setDuration(d);
    }, 250);
    return () => clearInterval(id);
  }, [player, onTimeUpdate]);

  const togglePlay = async () => {
    if (isPlaying) {
      // pause video
      player.pause();
      setIsPlaying(false);
    } else {
      // play video
      player.play();
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
        <VideoView
          style={{ width: '100%', height: '100%' }}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
          contentFit="contain"
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


