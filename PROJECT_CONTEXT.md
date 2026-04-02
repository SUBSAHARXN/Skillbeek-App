# Skillbeek-App Context

## Current Status (Last Updated: April 1, 2026)
- The experimental UI sandbox (Login/Signup interactions) has been successfully wiped.
- The project is now a clean slate (React skeleton initialized in `App.tsx`) ready for actual production architecture.
- Core CSS variables and Figma design tokens have been safely preserved in `src/index.css`.

## Core Project Philosophy
**Methodology Supported:** OOUX (Object-Oriented User Experience).
- We are pausing to define our app's core **Objects** (nouns) before defining actions (verbs) or building components. 
- *Rule of thumb:* We must ensure everything revolves closely around representing the real-world object mental models.

## Architecture & Cross-Platform Strategy
- **Framework:** Standard Web React (`react-dom`, `react-scripts`, Tailwind CSS).
- **Mobile Strategy (Path 2):** We are strictly building a responsive web app. Once complete, we will integrate **Capacitor** to wrap the React build into a native shell. This allows deployment to the iOS and Android App Stores using standard HTML/CSS without needing to rewrite complex React Native syntax.

## Next Session Action Items
1. **Define Core Objects:** Map out the primary nouns for the Skillbeek ecosystem (e.g., Users, Skills, Courses, etc.).
2. **Build OOUX-aligned Architecture:** Scaffold out the new folder structures and state management patterns to cleanly represent those core objects before building individual UI views.
