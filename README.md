# Job + ATS Platform

Note: make this website fully functional and dynamic.
connect both frontend and backend with each other.
make sure everything is working properly. data is stored and rendering from
database.

A full-stack Job Application Tracking System built with Django REST Framework backend and React frontend.

## Project Structure

```
job-ats/
├── backend/                  # Django REST API
│   ├── manage.py
│   ├── backend/              # Django project settings
│   ├── jobs/                 # Jobs and applications app
│   ├── users/                # User authentication app
│   └── requirements.txt
│
├── frontend/                 # React + Vite frontend
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── pages/            # Page components
│       └── components/       # Reusable components
│
└── README.md
```

## Features

### Backend (Django REST API)
- User authentication with JWT tokens
- User profiles (candidates and employers)
- Company management
- Job posting and management
- Application tracking
- Interview scheduling
- REST API with proper serialization
- Admin interface
- API documentation with Swagger

### Frontend (React + Vite)
- Modern React application with TypeScript support
- Responsive design with Tailwind CSS
- Job search and filtering
- User authentication
- Candidate dashboard
- Employer dashboard
- Application management

## Environment Limitations

**Important**: This project is set up for WebContainer environment which has Python standard library limitations. For full Django functionality, you'll need to either:

1. **Use Supabase** (Recommended for WebContainer):
   - Replace Django backend with Supabase for database and authentication
   - Keep the React frontend as-is
   - All functionality can be implemented with Supabase

2. **Deploy to a full server environment**:
   - Use the Django backend in a traditional server environment
   - Install all Python dependencies from requirements.txt

## Quick Start (Supabase Approach)

1. Click "Connect to Supabase" in the top right
2. Set up the database schema based on the Django models
3. Update the frontend to use Supabase client instead of Django API
4. Deploy the frontend to Bolt Hosting

## Technologies Used

### Backend
- Django 4.2+
- Django REST Framework
- JWT Authentication
- PostgreSQL
- Django CORS Headers
- Swagger/OpenAPI documentation

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Lucide React (icons)
- Axios (HTTP client)

## Getting Started (Traditional Setup)

1. **Backend Setup**:
   ```bash
   cd backend
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## API Endpoints

- `/api/auth/` - Authentication endpoints
- `/api/jobs/` - Job management
- `/api/jobs/applications/` - Application management
- `/api/jobs/interviews/` - Interview scheduling
- `/swagger/` - API documentation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request