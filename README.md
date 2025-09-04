# Frame.io Lite (Expo + NativeWind)

Simple video review app with:
- play/pause MP4
- timestamp comments
- freehand drawings overlay
- local save via AsyncStorage

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
