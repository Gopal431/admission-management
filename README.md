# Admission Management ERP System

A comprehensive admission management system built with React, Vite, and Ant Design. This enterprise-level application provides a complete solution for managing student admissions with modern UI/UX and professional features.

## Features

### Core Features

- **Dashboard Analytics**: Real-time statistics and charts showing admission trends
- **Admission Form**: Multi-step form with validation for new student admissions
- **Student Database**: Advanced search and filtering capabilities for student records
- **Document Management**: Upload, manage, and track admission documents
- **Status Tracking**: Monitor application status with workflow visualization
- **Reports & Export**: Generate and export reports to Excel and PDF formats

### Key Capabilities

- Responsive design for desktop, tablet, and mobile devices
- Professional color scheme with blue theme (customizable)
- Advanced filtering and search across all modules
- Real-time statistics and analytics
- Multi-step form with validation
- Document upload and management
- Status workflow tracking with history
- Excel and PDF export functionality
- Print-friendly reports

## Tech Stack

- **Frontend Framework**: React 18.2
- **Build Tool**: Vite 5.0
- **UI Library**: Ant Design 5.13
- **Icons**: 
  - Ant Design Icons
  - React Icons
  - Core UI Icons
- **Charts**: Recharts 2.10
- **Data Export**: 
  - XLSX (Excel)
  - jsPDF (PDF)
- **Date Handling**: date-fns 3.0
- **HTTP Client**: Axios 1.6
- **Language**: TypeScript 5.2

## Project Structure

```
admission-management-erp/
├── src/
│   ├── pages/
│   │   ├── Dashboard.tsx          # Dashboard with analytics
│   │   ├── AdmissionForm.tsx      # Multi-step admission form
│   │   ├── StudentsList.tsx       # Student database with filters
│   │   ├── DocumentManagement.tsx # Document upload and management
│   │   ├── StatusTracking.tsx     # Status workflow tracking
│   │   └── Reports.tsx            # Reports and export functionality
│   ├── data/
│   │   └── mockData.ts            # Mock data and interfaces
│   ├── styles/
│   │   ├── Form.css
│   │   ├── StudentsList.css
│   │   ├── DocumentManagement.css
│   │   ├── StatusTracking.css
│   │   └── Reports.css
│   ├── App.tsx                    # Main app component
│   ├── App.css                    # App styles
│   ├── index.css                  # Global styles
│   └── main.tsx                   # React entry point
├── index.html                     # HTML entry point
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies and scripts
└── README.md                      # This file
```

## Installation

### Prerequisites

- Node.js 16+ 
- npm or yarn or pnpm

### Setup

1. Clone or download the project
2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will open at `http://localhost:3000`

## Usage

### Dashboard
- View admission statistics and trends
- See monthly admission data
- Track application status distribution
- Monitor recent applications

### Admission Form
- Step 1: Personal Information (name, contact details)
- Step 2: Address Information (city, state, zip)
- Step 3: Educational Qualifications (CGPA, qualification)
- Step 4: Review and submit application

### Student Database
- Search students by name, email, or phone
- Filter by admission status and gender
- View detailed student information
- Delete student records
- Sort by multiple columns

### Document Management
- Upload documents for students
- View document statistics
- Download documents
- Delete documents
- Track document types

### Status Tracking
- View all student applications
- Update application status
- Add remarks for status updates
- Track status history
- View workflow steps

### Reports & Export
- Filter reports by status and date range
- Export to Excel format
- Export to PDF format
- View analytics and charts
- Print reports

## Customization

### Color Scheme

Edit `/src/index.css` to customize colors:

```css
:root {
  --primary-color: #1890ff;
  --primary-dark: #0050b3;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #ff4d4f;
  --neutral-gray: #f5f5f5;
}
```

### Data Source

Replace mock data in `/src/data/mockData.ts` with API calls:

```typescript
// Example with Axios
import axios from 'axios'

const fetchStudents = async () => {
  const response = await axios.get('/api/students')
  return response.data
}
```

## Building for Production

```bash
npm run build
# or
yarn build
```

This creates an optimized production build in the `dist` directory.

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically on push

### Other Platforms
The `dist` folder created by `npm run build` can be deployed to any static hosting service (Netlify, GitHub Pages, AWS S3, etc.)

## Features in Detail

### Dashboard Analytics
- Total applications count
- Approved/Pending/Rejected statistics
- Monthly admission trends
- Status distribution pie chart
- Recent applications table

### Advanced Form Validation
- Required field validation
- Email format validation
- Phone number validation
- CGPA range validation (0-10)
- Zip code format validation

### Student Filtering
- Multi-status filter
- Gender filter
- Full-text search
- Combine multiple filters
- Clear all filters

### Document Management
- Multiple file types support
- Document type categorization
- Upload date tracking
- Student association
- Statistics by document type

### Status Workflow
- 4-status workflow (Pending → Processing → Approved/Rejected)
- Status update with remarks
- Timeline history tracking
- Visual status indicators

### Report Generation
- Excel export with formatting
- PDF export with tables
- Statistics calculation
- Qualification breakdown
- City-wise distribution
- Print-friendly layout

## API Integration

To connect to a real backend, update the axios calls in each page component:

```typescript
// Example in Dashboard.tsx
useEffect(() => {
  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/students')
      setStudents(response.data)
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }
  fetchStudents()
}, [])
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

The application includes:
- Optimized component rendering
- Memoization for expensive computations
- Lazy loading for large datasets
- Efficient re-renders with React hooks
- Responsive images and assets

## Accessibility

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly

## Contributing

When adding new features:
1. Create new components in `/src/pages/` or `/src/components/`
2. Add corresponding styles in `/src/styles/`
3. Update mock data in `/src/data/mockData.ts`
4. Test across different screen sizes
5. Ensure TypeScript types are properly defined

## Troubleshooting

### Port Already in Use
```bash
npm run dev -- --port 3001
```

### Build Errors
Clear node_modules and reinstall:
```bash
rm -rf node_modules
npm install
npm run build
```

### Hot Module Reload Not Working
Restart the dev server:
```bash
npm run dev
```

## License

MIT License - feel free to use this project for your needs

## Support

For issues or questions, create an issue in the repository or contact support.

## Future Enhancements

- Backend API integration
- Authentication system
- Role-based access control
- Email notifications
- SMS alerts
- Interview scheduling
- Merit calculator
- Bulk operations
- Advanced analytics
- Document digitization

---

Built with React + Vite + Ant Design
