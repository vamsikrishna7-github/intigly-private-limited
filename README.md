# Frame.io Lite (Expo + NativeWind)

Simple video review app with:
- play/pause MP4
- timestamp comments
- freehand drawings overlay
- local save via AsyncStorage

## Short note
I kept the app small and easy to read. There are only a few files: one screen (`App.js`) and two simple components for video and drawing. State is stored with `useState`, and I pass small props between components. I used `expo-av` for video so it works in Expo Go without extra setup, and `react-native-svg` for drawing because it is reliable and light.

For storage I used `AsyncStorage` so comments and drawings stay on the device. Styles use NativeWind utility classes to keep things short and clear. There are no complex patterns, just small functions, short comments, and straightforward names like `videoRef`, `comments`, and `currentTime`.

## Run
```bash
npm install
npm run android   # or: npm run web
```
Use Expo Go on your device to scan the QR if no emulator.

## Build APK
```bash
npx expo build:android -t apk
```
If using EAS:
```bash
npx expo install expo-updates
npx eas build -p android --profile preview
```

## Files
- `App.js` – UI, comments, storage
- `components/VideoPlayer.js` – video + time
- `components/DrawingCanvas.js` – freehand SVG

## Notes
- Uses `expo-av` for video (works in Expo Go)
- Uses `react-native-svg` for drawing
- Uses NativeWind for quick styles
