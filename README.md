TalentFlow - Enterprise Hiring Platform
TalentFlow is a comprehensive, full-stack hiring platform that streamlines the recruitment process for both HR teams and candidates. Built with modern React and TypeScript, it provides a seamless experience for job management, candidate tracking, and assessment creation.

https://img.shields.io/badge/TalentFlow-Hiring%2520Platform-blue
https://img.shields.io/badge/React-18.2.0-61dafb
https://img.shields.io/badge/TypeScript-5.0-3178c6

🚀 Quick Start
Prerequisites
Node.js 16+

npm or yarn

Modern web browser

Installation & Running
Clone the repository

bash
git clone <repository-url>
cd talentflow
Install dependencies

bash
yarn install
Start the development server

bash
yarn start
Access the application

text
http://localhost:3000
Important: Use yarn start instead of npm start or npm run dev to ensure all dependencies and scripts work correctly.

🏗️ Architecture Overview
Tech Stack
Frontend: React 18, TypeScript, Redux Toolkit

Styling: Tailwind CSS, Custom Components

Routing: React Router v6

Database: IndexedDB (via Dexie)

API Simulation: MSW (Mock Service Worker)

Build Tool: Vite

Project Structure
text
src/
├── components/          # React components
│   ├── auth/           # Authentication
│   ├── common/         # Shared components
│   ├── jobs/           # Job management
│   ├── candidates/     # Candidate tracking
│   └── assessments/    # Assessment builder
├── hooks/              # Custom React hooks
├── store/              # Redux store & slices
├── services/           # API & database services
├── types/              # TypeScript definitions
├── utils/              # Helper functions
└── mocks/              # Mock data & API handlers
👥 User Roles & Access
HR Team
Manage job postings (create, edit, archive, reorder)

Track candidates through hiring pipeline

Create custom assessments

Analyze application metrics

Candidates
Browse available positions

Apply to jobs with multi-step forms

Complete skill assessments

Track application status

🔑 Demo Credentials
HR Access
text
Email: hr@talentflow.com
Password: hr123

Email: admin@talentflow.com  
Password: admin123
Candidate Access
text
Email: candidate@talentflow.com
Password: candidate123

Email: john.doe@email.com
Password: john123
✨ Key Features
🎯 Jobs Management
Job Board with pagination, filtering, and search

Drag & Drop reordering with optimistic updates

Job Creation & Editing with validation

Archive/Unarchive functionality

Deep Linking to individual jobs

👥 Candidate Pipeline
Virtualized List for 1000+ candidates

Kanban Board for stage management

Candidate Profiles with timeline tracking

Advanced Search by name, email, and stage

Notes with @mentions support

📝 Assessments
Visual Builder for custom assessments

Multiple Question Types:

Single/Multiple choice

Short/Long text

Numeric ranges

File upload stubs

Conditional Logic for dynamic forms

Live Preview during creation

Validation Rules enforcement

🔄 Data Management
Local Persistence via IndexedDB

API Simulation with realistic latency

Error Handling with rollback mechanisms

Offline-First architecture

🛠️ Development
Available Scripts
bash
yarn start          # Start development server
yarn build          # Create production build
yarn test           # Run test suite
yarn lint           # Run ESLint
yarn type-check     # Run TypeScript compiler
Environment Setup
Ensure Node.js 16+ is installed

Use yarn for package management

The app includes all mock data - no external APIs needed

Key Development Features
Hot Reloading: Instant feedback during development

Type Safety: Full TypeScript coverage

State Management: Redux Toolkit with RTK Query patterns

Responsive Design: Mobile-first approach with Tailwind CSS

Accessibility: WCAG compliant components

🎨 UI/UX Highlights
Modern Design System with consistent components

Responsive Layout that works on all devices

Smooth Animations and transitions

Loading States and error boundaries

Professional Color Scheme with proper contrast

📊 Data & Performance
1000+ Candidates with virtualized rendering

25+ Sample Jobs with mixed statuses

3+ Complex Assessments with 10+ questions each

Optimized Performance with lazy loading

Efficient State Updates with Redux optimizations

🔧 Configuration
Mock API Behavior
Latency Simulation: 200-1200ms response times

Error Rate: 5-10% on write operations

Persistence: All data stored locally in browser

Customization
Modify src/data/mock*.ts files for sample data

Adjust API behavior in src/mocks/handlers.ts

Customize styles in src/styles/globals.css

🚀 Deployment
Production Build
bash
yarn build
The build artifacts will be stored in the dist/ directory, ready for deployment to any static hosting service like Vercel, Netlify, or AWS S3.

Environment Variables
No environment variables required - the application is fully self-contained.

🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

📝 License
This project is for demonstration purposes as part of a technical assignment.

🆘 Troubleshooting
Common Issues
Port already in use

bash
# Kill process on port 3000
npx kill-port 3000
yarn start
Dependency issues

bash
rm -rf node_modules
yarn install
TypeScript errors

bash
yarn type-check
Support
For issues related to this implementation, please check:

Browser console for errors

Network tab for API calls

Application tab for IndexedDB status