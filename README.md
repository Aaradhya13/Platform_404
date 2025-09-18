# Website docs
Website Docs


---
---

# Backend
# 🚉 Metro Depot Management Backend

This repository contains the backend services for the **Metro Depot Management System**, built with **Django + Django REST Framework**.  
It provides APIs to manage depots, trains, scheduling, branding deals, job cards, and integration with **IBM Maximo** for maintenance workflows.

---

## ⚙ Tech Stack

- **Django** – ORM + API framework  
- **Django REST Framework (DRF)** – RESTful APIs  
- **PostgreSQL / MySQL** – Relational Database (normalized up to 5NF)  
- **Celery + Redis** – Background tasks (nightly AI scheduling agent)  
- **IBM Maximo REST API** – Maintenance & job card integration  
- **Python AI Agent** – Optimized train allocation every night

---

## 📂 Data Model (Normalized to 5NF)

The database schema is normalized up to **Fifth Normal Form (5NF)** to eliminate redundancy and ensure referential integrity.  
Below are the major tables represented in Django models.

### 🔹 Depot & Infrastructure

- **Depot** – Stores depot-level metadata (# of lanes).  
- **ParkingBay, CleaningBay, MaintenanceBay, InspectionBay** – Bay-specific physical lane mappings.

> ⚠️ *Note: “Maintainance” corrected to “Maintenance” for consistency.*

### 🔹 User & Roles

- **Department** – Organizational units (e.g., Rolling-Stock, Signalling).  
- **Role** – Designations (e.g., Engineer, Supervisor).  
- **DesignedUser** – Custom user model linking Django user to depot, department, and role.

### 🔹 Train & Scheduling

- **Trainset** – Core rolling-stock unit with mileage tracking.  
- **Timetable** – Defines operational slots for trains.  
- **TrainScheduled** – Mapping of a trainset to a timetable.

### 🔹 Branding & Contracts

- **BrandingDeal** – Contracts defining branding exposure requirements.  
- **Branded** – Association between trainsets and branding deals.

### 🔹 Operations & Maintenance

- **JobCards** – Work orders exported/imported from IBM Maximo.  
- **ParkingTrainEntry, CleaningTrainEntry, MaintenanceTrainEntry, InspectionBayEntry** – Track train movements in respective bays with timestamps.

---

## 🤖 AI Scheduling Agent

Every night, an **AI agent** runs to allocate trains to timetable slots. The allocation considers:

1. **Fitness Certificates** – Validity windows issued by Rolling-Stock, Signalling, and Telecom departments.  
2. **Job-Card Status** – Open vs closed work orders (pulled from IBM Maximo).  
3. **Branding Priorities** – Contractual commitments on branding exposure hours.  
4. **Mileage Balancing** – Equalising bogie, brake-pad, and HVAC wear across trainsets.  
5. **Cleaning & Detailing Slots** – Availability of manpower and cleaning bay occupancy.  
6. **Stabling Geometry** – Minimising shunting movements and optimising turn-out times.

### 🛠 Implementation:

- Runs as a **Celery periodic task** (scheduled nightly).  
- Uses **AI/ML-based optimisation algorithms**.  
- Writes back the allocation into `TrainScheduled` and `Timetable`.

---

## 🗄 Database Normalization

- All tables are normalized up to **Fifth Normal Form (5NF)**.  
- Ensures **no redundancy**, **referential integrity**, and clean many-to-many resolution.  
- **Example**: Branding deals (`BrandingDeal`) and trains (`Trainset`) are linked only via the junction table `Branded` → prevents redundancy.

---

## 🛡 Security & Access Control

- **Role-based access** via `DesignedUser` model.  
- Each user linked to **Department + Role + Depot**.  
- Ensures **restricted access** to depot-specific data.

---
---

# Mobile Application
# 🚆 Sancharam for KMRL - By Platform404

## 📝 Overview

Sancharam is a mobile application built using React Native. It aims to provide a seamless cross-platform experience for both Android and iOS users. The project leverages modern libraries and best practices to ensure maintainability, scalability, and performance. This project aids to a lager website which automates the operations of KMRL. The app provides a user-friendly interface that allows Inspection personnel to raise mantenance isuues thorugh job cards which are then seen by Maintenace personnel who can view, manage and close these jobs. This app seamlessly syncs with the core website through the comman backend and database.

## 📚 Table of Contents

- [✨ Features](#features)
- [🛠️ Tech Stack](#tech-stack)
- [📁 Folder Structure](#folder-structure)
- [⚡ Setup Instructions](#setup-instructions)
- [▶️ Running the App](#running-the-app)
- [📜 Project Scripts](#project-scripts)
- [⚙️ Configuration](#configuration)
- [🤝 Contributing](#contributing)
- [🩺 Troubleshooting](#troubleshooting)
- [📄 License](#license)

## ✨ Features

- 📱 Cross-platform mobile app (Android & iOS)
- 🧩 Modular component architecture
- 🔄 State management (e.g., Redux, Context API)
- 🧭 Navigation (React Navigation)
- 🌐 API integration
- 🎨 Theming and styling
- ⚠️ Error handling and loading states
- 📏 Responsive UI

## 🛠️ Tech Stack

- **React Native**: Core framework for building native apps
- **JavaScript/TypeScript**: Programming language
- **React Navigation**: Routing and navigation
- **Redux / Context API**: State management
- **Axios / Fetch**: API requests
- **Styled Components / NativeBase**: UI styling
- **Jest / Testing Library**: Unit and integration testing

## 📁 Folder Structure

```
Platform404/
├── android/              # Native Android code
├── ios/                  # Native iOS code
├── src/
│   ├── assets/           # Images, fonts, etc.
│   ├── components/       # Reusable UI components
│   ├── screens/          # App screens/views
│   ├── navigation/       # Navigation setup
│   ├── store/            # State management (Redux, etc.)
│   ├── services/         # API calls and business logic
│   ├── utils/            # Utility functions
│   ├── hooks/            # Custom React hooks
│   ├── theme/            # Theming and styles
│   └── App.js            # Entry point
├── package.json          # Project metadata and dependencies
├── App.json              # Expo/React Native config
├── README.md             # Project documentation
└── ...                   # Other config files
```

## ⚡ Setup Instructions

1. **Clone the repository**  
   🧑‍💻  
   ```sh
   git clone <repository-url>
   cd Platform404
   ```

2. **Install dependencies**  
   📦  
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**  
   🔐  
   - Create a `.env` file in the root directory.
   - Add required variables (API endpoints, keys, etc.).

4. **Link native dependencies**  
   🔗  
   ```sh
   npx react-native link
   ```

## ▶️ Running the App

- **Start Metro Bundler**  
  🚦  
  ```sh
  npx react-native start
  ```

- **Run on Android**  
  🤖  
  ```sh
  npx react-native run-android
  ```

- **Run on iOS**  
  🍏  
  ```sh
  npx react-native run-ios
  ```

- **Using Expo (if applicable)**  
  🧪  
  ```sh
  npx expo start
  ```

## 📜 Project Scripts

- `npm start` / `yarn start`: Start Metro Bundler
- `npm run android` / `yarn android`: Run on Android device/emulator
- `npm run ios` / `yarn ios`: Run on iOS simulator
- `npm test` / `yarn test`: Run tests

## ⚙️ Configuration

- **Environment Variables**: Store sensitive data in `.env`
- **App.json**: Configure app name, icon, splash screen, etc.
- **Navigation**: Edit navigation setup in `src/navigation/`
- **Theming**: Customize styles in `src/theme/`

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your branch
5. Create a pull request

## 🩺 Troubleshooting

- **Metro Bundler issues**: Restart with `npx react-native start --reset-cache`
- **Dependency errors**: Delete `node_modules` and reinstall
- **Android/iOS build issues**: Check native code and configuration files

## 📄 License

This project is licensed under the MIT License.

---
---

# AI Scheduler
# 🤖 Platform 404: Trainset Scheduler

> Automated nightly scheduling for Sancharam using a **three-agent workflow architecture**.

---

## 📌 Problem Statement

Every night, KMRL must decide which trainsets:

- 🚉 Enter **revenue service** at dawn  
- 🕒 Remain on **standby**  
- 🛠️ Go to the **Inspection Bay Line (IBL)** for maintenance  

Currently, this decision is made manually, cross-checking data from multiple sources (Maximo exports, fitness certificates, cleaning slots, branding requirements). This process is **time-pressured, error-prone, and not scalable**.

---

## 🏗️ Three-Agent Workflow Architecture

The system is designed as three collaborating agents :

### 🟢 Agent 1 – Schedule Generator
- 📥 Gathers all validated inputs (job-cards, fitness, cleaning slots, branding commitments)
- 📝 Produces a **draft induction schedule** (service, standby, IBL assignments)
- ✅ Ensures rules and constraints are respected

### 🟡 Agent 2 – Reviewer & Validator
- 👀 Reviews the generated schedule
- ⚠️ Flags conflicts (e.g., missing fitness, over-capacity, branding shortfalls)
- 🛠️ Suggests minimal adjustments
- 🗂️ Produces a **validated schedule** ready for deployment

### 🔵 Agent 3 – Database Writer
- 💾 Updates the **central database** with the final schedule
- 📝 Records decisions, conflicts, and overrides for audit
- 🔗 Ensures data consistency across Maximo, IoT inputs, and internal records

---

## 🔄 Workflow
- **Data ingestion** – Maximo exports, sensor feeds, manual updates
- **Draft generation** – Agent 1 produces the initial schedule
- **Review & validation** – Agent 2 ensures compliance and fixes conflicts
- **Database update** – Agent 3 writes the approved schedule back to the system

---


## 🚀 Getting Started

1. **Install dependencies**
   ```sh
   pip install -r requirements.txt
   ```

2. **Run the agents**
   ```sh
   python app.py
   ```

## 🌟 Key Features

- ✅ Modular three-agent architecture
- 🤖 Automated ingestion of heterogeneous inputs
- 🛡️ Review & validation layer to catch errors
- 💾 Seamless database updates with audit trail
- 📈 Scales with fleet expansion (40 trains by 2027)

---

## 👥 Contributors

- **Platform 404 Team** 

---

## 📄 License

MIT License – free to use and adapt with attribution.

