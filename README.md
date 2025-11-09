# Job Finder AI

A full-stack application for AI-powered job searching and tracking.

## Project Structure

This is a monorepo containing both the frontend and backend applications:

```
job-finder-ai/
├── frontend/          # Next.js frontend application
├── backend/           # Django backend API
└── README.md          # This file
```

## Prerequisites

- **Frontend**: Node.js 18+ and npm
- **Backend**: Python 3.11+, PostgreSQL, Redis

## Quick Start

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

For detailed frontend documentation, see [frontend/README.md](./frontend/README.md)

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The backend API will be available at `http://localhost:8000`

For detailed backend documentation, see backend setup files.

## Development Workflow

### Running Both Apps Locally

1. Start the backend server (terminal 1):
   ```bash
   cd backend
   python manage.py runserver
   ```

2. Start the frontend dev server (terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

3. (Optional) Start Celery worker for background tasks (terminal 3):
   ```bash
   cd backend
   celery -A job_finder worker -l info
   ```

4. (Optional) Start Celery beat for scheduled tasks (terminal 4):
   ```bash
   cd backend
   celery -A job_finder beat -l info
   ```

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: Heroicons, Lucide React
- **Animation**: Framer Motion

### Backend
- **Framework**: Django 4.2
- **Language**: Python 3.11
- **API**: Django REST Framework
- **Task Queue**: Celery with Redis
- **Database**: PostgreSQL
- **AI Integration**: OpenAI API
- **Web Scraping**: BeautifulSoup4, Selenium

## Deployment

### Frontend
Deployed separately (likely Vercel or similar platform)

### Backend
Deployed on Render.com with:
- PostgreSQL database
- Redis for Celery
- Gunicorn as WSGI server

Configuration files: `backend/render.yaml`, `backend/Procfile`

## Environment Variables

Each application manages its own environment variables:
- Frontend: `frontend/.env.local`
- Backend: `backend/.env`

Refer to each application's documentation for required environment variables.

## Contributing

1. Create a feature branch from `main`
2. Make your changes in the appropriate directory (`frontend/` or `backend/`)
3. Test your changes locally
4. Submit a pull request

## License

[Add your license here]
