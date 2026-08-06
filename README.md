<div align="center">
  <img src="public/luffy_icon.png" alt="Anilog Logo" width="120" />
  <h1>Anilog</h1>
  <p><b>A minimalist, high-fidelity anime tracking application with a "Zen Analogue" aesthetic.</b></p>
</div>

---

## 🌌 Overview

**Anilog** is a modern, beautifully designed web application for tracking your anime journey. Built with a focus on digital stillness, intentionality, and premium whitespace, it marries the tactile nature of high-end physical products with a clean digital interface. 

The application utilizes a strict monochromatic color palette with tonal nuances, subtle ambient shadows, and an organic WebGL shader background to create a deeply immersive and calming user experience.

## ✨ Features

- **Zen Analogue Aesthetic:** High-contrast text, premium whitespace, soft corners, and a breathable layout.
- **Ambient WebGL Shader:** A custom organic "breathing" grain texture that runs seamlessly in the background.
- **Floating Island Navigation:** A tactile, bottom-docked navigation bar for mobile-first thumb-friendly usage.
- **Dynamic Anime Dashboard:** Track your "Current Sanity", active watching series, and quick personal stats.
- **Personal Log:** Add custom ratings, notes, and progress trackers for your favorite anime.
- **Responsive Layout:** A fixed-grid layout for desktop and fluid margin-heavy model for mobile.

## 🛠️ Tech Stack

- **Framework:** React 18
- **Language:** TypeScript
- **Bundler:** Vite 6
- **Routing:** React Router v6
- **Styling:** Tailwind CSS (Custom Design System Tokens)
- **Icons:** Material Symbols

---

## 📱 How to Build an Android APK

Since Anilog is built as a responsive web app (PWA-ready), the best way to convert it into a native Android APK is by using **Capacitor**. Capacitor acts as a bridge, wrapping your web app into a native mobile shell without having to rewrite any code.

### Step-by-Step Capacitor Guide:

1. **Install Capacitor CLI and Core:**
   ```bash
   npm install @capacitor/core
   npm install @capacitor/cli --save-dev
   ```

2. **Initialize Capacitor in the Project:**
   ```bash
   npx cap init Anilog com.umarr13.anilog --web-dir dist
   ```

3. **Build your Web App:**
   ```bash
   npm run build
   ```
   *(This generates the optimized production files in the `dist` folder).*

4. **Add the Android Platform:**
   ```bash
   npm install @capacitor/android
   npx cap add android
   ```

5. **Sync the Web Code to Android:**
   ```bash
   npx cap sync
   ```

6. **Open in Android Studio to Build the APK:**
   ```bash
   npx cap open android
   ```
   *From Android Studio, you can generate the signed APK via **Build > Generate Signed Bundle / APK...** or simply build a debug APK to test on your device.*

---

## 🚀 Getting Started (Local Development)

To run the web version of Anilog locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Umarr13/Anilog.git
   cd Anilog
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.
