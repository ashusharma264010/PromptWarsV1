# 🏠 FamCare

> **A family-focused digital health companion for seniors and caregivers — bringing medicines, daily tasks, insurance, health tracking, emergency information, and family coordination into one accessible interface.**

## 📌 Overview

**FamCare** is a frontend-first healthcare and daily-life management application designed around the needs of older adults and the family members who support them.

The application brings everyday care activities into a single dashboard instead of requiring users to manage medicines, appointments, insurance details, health readings, emergency contacts, and family coordination across multiple places.

The current implementation is an **MVP/prototype** built with React, TypeScript, and Vite. It uses local application state and sample data to demonstrate the end-to-end product experience.

## 🎯 Problem Statement

Families supporting senior citizens often have to coordinate multiple pieces of information at the same time:

- Medicine schedules and adherence
- Medicine stock and refill needs
- Daily chores, reminders, groceries, and appointments
- Health readings such as blood pressure, glucose, and temperature
- Insurance policy information and renewal dates
- Emergency contacts and critical medical details
- Communication and coordination between seniors and caregivers

FamCare is designed as a **single, senior-friendly companion interface** for bringing these workflows together.

## 💡 Core Solution

FamCare provides a centralized dashboard with dedicated modules for:

1. **Medicines** — medication schedules, custom time reminders, adherence logging, and stock alerts.
2. **Chores & Reminders** — household tasks, grocery items, reminders, and doctor appointments.
3. **Insurance Vault** — policy information, renewal tracking, insurer portals, and support details.
4. **Health Stats** — health reading logs, deterministic rule-based status checks, trends, and plain-language summaries.
5. **Emergency Information** — emergency contacts, doctor contacts, critical medical information, and quick-dial actions.
6. **Family & Caregiver Management** — linked family members, caregiver/senior views, and invitation-code based linking.

## ✨ Key Features

### 💊 Medicine Management

- Today's medicine schedule
- Once-daily, twice-daily, thrice-daily, interval-based, and custom schedules
- Specific time reminders
- Medicine inventory tracking
- Low-stock/reorder alerts
- Mark medicine as taken or skipped
- Adherence history/logs
- Add and manage medicines

### ✅ Chores, Groceries & Appointments

- Daily chores and reminders
- Doctor appointments
- Due-date and time tracking
- Shared tasks for family members
- Grocery list management
- Completion tracking

### 🛡️ Insurance Vault

- Store multiple policy types such as Health, Car, Term, Home, and Other
- Policy numbers and premium information
- Renewal-date tracking
- Insurer support contact details
- Links to insurer portals
- AI-assisted insurer URL resolution with a local fallback/known-provider directory

### ❤️ Health Stats

The application can track:

- Blood pressure
- Blood glucose
- Body temperature

Health readings are evaluated through a **deterministic rule engine** before the optional generative-AI layer is used. The AI layer is intended to explain results in simpler language rather than replace the underlying classification logic.

### 🤖 GenAI Health Interpreter

When a Gemini API key is available, FamCare can use Gemini to generate:

- Plain-language trend summaries
- Simple explanations
- Gentle recommendations
- A doctor-visit suggestion flag

When the API is unavailable, the application falls back to a local rule-based summary generator.

### 🚨 Emergency Access

- One-tap calling for emergency contacts
- One-tap calling for the primary doctor
- Emergency dial action
- Blood group information
- Known allergies
- Primary physician information
- Doctor contact directory

### 👨‍👩‍👧 Family & Caregiver Mode

- Senior and caregiver views
- Switch between profiles
- Linked family-member management
- Add/remove family members
- Family invitation code
- Shared-care context for managing a senior's profile

### ♿ Accessibility

FamCare is designed with senior accessibility in mind:

- Larger text modes
- Extra-large text mode
- High-contrast mode
- Voice narration
- Read-aloud interactions
- Browser speech-to-text support where available
- Large interactive touch targets
- Clear, high-contrast navigation and action states

## 🏗️ Application Architecture

```text
React UI
   │
   ├── Components
   │     ├── Dashboard
   │     ├── Medicines
   │     ├── Chores
   │     ├── Insurance
   │     ├── Health Stats
   │     ├── Emergency
   │     └── Family
   │
   ├── App Context
   │     └── Shared application state
   │
   ├── Services
   │     ├── Health Rule Engine
   │     ├── AI Health Interpreter
   │     ├── AI Insurer Resolver
   │     └── Speech Service
   │
   └── Types
         └── Shared TypeScript domain models
```

### State Management

The current MVP uses a custom React Context implementation through `AppContext` for application-wide state and actions.

### Current Data Model

The prototype initializes demonstration data in application state, including:

- User profiles
- Family members
- Doctors
- Medicines
- Adherence logs
- Chores
- Grocery items
- Insurance policies
- Health-stat entries
- Notifications
- Accessibility preferences

