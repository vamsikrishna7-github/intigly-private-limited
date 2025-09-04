import React, { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VideoPlayer from './components/VideoPlayer';
import DrawingCanvas from './components/DrawingCanvas';
import "../global.css";


export default function App() {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [showDraw, setShowDraw] = useState(false);
  const [paths, setPaths] = useState([]);
  const seekRef = useRef(null);

  // load saved data
  useEffect(() => {
    const load = async () => {
      try {
        const c = await AsyncStorage.getItem('comments');
        const p = await AsyncStorage.getItem('paths');
        if (c) setComments(JSON.parse(c));
        if (p) setPaths(JSON.parse(p));
      } catch (e) {
        // ignore
      }
    };
    load();
  }, []);

  // save comments
  useEffect(() => {
    AsyncStorage.setItem('comments', JSON.stringify(comments)).catch(() => {});
  }, [comments]);

  // save drawings
  useEffect(() => {
    AsyncStorage.setItem('paths', JSON.stringify(paths)).catch(() => {});
  }, [paths]);

  const addComment = () => {
    if (!input.trim()) return;
    // save comment
    const next = [
      { id: Date.now().toString(), text: input.trim(), time: Math.floor(currentTime) },
      ...comments,
    ];
    setComments(next);
    setInput('');
  };

  const removeComment = (id) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const jumpTo = (t) => {
    // seek video
    if (seekRef.current) {
      seekRef.current(t);
    } else {
      Alert.alert('Please wait', 'Video not ready yet');
    }
  };

  const renderItem = ({ item }) => (
    <View className="flex-row items-center justify-between px-3 py-2 border-b border-gray-200">
      <TouchableOpacity onPress={() => jumpTo(item.time)} className="flex-1">
        <Text className="text-gray-800">
          [{String(Math.floor(item.time / 60)).padStart(2, '0')}:{String(item.time % 60).padStart(2, '0')}] {item.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => removeComment(item.id)} className="px-2 py-1">
        <Text className="text-red-500">Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="px-4 pt-10 pb-4">
        <Text className="text-xl font-semibold">Frame.io Lite</Text>
      </View>
      <View className="px-4">
        <VideoPlayer
          onTimeUpdate={(t) => setCurrentTime(t)}
          onRegisterSeek={(seek) => (seekRef.current = seek)}
          overlay={showDraw ? <DrawingCanvas onPathsChange={setPaths} initialPaths={paths} /> : null}
        />
        <View className="flex-row items-center gap-2 mt-3">
          <TouchableOpacity onPress={() => setShowDraw((s) => !s)} className="px-3 py-2 rounded bg-gray-800">
            <Text className="text-white">{showDraw ? 'Hide Draw' : 'Draw'}</Text>
          </TouchableOpacity>
          <Text className="text-gray-700">Time: {Math.floor(currentTime)}s</Text>
        </View>
      </View>
      <View className="mt-4 px-4">
        <View className="flex-row items-center gap-2">
          <TextInput
            placeholder="Add comment"
            value={input}
            onChangeText={setInput}
            className="flex-1 px-3 py-2 border border-gray-300 rounded"
          />
          <TouchableOpacity onPress={addComment} className="px-3 py-2 bg-blue-600 rounded">
            <Text className="text-white">Save</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
        className="mt-4"
      />
    </KeyboardAvoidingView>
  );
}
