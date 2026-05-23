# 🐼 MinPanda Food - Just for Fun! 🍟

<p align="center">
  <img src="file:///c:/Users/VICTUS/Desktop/temp1/v3/assets/minpanda_preview.png" alt="MinPanda Food Banner" width="600" style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);"/>
</p>

<p align="center">
  <strong>A playful, frontend-only food ordering system powered by Google Gemini AI & Firebase Firestore!</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Created%20By-min-FFA500?style=for-the-badge&logo=panda" alt="Created By Min"/>
  <img src="https://img.shields.io/badge/Made%20For-Fun-FF4500?style=for-the-badge&logo=gamepad" alt="Made For Fun"/>
  <img src="https://img.shields.io/badge/Powered%20By-Gemini%202.5%20Flash-4285F4?style=for-the-badge&logo=google-gemini" alt="Gemini Powered"/>
  <img src="https://img.shields.io/badge/Database-Firebase-FFCA28?style=for-the-badge&logo=firebase" alt="Firebase Powered"/>
</p>

---

## 📖 Welcome to MinPanda!
> *"Kalau lapar makan, Kalau Takut jangan ikut, Kalau ikut jangan takut !!!. 😔"*

**MinPanda Food** is a premium, client-side web application built entirely for fun and visual enjoyment. It allows users to browse menus, submit food orders, watch live queue progress, write reviews, and speak to an interactive AI chatbot advisor whenever they can't decide what to eat! 

---

## 🎨 Premium UI & App Showcase

### 📱 Navigation & Flow Structure
The application has a beautiful glassmorphism-inspired layout that keeps pages consistent and engaging. Here's a quick look at the user interface architecture:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        🐼 MinPanda Food Header                         │
├─────────────┬──────────────┬─────────────┬─────────────┬───────────────┤
│   🏠 Home   │ 🍔 Order Now │  📋 Queue   │  ⭐ Reviews │ 🤖 AI Advisor │
└─────────────┴──────────────┴─────────────┴─────────────┴───────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
 ┌───────────────┐         ┌───────────────┐         ┌───────────────┐
 │ 🍔 Order Food │         │ 📋 Live Queue │         │ ⭐ Reviews    │
 │ Select Shop   │   ───►  │ View Status   │   ───►  │ Rate Shops    │
 │ Customize Note│         │ Waiting Times │         │ Firestore DB  │
 └───────────────┘         └───────────────┘         └───────────────┘
                                                             ▲
         ┌───────────────────────────────────────────────────┘
         ▼
 ┌───────────────┐         ┌───────────────┐
 │ 🤖 AI Advisor │         │ ⚙️ Admin Vault │
 │ Gemini 2.5    │         │ Manage Queue  │
 │ Budget/Weather│         │ Announcements │
 └───────────────┘         └───────────────┘
```

---

## ✨ Features Included

### 1. 🍔 Interactive Ordering
* **Shop Selection:** Browse through curated Malaysian local spots like *Geprek Farisz Bistro*, *Nasi Arab Limbong*, *Burger Apiq*, and more!
* **Custom Notes:** Add special instructions to the chef (e.g. *"Ekstra pedas padu bos!"*).
* **Instant Submission:** Place orders directly into our shared queue system.

### 2. 📋 Live Queue & Tracker
* **Real-time Queue Status:** Watch your food move from "Pending" ➡️ "Cooking" ➡️ "Ready for pickup".
* **Waiting Time Estimator:** Smart time calculation helps you plan when to grab your food.
* **Admin Broadcasts:** Live system-wide announcements sliding across the top of the queue screen.

### 3. ⭐ Firebase Ratings & Reviews
* **Interactive Star Rating Selector:** Leave direct feedback and ratings for individual food stalls.
* **Live Comments Feed:** Dynamic, newest-first reviews loaded in real-time straight from Firestore.
* **Visual Average Scores:** Auto-calculated average star rating badges displayed dynamically.

### 4. 🤖 Gemini AI Food Advisor (Penasihat Makan)
* **AI Chat Bot:** Chatbot interface featuring custom-styled conversational bubbles.
* **Suggestion Chips:** Quick interactive prompts such as "🌶️ Spicy", "💰 Budget RM10", or "🌧️ Rainy Day".
* **Gemini 2.5 Flash Engine:** High-performance, direct browser API calls for blazing-fast food ideas.

### 5. ⚙️ Admin Control Panel
* **Protected Portal:** Access to control and monitor active food queues.
* **Live Order Control:** Change order statuses instantly or purge completed tickets.
* **Announcement Broadcast:** Send custom marquees out to all live screen visitors.

---

## 🛠️ The Tech Stack
MinPanda is built strictly as a client-side-only application:
* **HTML5:** Semantic architecture with unique testing IDs.
* **CSS3:** Fully native typography and modern color palettes featuring warm, playful orange-and-yellow hues.
* **JavaScript:** Plain, clean Vanilla JavaScript with absolute zero framework overhead.
* **Google Gemini API:** Native `v1beta` content generator using client-side `fetch()`.
* **Firebase Firestore:** Real-time cloud data storage for ordering and user review database.

---

## 🚀 Running Locally & Fun Info
1. Clone the project or download the folder.
2. Since there is **no backend server**, simply double-click `index.html` or host it with standard VS Code live server or `npx live-server` to run locally!
3. Enjoy, experiment, and have fun!

---
*Created with ❤️ by min.*
