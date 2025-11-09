# Job Finder AI

A full-stack job search platform that scrapes job listings from multiple sources and uses AI to match them with your skills and preferences.

## What It Does

This app continuously pulls job listings from various job boards (Indeed, LinkedIn, Stack Overflow, etc.), analyzes them using OpenAI's API, and scores them based on how well they match your profile. Instead of manually searching multiple sites, you get a personalized feed of opportunities ranked by relevance.

## Tech Stack

**Backend**
- Django 4.2 + Django REST Framework
- PostgreSQL (production) / SQLite (development)
- Celery + Redis for background tasks
- OpenAI API for job analysis
- BeautifulSoup4 + Selenium for web scraping

**Frontend**
- Next.js 15 with React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion for animations

## Setup

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 manage.py migrate
python3 manage.py runserver 8001
```

Create a `.env` file in the backend directory:
```
SECRET_KEY=your_secret_key
DEBUG=True
REDIS_URL=redis://localhost:6379/0
OPENAI_API_KEY=your_openai_key  # optional but recommended
ADZUNA_APP_ID=your_adzuna_id    # optional
ADZUNA_API_KEY=your_adzuna_key  # optional
JSEARCH_API_KEY=your_jsearch_key # optional
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:8001
```

### Running Background Workers (Optional)

```bash
# Terminal 1
redis-server

# Terminal 2
cd backend
celery -A job_finder worker -l info

# Terminal 3
cd backend
celery -A job_finder beat -l info
```

## Usage

After starting the servers, you can:

1. **Scrape jobs**: `python3 manage.py api_refresh_jobs`
2. **Score jobs**: `python3 manage.py score_jobs`
3. **View dashboard**: Visit http://localhost:3000

The app will show you jobs ranked by how well they match your preferences (skills, experience level, location, salary range).

## Key Features

- Multi-source job scraping (19+ different scrapers)
- AI-powered job analysis using GPT-3.5
- Customizable scoring based on skills, experience, location, and salary
- Real-time market intelligence (top skills in demand, salary ranges)
- Email digests of top matches
- Django admin panel for managing preferences

## Project Structure

```
├── backend/
│   ├── jobs/           # Main Django app
│   │   ├── models.py   # Database models
│   │   ├── scrapers/   # Job board scrapers
│   │   ├── ai_engine.py # OpenAI integration
│   │   └── scoring.py  # Matching algorithm
│   └── job_finder/     # Django settings
└── frontend/
    └── src/
        ├── app/        # Next.js pages
        ├── components/ # React components
        └── lib/        # API client
```

## How It Works

1. **Scraping**: Background tasks pull jobs from multiple sources
2. **Analysis**: OpenAI extracts skills and analyzes job quality
3. **Scoring**: Each job gets scored (0-100) based on your preferences
4. **Display**: Jobs ranked by match score in the frontend

## Deployment

The backend is configured for Render.com and the frontend for Vercel. Configuration files are included.

## License

MIT
