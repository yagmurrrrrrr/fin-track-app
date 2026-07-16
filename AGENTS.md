# FinTrack - AI Agent Instructions

FinTrack is a full-stack financial tracking web application with React frontend, Node.js/Express backend, and MySQL database. This document helps AI agents understand the codebase structure and conventions.

## Project Overview

**FinTrack** is a personal finance management system with:
- User authentication & account management
- Transaction tracking (income & expenses with categories)
- Budget limit management per category
- Currency trading (USD, EUR, Gold)
- Analytics & spending visualization
- Multi-language support (Turkish, English)

## Architecture

### Frontend (React 19 + Vite)
- **Location**: `src/`
- **Build tool**: Vite with Tailwind CSS
- **Styling**: Tailwind CSS 4.x
- **State Management**: React hooks (useState, useEffect, useMemo, useRef)
- **Main app**: `src/App.jsx` - central component managing tabs, auth, and UI state

### Backend (Node.js/Express)
- **Entry point**: `server.cjs` (CommonJS for easier MySQL integration)
- **Database**: MySQL (credentials in server.cjs)
- **API Base**: `http://localhost:4000/api`
- **Authentication**: bcryptjs for password hashing

### Key Directories
- `src/components/` - React tab components and UI
- `src/lib/constants.js` - i18n strings (TEXTS), motivation quotes, utility functions
- `public/` - static assets
- `src/assets/` - images and icons

## Component Architecture

The app follows a **tab-based interface** pattern managed in `App.jsx`:

1. **AuthScreen** - Login/register/password recovery
2. **DashboardTab** - Overview of wallet, limits, and quick actions
3. **TransactionsTab** - Income/expense history with filtering
4. **AnalyticsTab** - Charts (powered by Recharts) for spending analysis
5. **InvestTab** - Currency trading interface
6. **ProfileTab** - User profile and settings

Each tab is conditionally rendered based on `activeTab` state.

## Development Commands

```bash
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
npm run server       # Start backend (Node.js on port 4000)
```

**Important**: The backend must be running separately for API calls to work. Backend listens on port 4000.

## Key Conventions

### Internationalization (i18n)
- All UI text stored in `src/lib/constants.js` under `TEXTS` object
- Keys: `tr` (Turkish), `en` (English)
- Usage: `TEXTS[lang].key` where `lang` is 'tr' or 'en'
- Always add new strings to both language objects

### Component Props & State
- Components use functional React hooks pattern
- Modal state: `showModal`, `modalType` (in App.jsx)
- Modal types: 'gider' (expense), 'gelir' (income), 'döviz' (currency)
- Language state: `lang` in App.jsx (passed down or retrieved from state)

### API Communication
- Base URL: `http://localhost:4000/api`
- Connection error messages in `App.jsx`: `CONN_ERROR_TR`, `CONN_ERROR_EN`
- User login data stored in state: `{ user, pass }`

### Data Structures

**User Object**:
```js
{
  fullName, phone, address, email, job, birthDate, gender
}
```

**Wallet Object**:
```js
{
  bakiye: 0,        // Turkish Lira balance
  dolar: 0,         // USD amount
  euro: 0,          // EUR amount
  altin: 0          // Gold amount
}
```

**Limits Object**:
```js
{
  gida, kira, ulasim, teknoloji, eglence, fatura
  // All category limits in Turkish Lira
}
```

**Transaction Object**:
```js
{
  type: 'income' | 'expense',
  amount: number,
  category: string,
  description: string,
  date: string (YYYY-MM-DD)
}
```

### Styling Approach
- Tailwind CSS utilities for all styling
- Dark mode support via `isDarkMode` state in App.jsx
- Responsive design with mobile menu (`mobileMenuOpen` state)

### Audio & Media
- Sound effect for transactions: `trinkSound` (Mixkit asset)
- Loaded from external URL; gracefully handled if unavailable

## Common Development Tasks

### Adding a New Transaction Category
1. Add category name to `DEFAULT_LIMITS` in `server.cjs`
2. Add category string to `TEXTS.tr` and `TEXTS.en` in `constants.js`
3. Update modal logic in `Modals.jsx` if needed

### Modifying UI Components
- Components are in `src/components/` (one file per component)
- Use Tailwind classes for styling
- Follow existing pattern for prop drilling (lang, isDarkMode, etc.)

### Adding API Endpoints
1. Define route in `server.cjs` (Express)
2. Database operations use `mysql2/promise` pool
3. Call from React components with `fetch()` to `http://localhost:4000/api/endpoint`

### Bug Fixes
- Check browser console for connection/auth errors
- Verify backend is running on port 4000
- Database credentials hardcoded in server.cjs (update if needed)

## File Structure Quick Reference

```
fin-track/
├── src/
│   ├── App.jsx                 # Main app, state management
│   ├── main.jsx                # Entry point
│   ├── index.css               # Global styles
│   ├── components/
│   │   ├── AuthScreen.jsx
│   │   ├── DashboardTab.jsx
│   │   ├── TransactionsTab.jsx
│   │   ├── AnalyticsTab.jsx
│   │   ├── InvestTab.jsx
│   │   ├── ProfileTab.jsx
│   │   ├── Sidebar.jsx
│   │   ├── TopBar.jsx
│   │   ├── Modals.jsx
│   │   └── ui.jsx
│   ├── lib/
│   │   └── constants.js        # i18n, utilities, data defaults
│   └── assets/
├── server.cjs                  # Express backend, DB config
├── vite.config.js
├── eslint.config.js
├── package.json
└── public/
```

## Important Notes for AI Agents

1. **Always start backend**: The React app requires `npm run server` in a separate terminal.
2. **Language context**: Check the `lang` state to use correct TEXTS keys.
3. **Modal management**: Review `showModal` and `modalType` before modifying modal behavior.
4. **Database**: MySQL is required; credentials in `server.cjs`.
5. **Testing changes**: After modifications, run `npm run lint` to catch issues.
6. **Responsive design**: Test changes on mobile (check `mobileMenuOpen` logic).

