# Christ University Internship Management System (IMS)

A comprehensive web application for managing internship processes at Christ University, built with React, TypeScript, and Vite.

## 🚀 Features

### Core Modules

#### 1. **Authentication & Authorization**
- Role-based access control (IC, HOD, Faculty, Recruiter)
- Separate login portals for staff and recruiters
- Protected routes with role guards
- Persistent sessions with localStorage

#### 2. **Internship Coordinator (IC) Dashboard**
- Create and manage internship sessions
- Add corporate recruiters
- View placement statistics and trends
- Monitor pending approvals
- Export reports to CSV

#### 3. **Application Management**
- View all student applications
- Search and filter by status (Pending/Approved/Rejected)
- Approve applications with automatic LOR generation
- Reject applications with feedback
- Export application data

#### 4. **Guide Assignment**
- Assign faculty mentors to students
- Track internship progress
- Add feedback and monitoring notes
- View recent allocations by HOD/Coordinator
- Real-time status updates

#### 5. **Job Posting Management**
- Recruiters can post internship opportunities
- IC/HOD can approve or reject postings
- View active and pending job listings
- Detailed job descriptions and requirements

#### 6. **Session Management**
- Create academic year sessions
- Define program-specific batches
- Set start and end dates
- Toggle session active status

### UI Components

#### Reusable Components
- **SearchBar**: Advanced search with clear functionality
- **Skeleton Loaders**: Smooth loading states
- **ConfirmDialog**: Confirmation dialogs for critical actions
- **QuickStat**: Metric cards with trend indicators
- **Timeline**: Activity log visualization
- **ErrorBoundary**: Graceful error handling
- **NotFound**: Custom 404 page

#### Data Visualization
- Placement statistics charts
- Application trend graphs
- Recruiter performance metrics

### Additional Features

- **CSV Export**: Download reports for applications, sessions, and more
- **Notifications System**: Real-time alerts and updates
- **Responsive Design**: Mobile-friendly interface
- **Loading States**: Skeleton screens for better UX
- **Form Validation**: Client-side validation with error messages
- **Toast Notifications**: Quick feedback for user actions

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Routing**: React Router DOM v7

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🏗️ Project Structure

```
IMS/
├── src/
│   ├── components/
│   │   ├── auth/          # Authentication components
│   │   ├── charts/        # Data visualization
│   │   ├── layout/        # Layout components
│   │   ├── notifications/ # Notification system
│   │   └── ui/            # Reusable UI components
│   ├── context/           # React contexts (Auth, Notifications)
│   ├── pages/             # Page components
│   │   ├── applications/  # Application management
│   │   ├── dashboards/    # Role-specific dashboards
│   │   ├── guides/        # Guide assignment
│   │   ├── jobs/          # Job postings
│   │   ├── recruiters/    # Recruiter management
│   │   └── sessions/      # Session management
│   ├── services/          # API services
│   │   └── mock/          # Mock services for development
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── App.tsx            # Main application component
├── public/                # Static assets
└── package.json
```

## 🔐 Default Login Credentials

### Internship Coordinator
- Email: `ic@christ.in`
- Password: `admin`

### HOD
- Email: `hod@christ.in`
- Password: `admin`

### Faculty
- Email: `faculty@christ.in`
- Password: `admin`

### Recruiter
- Email: `recruiter@company.com`
- Password: `admin`

## 🎨 Design System

### Colors
- **Primary Navy**: `#0F2137`
- **Primary Blue**: `#3B82F6`
- **Gold Accent**: `#D4AF37`
- **Success**: Emerald shades
- **Warning**: Amber shades
- **Error**: Rose shades

### Typography
- **Headings**: Bold, tracking-tight
- **Body**: Regular weight, comfortable line-height
- **Mono**: For register numbers and codes

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔄 State Management

- **Authentication**: Context API + localStorage
- **Notifications**: Context API with queue system
- **Forms**: Local component state
- **Data Fetching**: Async/await with loading states

## 🧪 Testing

The application includes:
- TypeScript strict mode for type safety
- ESLint for code quality
- Form validation
- Error boundaries for runtime errors

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://your-backend-api.com
```

## 📊 Features Roadmap

### Completed ✅
- [x] Role-based authentication
- [x] Application management with filters
- [x] Guide assignment system
- [x] CSV export functionality
- [x] Skeleton loading states
- [x] Error boundaries
- [x] Search and filter components
- [x] Confirmation dialogs
- [x] Timeline component
- [x] Quick stats widgets

### In Progress 🚧
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Email integration
- [ ] Document upload system

### Planned 📋
- [ ] Mobile app
- [ ] PDF report generation
- [ ] Bulk operations
- [ ] Advanced search with filters
- [ ] Calendar integration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is proprietary and confidential. © 2026 Christ University

## 🆘 Support

For support, email support@christuniversity.in or contact the IT department.

## 🙏 Acknowledgments

- Christ University IT Department
- All contributors and testers
- React and TypeScript communities

---

**Built with ❤️ for Christ University**
