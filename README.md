# Google Meet Clone (React Native + Node.js WebRTC)

A cross-platform Google Meet-like video conferencing app built with **React Native CLI** (frontend) and **Node.js/Express** (backend) using **WebRTC** for real-time video/audio communication.

---

## Features

- **User Authentication** (optional, can be extended)
- **Create/Join Meetings** with unique session codes
- **Real-time Video & Audio** using WebRTC
- **Multiple Participants** (tested on real devices)
- **Mute/Unmute Mic**, **Toggle Video**, **Switch Camera**
- **Draggable Local Video View** (snaps to corners)
- **Participant List** with live status
- **Chat Messaging** (if implemented)
- **Persistent Sessions** (using MMKV + Zustand)
- **Socket.io Signaling** for WebRTC
- **Responsive UI** for phones and tablets

---

## Tech Stack

- **Frontend:** React Native CLI, Zustand, MMKV, react-native-webrtc, react-native-vector-icons
- **Backend:** Node.js, Express, Socket.io, MongoDB (for session persistence)
- **Signaling:** Socket.io
- **Media:** WebRTC (P2P)

---

## Getting Started

### Prerequisites

- Node.js (18+ recommended)
- npm or yarn
- Android Studio/Xcode (for emulators)
- Two Android/iOS devices or emulators for multi-participant testing

### 1. Clone the Repo

```sh
git clone https://github.com/yourusername/google-meet-clone.git
cd google-meet-clone
```

### 2. Install Dependencies

#### Frontend

```sh
cd google_meet
npm install
```

#### Backend

```sh
cd ../meet_server
npm install
```

### 3. Configure Environment

#### Backend

- Edit `meet_server/.env` or `meet_server/config.js` for your MongoDB URI and server port.

#### Frontend

- Edit `google_meet/src/service/config.js`:
  - For local testing on Android device:  
    `export const BASE_URL = 'http://<YOUR_PC_IP>:3000'`
    `export const SOCKET_URL = 'ws://<YOUR_PC_IP>:3000'`
  - For emulator:  
    `10.0.2.2` (Android), `localhost` (iOS simulator)
  - For production: use your deployed server URL.

### 4. Start the Backend

```sh
cd ../meet_server
npm start
```

### 5. Start the Frontend

```sh
cd ../google_meet
npx react-native run-android
# or
npx react-native run-ios
```

#### To Build APK for Manual Install

```sh
cd android
./gradlew assembleDebug
# APK will be at android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Usage

1. **Open the app on two or more devices.**
2. **Create a meeting** on one device.
3. **Join the meeting** using the code on other devices.
4. **Allow camera/mic permissions.**
5. **See and interact with all participants in real time.**

---

## Project Structure

```
google_meet/
  ├── src/
  │   ├── components/
  │   ├── screens/
  │   ├── service/
  │   ├── hooks/
  │   ├── utils/
  │   └── App.js
  └── ...
meet_server/
  ├── controllers/
  ├── models/
  ├── app.js
  └── ...
```

---

## Troubleshooting

- **Video not showing:**  
  - Ensure both devices are on the same WiFi.
  - Check permissions for camera/mic.
  - Check logs for ICE candidate or signaling errors.
  - Make sure `BASE_URL` and `SOCKET_URL` are correct for your network.

- **INSTALL_FAILED_USER_RESTRICTED:**  
  - Enable "Install via USB" and "Install unknown apps" on your device.

- **Multiple devices:**  
  - Use `adb devices` to list and `--deviceId` to target specific devices.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

MIT

---

## Credits

- [react-native-webrtc](https://github.com/react-native-webrtc/react-native-webrtc)
- [Socket.io](https://socket.io/)
- [Zustand](https://github.com/pmndrs/zustand)
- [MMKV](https://github.com/mrousavy/react-native-mmkv)
- [Google Meet](https://meet.google.com/) (UI inspiration)

---

## Screenshots

*(Add screenshots of your app here)*

---

## TODO

- [ ] Add authentication
- [ ] Add screen sharing
- [ ] Add chat
- [ ] Add recording
- [ ] Improve UI/UX

---

**Happy