This makes the current version suitable for **demonstration, product validation, and UX testing**, but it is not yet a production-grade persistent healthcare data backend.

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 |
| Language | TypeScript |
| Build Tool | Vite 5 |
| UI Icons | Lucide React |
| State Management | React Context + Hooks |
| Health Logic | TypeScript rule-based service |
| Generative AI | Google Gemini API (optional) |
| Voice / Accessibility | Web Speech API |
| Styling | CSS |
| Package Manager | npm |
| Source Control | Git + GitHub |
| Deployment Target | Vercel |

## 🤖 AI-Assisted Development

This project was developed using an **AI-assisted product-to-code workflow**, with different AI tools used for different stages of development.

### 1. Claude — Product Definition & Information Architecture

**Claude** was used during the product-definition stage to help develop the conceptual foundation of FamCare, including:

- Product Requirements Document (PRD)
- Information Architecture
- Feature decomposition
- User flows
- Product structure
- Functional requirements
- Early solution exploration

The purpose of this stage was to translate the problem space into a structured product specification before implementation.

### 2. Antigravity — Application Creation & Implementation

**Antigravity** was used during the application-development stage, including:

- Translating the product structure into the application
- Creating the frontend implementation
- Building React components
- Implementing user flows and interactions
- Iterating on the UI/UX
- Implementing application logic and services
- Refining the working MVP

### Development Workflow

```text
Problem Definition
       ↓
Claude
(PRD + Information Architecture)
       ↓
Product Structure & User Flows
       ↓
Antigravity
(Application Creation & Implementation)
       ↓
React + TypeScript + Vite
       ↓
GitHub
       ↓
Vercel
(Production Deployment)
```

> **Note:** AI tools were used as development collaborators. The resulting application, architecture, implementation choices, testing, and deployment decisions remain part of the project's engineering workflow.

## 📂 Project Structure

```text
PromptWarsV1/
│
├── public/
│   ├── famcare_logo.jpg
│   └── vite.svg
│
├── src/
│   ├── components/
│   │   ├── Chores/
│   │   ├── Emergency/
│   │   ├── Family/
│   │   ├── HealthStats/
│   │   ├── Insurance/
│   │   ├── Medicines/
│   │   ├── Settings/
│   │   ├── Dashboard.tsx
│   │   ├── FamCareLogo.tsx
│   │   ├── Header.tsx
│   │   └── LoginModal.tsx
│   │
│   ├── context/
│   │   └── AppContext.tsx
│   │
│   ├── services/
│   │   ├── aiInterpreter.ts
│   │   ├── aiResolver.ts
│   │   ├── healthRuleEngine.ts
│   │   └── speechService.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
│
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

Make sure you have:

- Node.js installed
- npm installed
- Git installed

### Clone the repository

```bash
git clone https://github.com/ashusharma264010/PromptWarsV1.git
cd PromptWarsV1
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Run linting

```bash
npm run lint
```

## 🔐 Environment Variables & Gemini Integration

The current application can optionally use a Google Gemini API key for the generative-health-summary and insurer-resolution flows.

For local development, create a `.env` file and keep secrets out of Git.

> **Security note:** The current implementation reads the Gemini API key from frontend-side application configuration. A production implementation should move sensitive AI calls behind a server-side/API layer so that the credential is not exposed to browser users.

The application is also designed with local fallbacks, so the core demo experience does not depend on Gemini being available.

## 🚀 Deployment on Vercel

FamCare is a Vite + React application and is suitable for deployment on Vercel.

### Recommended Vercel Configuration

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

### Deployment Flow

```text
GitHub Repository
       ↓
Import Project into Vercel
       ↓
Select PromptWarsV1
       ↓
Framework: Vite
       ↓
Build: npm run build
       ↓
Output: dist
       ↓
Add environment variables (only when required)
       ↓
Deploy
```

### Production Considerations

Before treating the application as production-ready, the following areas should be strengthened:

- Persistent database/storage
- Real authentication and secure session handling
- Server-side handling of AI API credentials
- Secure healthcare-data architecture
- Proper authorization and role-based access control
- Audit logging
- Production-grade notification/reminder infrastructure
- Automated tests
- Robust medical-content validation
- Privacy, security, and compliance controls appropriate to the deployment context

## 🧪 MVP / Prototype Scope

The current version is intentionally focused on demonstrating the **product experience and core workflows**.

It should therefore be understood as a **functional MVP/prototype rather than a production clinical system**.

The health-related rule engine and AI-generated explanations are not a substitute for professional medical advice or diagnosis.

## 🗺️ Future Roadmap

Potential next iterations include:

- Persistent cloud database
- Real authentication and caregiver authorization
- Backend/API layer
- Medication reminders and push notifications
- Secure document upload for insurance and medical records
- Calendar synchronization
- Voice-first senior interactions
- More comprehensive AI assistance
- Family activity/audit timeline
- Hospital/doctor coordination workflows
- Integration with health devices and wearables
- Stronger privacy and compliance controls

## 📌 Repository

GitHub: https://github.com/ashusharma264010/PromptWarsV1

## 📄 License

No explicit open-source license is currently defined for this repository. Add a license file if you intend to permit reuse or redistribution.
