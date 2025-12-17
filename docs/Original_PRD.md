# Life Chart - Product Requirements Document

## 1. Introduction
**Life Chart** is a minimalist web application that visualizes a user's life as a grid of weeks. Inspired by the "Your Life in Weeks" concept (Wait But Why), it helps users gain perspective on their time, set goals, and track significant life events.

## 2. Core Value Proposition
- **Perspective:** See the finite nature of time at a glance.
- **Tracking:** Document life's journey week by week.
- **Planning:** Set future goals and milestones.

## 3. User Personas
- **The Stoic:** Wants to be reminded of *memento mori* to live fully.
- **The Planner:** Wants to map out career, family, and travel goals.
- **The Journaler:** Wants a high-level index of their life's memories.

## 4. Functional Requirements

### 4.1 Authentication
- Users can sign up and login via Email/Password or Social Providers (Google, GitHub).
- Auth is handled via **Supabase Auth**.

### 4.2 The Chart (Grid View)
- Display a grid of boxes, each representing one week of life.
- Total duration: 90 years (approx 4,680 weeks) by default, configurable.
- **Rows:** Represent years.
- **Columns:** Represent weeks (52 per row).
- **State Visualization:**
    - **Past Weeks:** Filled/Colored (e.g., distinct color).
    - **Current Week:** Highlighted / Pulsing.
    - **Future Weeks:** Empty / Outline only.
- **Eras/Stages:**
    - Ability to group weeks into "Eras" (e.g., Childhood, High School, College, Career, Retirement).
    - Eras usually have distinct background colors.

### 4.3 Interaction & Details
- Clicking a week (box) opens a detail view/modal.
- **Detail View:**
    - Date range of that week.
    - User can add a **Note** (Text).
    - User can add a **Media** (Image URL - optional for MVP).
    - User can assign a **Color/Category** (e.g., "Vacation", "Work", "Sick", "Milestone").

### 4.4 Data Persistence
- All user data (profile, eras, week notes) is stored in **Supabase (PostgreSQL)**.

## 5. Non-Functional Requirements
- **Performance:** Grid must render efficiently (4k+ DOM nodes can be heavy). Use virtualization or canvas if necessary, but CSS Grid/Flexbox might suffice for MVP if optimized.
- **Responsive:** Must work on Mobile (vertical scroll) and Desktop.
- **Design:** Clean, minimalist, modern. Dark/Light mode support.

## 6. Technical Stack
- **Frontend:** Next.js (App Router), React, Tailwind CSS.
- **Backend/DB:** Supabase (PostgreSQL, Auth, Realtime).
- **Deployment:** Vercel (Frontend), Railway (Optional services if needed, but Supabase + Vercel is sufficient for MVP).

## 7. Future Scope (Post-MVP)
- Public sharing of charts.
- PDF Export.
- Integration with Calendar/Photos.
