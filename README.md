# Mini Budget App

A simple and functional **React Native mobile app** built with **Expo** to track income and expenses.  
The app focuses on clean state management, mobile UX, and incremental feature development.

This project was built as a portfolio piece to practice and demonstrate real-world React Native concepts.

---

## ✨ Features

- Add income and expense movements
- Edit movements using a bottom modal
- Delete movements with long press
- Monthly statement-style filter (previous / next month)
- Automatic balance calculation per selected month
- Local data persistence using AsyncStorage
- Clean and mobile-friendly UI
- Fully written in TypeScript

---

## 🧠 Technical Highlights

- **React Hooks**: `useState`, `useEffect`, `useMemo`
- Derived state for balance and monthly filtering
- Modal-based editing for better mobile UX
- AsyncStorage for offline-first persistence
- Date handling without external libraries
- Incremental commits following best practices

---

## 🛠 Tech Stack

- React Native
- Expo
- TypeScript
- AsyncStorage
- Expo Go (for development)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS)
- Expo Go app (iOS or Android)

### Install & Run

Run the following commands:

    npm install
    npm start

Then scan the QR code with Expo Go to run the app on your device.

---

## 🧪 How the App Works

- Movements are stored locally using AsyncStorage
- Each movement includes:
  - type (income / expense)
  - amount
  - note
  - date
- A monthly cursor filters both:
  - the visible list
  - the calculated balance
- Editing a movement opens a modal with validation
- All changes are persisted immediately

---

## 📌 Project Scope & Decisions

This project intentionally avoids overengineering.  
The focus was on:

- realistic features
- clean code
- mobile-first UX
- clarity over complexity

No backend or authentication was added on purpose.

---

## 📈 Possible Improvements

- Category support
- Monthly summaries (income / expenses breakdown)
- Export data (JSON / CSV)
- Light / dark theme toggle
- Unit tests for business logic

---

## 👤 Author

Built by **Guilherme Verga**  
React Native / Frontend portfolio project

---

## 📄 License

MIT
