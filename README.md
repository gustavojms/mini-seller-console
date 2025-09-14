# Mini Seller Console

A lightweight React application for managing leads and converting them into opportunities.

## Features

- **Lead Management**: View, filter, and edit leads with real-time search
- **Lead Conversion**: Convert qualified leads into sales opportunities
- **Opportunity Tracking**: Monitor converted opportunities through sales stages
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Optimistic Updates**: Immediate UI feedback with rollback on failures

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI + Heroicons
- **State Management**: React Hooks (useState, useEffect, custom hooks)
- **Data Persistence**: localStorage

## Project Structure

```
src/
├── components/
│   ├── leads/           # Lead-specific components
│   ├── opportunities/   # Opportunity management
│   └── ui/             # Reusable UI components (Button, Input, Dropdown)
├── data/               # JSON data files
├── hooks/              # Custom React hooks
├── services/           # Data service layer
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mini-seller-console
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Usage

1. **Browse Leads**: View all leads in the left panel with search and filtering
2. **Edit Leads**: Click on any lead to view details and edit information
3. **Convert to Opportunity**: Use the convert button to create opportunities from qualified leads
4. **Track Opportunities**: Monitor converted opportunities in the right panel

## Key Features

### Responsive Design
- Desktop: Two-column layout with leads and opportunities side-by-side
- Mobile: Stacked layout with dropdown menus for actions

### Optimistic Updates
- Immediate UI feedback for all user actions
- Automatic rollback if server requests fail
- Smooth user experience with loading states

### Data Persistence
- Filter preferences saved to localStorage
- Lead and opportunity data persisted across sessions
