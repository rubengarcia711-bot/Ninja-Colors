# Ninja Kids Coloring App

A fun coloring app for kids featuring ninja characters. Built with React and ready for the Google Play Store using Capacitor.

## Web Development

```bash
npm install
npm run dev
```

## Building for Android (Play Store)

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Android Studio](https://developer.android.com/studio)
- Java JDK 17+

### Setup Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Add Android platform** (first time only):
   ```bash
   npx cap add android
   ```

3. **Build and sync**:
   ```bash
   npm run build
   npx cap sync android
   ```

4. **Open in Android Studio**:
   ```bash
   npx cap open android
   ```

5. **Build APK/AAB**:
   - In Android Studio: **Build > Build Bundle(s) / APK(s) > Build APK**
   - For Play Store: **Build > Generate Signed Bundle / APK**

### App Configuration

The app is configured in `capacitor.config.ts`:
- **App ID**: `com.ninjakids.coloring`
- **App Name**: `Ninja Kids Coloring`

### Adding AdMob Ads

1. Install the AdMob plugin:
   ```bash
   npm install @capacitor-community/admob
   npx cap sync
   ```

2. Add your AdMob App ID to `android/app/src/main/AndroidManifest.xml`:
   ```xml
   <meta-data
       android:name="com.google.android.gms.ads.APPLICATION_ID"
       android:value="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"/>
   ```

### Adding In-App Purchases

1. Install the purchases plugin:
   ```bash
   npm install @capgo/capacitor-purchases
   npx cap sync
   ```

2. Configure with your Google Play license key in your app code.

## Play Store Submission

1. Create a [Google Play Developer account](https://play.google.com/console) ($25 one-time)
2. Generate a signed AAB file in Android Studio
3. Create your app listing with screenshots and description
4. Upload the AAB and submit for review

## App Features

- 12 ninja character coloring pages
- Brush and paint bucket tools
- Adjustable brush sizes
- Color palette with custom colors
- Undo/redo functionality
- Save and download artwork
- Premium ad-free option ($0.99)
