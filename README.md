# 🚀 TalentFlow - Enterprise Hiring Platform

<div align="center">

![TalentFlow](https://img.shields.io/badge/TalentFlow-Hiring%20Platform-007bff)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6)
![Redux](https://img.shields.io/badge/Redux-Toolkit-764abc)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38b2ac)

*A comprehensive, full-stack hiring platform that streamlines the recruitment process for both HR teams and candidates*

</div>

## 📋 Table of Contents

- [🚀 Quick Start](#-quick-start)
- [🏗️ Architecture](#️-architecture)
- [👥 User Roles](#-user-roles)
- [✨ Features](#-features)
- [🔑 Demo Access](#-demo-access)
- [🛠️ Development](#️-development)
- [🚀 Deployment](#-deployment)

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16.0 or higher
- **npm** or **yarn** package manager
- Modern web browser with ES6+ support

### Installation & Running

1. **Clone the repository**
```bash
git clone <repository-url>
cd talentflow
```

2. **Install dependencies**
```bash
yarn install
```

3. **Start the development server**
```bash
yarn start
```

4. **Access the application**
```
http://localhost:3000
```

> **⚠️ Important**: Use `yarn start` instead of `npm start` or `npm run dev` to ensure all dependencies and scripts work correctly with the project configuration.

## 🏗️ Architecture

### Tech Stack
| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Redux Toolkit |
| **Styling** | Tailwind CSS, Custom Design System |
| **Routing** | React Router v6 |
| **State Management** | Redux Toolkit with RTK Patterns |
| **Database** | IndexedDB (via Dexie) |
| **API Simulation** | MSW (Mock Service Worker) |
| **Build Tool** | Create React App |
| **UI Components** | Headless UI, Hero Icons |

### Project Structure
```
src/
├── 📁 components/          # React components
│   ├── 🔐 auth/           # Authentication components
│   ├── 🔧 common/         # Shared UI components
│   ├── 💼 jobs/           # Job management features
│   ├── 👥 candidates/     # Candidate tracking system
│   └── 📝 assessments/    # Assessment builder tools
├── 🪝 hooks/              # Custom React hooks
├── 🗃️ store/              # Redux store & slices
├── 🔌 services/           # API & database services
├── 📊 types/              # TypeScript definitions
├── 🛠️ utils/              # Helper functions
└── 🎭 mocks/              # Mock data & API handlers
```

## 👥 User Roles

### 🏢 HR Team Portal
- **📊 Jobs Board** - Create, edit, archive, and reorder job postings
- **👥 Candidate Management** - Track applicants through hiring pipeline
- **📋 Kanban View** - Drag & drop candidates between stages
- **🎯 Assessment Builder** - Create custom job assessments
- **📈 Analytics** - View application metrics and statistics

### 👤 Candidate Portal
- **🔍 Job Discovery** - Browse and search available positions
- **📝 Application Portal** - Multi-step application forms
- **🧪 Assessment Center** - Complete skill-based assessments
- **📱 Dashboard** - Track application status and history

## ✨ Features

### 💼 Jobs Management
| Feature | Description |
|---------|-------------|
| **🎯 Interactive Job Board** | Server-like pagination, filtering, and search |
| **🔄 Drag & Drop Reordering** | Optimistic updates with rollback on failure |
| **📝 Job Creation & Editing** | Form validation (title required, unique slug) |
| **📁 Archive/Unarchive** | Status tracking with easy toggling |
| **🔗 Deep Linking** | Direct access to jobs via `/jobs/:jobId` |
| **🔍 Advanced Search** | Filter by title, status, and tags |

### 👥 Candidate Pipeline
| Feature | Description |
|---------|-------------|
| **⚡ Virtualized List** | Optimized for **1000+ candidates** with smooth scrolling |
| **📊 Kanban Board** | Visual pipeline management with drag & drop |
| **🎯 Advanced Filtering** | Search by name, email, and current stage |
| **📋 Candidate Profiles** | Comprehensive timeline view with notes |
| **💬 Notes System** | @mentions support with user suggestions |
| **🔄 Stage Transitions** | Smooth drag & drop between hiring stages |

### 📝 Assessment Center
| Feature | Description |
|---------|-------------|
| **🎨 Visual Builder** | Live preview during assessment creation |
| **📊 Multiple Question Types** | Single/multiple choice, text, numeric, file upload |
| **🎮 Conditional Logic** | Dynamic form flows based on previous answers |
| **✅ Validation Rules** | Required fields, numeric ranges, max length |
| **💾 Response Persistence** | Local storage with automatic saving |

### 🔄 Data & API Layer
| Feature | Description |
|---------|-------------|
| **🎭 Mock REST API** | MSW with realistic API simulation |
| **💾 Local Persistence** | IndexedDB via Dexie for offline capability |
| **⏱️ Realistic Simulation** | 200-1200ms latency for authentic experience |
| **🔄 Error Handling** | 5-10% error rate on write operations |
| **📱 Offline-First** | State restoration on page refresh |

## 🔑 Demo Access

### 🏢 HR Team Credentials
| Email | Password | Role |
|-------|----------|------|
| `hr@talentflow.com` | `hr123` | HR Manager |
| `admin@talentflow.com` | `admin123` | Administrator |
| `recruiter@company.com` | `recruiter123` | Recruiter |

### 👤 Candidate Credentials
| Email | Password | Purpose |
|-------|----------|---------|
| `candidate@talentflow.com` | `candidate123` | Primary Demo |
| `john.doe@email.com` | `john123` | Alternative |
| `sarah.wilson@email.com` | `sarah123` | Testing |

## 📊 Sample Data

The application comes pre-loaded with **realistic sample data**:

- **📋 25 Jobs** - Mixed active/archived status with various roles
- **👥 1000+ Candidates** - Randomly assigned to jobs and stages
- **🎯 3+ Assessments** - Complex assessments with 10+ questions each
- **🏢 Company Data** - Realistic job descriptions and requirements

## 🛠️ Development

### Available Scripts
```bash
yarn start          # Start development server on port 3000
yarn build          # Create production build
yarn test           # Run test suite
yarn lint           # Run ESLint for code quality
yarn type-check     # Run TypeScript compiler checks
```

### Key Development Features
- **🔥 Hot Reloading** - Instant feedback during development
- **🛡️ Type Safety** - Comprehensive TypeScript coverage
- **🎯 State Management** - Redux Toolkit with optimized updates
- **📱 Responsive Design** - Mobile-first approach with Tailwind CSS
- **♿ Accessibility** - WCAG compliant components
- **🚨 Error Boundaries** - Graceful error handling

## 🎨 UI/UX Highlights

- **🎨 Modern Design System** - Consistent component library
- **📱 Responsive Layout** - Seamless experience across all devices
- **✨ Smooth Animations** - Micro-interactions for better engagement
- **🎯 Professional Color Scheme** - Proper contrast ratios and accessibility
- **⏳ Loading States** - Skeleton screens for better UX
- **🧭 Intuitive Navigation** - Clear information hierarchy

## 🚀 Deployment

### Production Build
```bash
yarn build
```

The build artifacts will be stored in the `build/` directory, ready for deployment to any static hosting service.

### Supported Platforms
- **▲ Vercel** - Zero configuration deployment
- **🌐 Netlify** - Drag and drop deployment
- **☁️ AWS S3** - Static website hosting
- **⚡ GitHub Pages** - Free hosting for open source

### Deployment Notes
- **🔧 No environment variables required** - Fully self-contained application
- **🔄 Client-side routing support** - Compatible with SPAs
- **⚡ Optimized builds** - Proper cache headers and compression

## 🔧 Configuration & Customization

### Mock API Behavior
- **⏱️ Latency Simulation**: 200-1200ms response times
- **❌ Error Rate**: 5-10% on write operations
- **💾 Persistence**: All data stored locally in browser's IndexedDB

### Customization Points
- Modify `src/data/mock*.ts` files for sample data
- Adjust API behavior in `src/mocks/handlers.ts`
- Customize styles in Tailwind configuration
- Add new question types in assessment builder

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📝 License

This project is for demonstration purposes as part of a technical assignment.

## 🆘 Troubleshooting

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **Port 3000 already in use** | `npx kill-port 3000` then `yarn start` |
| **Dependency conflicts** | `rm -rf node_modules && yarn install` |
| **TypeScript errors** | `yarn type-check` for detailed errors |
| **Mock API not working** | Check browser console for MSW registration |

### Support Resources
- **🔍 Browser Console** - Detailed error messages and warnings
- **🌐 Network Tab** - Monitor API calls and responses
- **💾 Application Tab** - Verify IndexedDB status and data
- **⚛️ React DevTools** - Component debugging and state inspection

---

<div align="center">


</div>