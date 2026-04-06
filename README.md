# Smart Hospital Management Dashboard

Professional frontend application for hospital management, built with Next.js, Tailwind CSS, and TypeScript. Designed for university administrators and hospital staff with roles for Staff and Doctors.

## Features

- Role-based login (Staff, Doctor)
- Dashboard with live statistics
- Doctor management (list, add)
- Patient workflow simulation
- Blood donation requests with filter and modal
- Updates/announcements timeline
- Responsive layout for mobile, tablet, desktop
- Light/dark mode toggle
- Accessible, reusable components using Tailwind CSS

## Tech Stack

- Next.js (app router) with TypeScript
- Tailwind CSS for utility-first styling
- React Context API for state management with mock data
- WCAG-friendly components and responsive design

## Folder Structure

`
app/                # Next.js app routes
  (auth)/layout.tsx # auth-specific layout
  (auth)/login/page.tsx # login page
  dashboard/page.tsx
  doctors/page.tsx
  doctors/add/page.tsx
  doctor-free-time/page.tsx
  patients/page.tsx
  blood-donation/page.tsx
  updates/page.tsx
  settings/page.tsx
components/         # reusable UI components
context/            # React contexts (Auth, Data)
data/               # mock data sets
public/             # static assets

`

## Running the App

`ash
cd smart-hospital-dashboard
npm install
npm run dev
`

Open [http://localhost:3001](http://localhost:3001) in your browser.

## Development Notes

- Mock data lives in data/ and state is managed by DataContext.
- Authentication is simulated; login simply sets context and redirects.
- Sidebar collapses for mobile; use hamburger icon to toggle display.
- All pages use Layout which includes Navbar and Sidebar except login.

---

This frontend is production-ready for further backend integration and custom data.
