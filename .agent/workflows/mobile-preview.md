---
description: how to run the mobile preview
---
### 📱 Mobile Preview

// turbo-all

#### Run the Dev Server
1. Run `npm run dev`
2. Open `http://localhost:5173` in your browser (or on your phone via the network URL)
3. You will see the game running **directly** — identical to the deployed network version
4. To view the old phone-frame preview wrapper, go to `http://localhost:5173/index.html`

#### Run on a Real Phone via Expo Go
**Prerequisites:** You need both Vite AND Expo running simultaneously (two terminals).

1. In Terminal 1, run: `npm run dev`
   - This starts the Vite server that serves the actual game files
2. In Terminal 2, run: `npm run expo`
   - This starts the Expo server  
3. Scan the QR code with your phone camera (iOS) or Expo Go app (Android)
   - The game loads in a full-screen WebView pointing to your Vite dev server

**Note:** Your phone must be on the same WiFi network as your computer.
