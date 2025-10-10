# TrendRadar AI - SaaS BI Platform

A powerful SaaS Business Intelligence platform with RBAC (Role-Based Access Control), trend analytics, chatbot, and comprehensive data management features.

## 🚀 Features

- **RBAC System**: 4 roles (Admin, Owner, Analyst, Viewer) with granular permissions
- **Dynamic Dashboard**: KPI tiles, charts, auto-refreshing Hot Trends
- **Trend Explorer**: Hashtag rankings, sentiment analysis, forecasting, CSV export
- **AI Chatbot**: Real-time streaming responses via SSE
- **Data Lab**: File upload (CSV/XLSX), schema detection, chart suggestions
- **Action Center**: Restock suggestions, content generator, task management
- **Integrations**: Connect to TikTok, Shopee, Google Analytics, POS systems
- **Reports & Export**: PDF, PowerPoint, scheduled email reports
- **User Management**: Full CRUD for users (Admin only)
- **Audit Logging**: Track all sensitive actions

## 🎯 Quick Start (5 Minutes)

**Step 1**: Install dependencies
```bash
npm install
# or
yarn install
```

**Step 2**: Run database migrations
```bash
npm run migrate
# or
yarn migrate
```

**Step 3**: Seed dummy data for testing
```bash
node scripts/seed_dummy.js
# or for minimal data
node scripts/seed_dummy.js minimal
```

**Step 4**: Start development server
```bash
npm run dev
# or
yarn dev
```

**Step 5**: Open browser and login
- URL: [http://localhost:3000/login](http://localhost:3000/login)
- Use one of the test accounts below

## 🔑 Test Accounts

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **Admin** | admin@example.com | admin123 | Full system access |
| **Owner** | owner@example.com | owner123 | Manage team & billing |
| **Analyst** | analyst@example.com | analyst123 | Create & export reports |
| **Viewer** | viewer@example.com | viewer123 | Read-only access |

## 📊 API Seed Endpoint

For quick testing in development:
```bash
curl -X POST http://localhost:3000/api/dev/seed?profile=full
# or
curl -X POST http://localhost:3000/api/dev/seed?profile=minimal
```

## 🗄️ Database Configuration

**Switching database (Optional)**

Wren-ui uses SQLite as our default database. To use Postgres as the database of wren-ui, you need to set the two environment variable below.

```bash
# windows
SET DB_TYPE=pg
SET PG_URL=postgres://user:password@localhost:5432/dbname 

# linux or mac
export DB_TYPE=pg
export PG_URL=postgres://user:password@localhost:5432/dbname
```
-  `PG_URL` is the connection string of your postgres database.

To switch back to using SQLite, you can reassign the `DB_TYPE` to `sqlite`.
```
# windows
SET DB_TYPE=sqlite
SET SQLITE_FILE={your_sqlite_file_path} # default is ./db.sqlite3

# linux or mac
export DB_TYPE=sqlite
export SQLITE_FILE={your_sqlite_file_path}
```

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 14
- **UI Library**: Ant Design 4
- **State Management**: React Context + Apollo Client
- **Styling**: LESS + Tailwind CSS
- **Charts**: Vega-Lite + React Grid Layout

### Backend
- **API**: Next.js API Routes + GraphQL (Apollo Server)
- **Database**: SQLite / PostgreSQL (via Knex.js)
- **Authentication**: JWT (jsonwebtoken)
- **Authorization**: RBAC middleware
- **File Processing**: csv-parser, xlsx
- **PDF/PPT**: pdfkit, pptxgenjs

## 📁 Project Structure

```
├── migrations/              # Database migrations
│   ├── 20250511000001_create_users_and_auth.js
│   ├── 20250511000002_create_business_tables.js
│   └── 20250511000003_create_content_tables.js
├── scripts/
│   └── seed_dummy.js       # Seed script for test data
├── src/
│   ├── apollo/
│   │   ├── server/
│   │   │   ├── auth/       # Auth services & middleware
│   │   │   ├── rbac/       # Permission matrix & RBAC
│   │   │   └── ...
│   ├── components/
│   │   ├── ProtectedRoute.tsx
│   │   ├── layouts/
│   │   └── pages/          # Page-specific components
│   ├── config/
│   │   └── navigation.ts   # Role-based navigation config
│   ├── hooks/
│   │   └── useAuth.tsx     # Auth context & hook
│   ├── pages/
│   │   ├── login.tsx
│   │   ├── dashboard/
│   │   ├── trends/
│   │   ├── chatbot/
│   │   ├── data-lab/
│   │   ├── actions/
│   │   ├── integrations/
│   │   ├── settings/
│   │   ├── admin/          # Admin-only pages
│   │   └── api/
│   │       ├── auth/       # Login, logout, register
│   │       ├── chatbot/    # SSE streaming
│   │       └── dev/        # Seed endpoint
│   └── styles/
└── ACCEPTANCE_CRITERIA.md  # Testing checklist
```

## 🧪 Testing

### Run Unit Tests
```bash
npm test
```

### Run E2E Tests
```bash
npm run test:e2e
```

### Manual Testing Checklist
See [ACCEPTANCE_CRITERIA.md](./ACCEPTANCE_CRITERIA.md) for detailed testing steps.

## 🔒 Security

- **JWT Tokens**: 7-day expiration, stored in localStorage
- **Password Hashing**: bcrypt with 10 salt rounds
- **RBAC Enforcement**: Backend middleware + frontend guards
- **Audit Logging**: All sensitive actions logged
- **2FA Ready**: UI implemented, backend pending

## 📦 Dependencies

Key dependencies added for SaaS BI features:
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `csv-parser`, `xlsx` - File processing
- `pdfkit`, `pptxgenjs` - Report generation
- `nodemailer` - Email scheduling
- `speakeasy`, `qrcode` - 2FA (future)
- `react-big-calendar` - Content scheduling

## 🚢 Deployment

### Environment Variables
```bash
# JWT Secret (change in production!)
JWT_SECRET=your-secret-key-here

# Database
DB_TYPE=sqlite  # or 'pg' for PostgreSQL
SQLITE_FILE=./db.sqlite3  # if using SQLite
PG_URL=postgres://user:pass@localhost:5432/dbname  # if using Postgres

# Node Environment
NODE_ENV=production
```

### Build for Production
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add some feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit pull request

## 📞 Support

For issues or questions:
- Check [ACCEPTANCE_CRITERIA.md](./ACCEPTANCE_CRITERIA.md)
- Review test account credentials above
- Verify seed data loaded correctly

---

## Original WrenAI Documentation

### Development wren-ui module on local
There are many modules in TrendRadarAI, to develop wren-ui, you can start other modules(services) via docker-compose.
In the [Start wren-ui from source code](#Start-wren-ui-from-source-code) section, you've know how to start wren-ui from the source code to develop.
To start other modules via docker-compose, you can follow the steps below.

Step 1. Prepare you .env file
In the WrenAI/docker folder, you can find the .env.example file. You can copy this file to .env.local file.

```bash
# assume current directory is wren-ui
cd ../docker
cp .env.example .env.local
```
Step 2. Modify your .env.local file
You need to fill the `OPENAI_API_KEY` with your OPENAI api key before starting.

You can also change the `WREN_ENGINE_VERSION`, `WREN_AI_SERVICE_VERSION`, `IBIS_SERVER_VERSION` to the version you want to use.


Step 3. Start the services via docker-compose
```bash
# current directory is WrenAI/docker
docker-compose -f docker-compose-dev.yaml --env-file .env.example up

# you can add a -d flag to run the services in the background
docker-compose -f docker-compose-dev.yaml --env-file .env.example up -d
# then stop the services via
docker-compose -f docker-compose-dev.yaml --env-file .env.example down
```

Step 4. Start wren-ui from source code
refer to [Start wren-ui from source code](#Start-wren-ui-from-source-code) section to start wren-ui from source code.

Step 5. (Optional) Develop other modules along with wren-ui

As mentioned above, you can use docker-compose to start other modules. The same applies when developing other modules.
From the perspective of wren-ui, if you want to develop other modules at the same time, you can stop the container then spin up the module from the source code.

eg: If you want to develop ai-service module, you can stop the ai-service container then start the ai-service from the source code.
```yaml
# docker/docker-compose-dev.yaml
wren-engine:
    image: ghcr.io/canner/wren-engine:${WREN_ENGINE_VERSION}
    pull_policy: always
    platform: ${PLATFORM}
    expose:
      - ${WREN_ENGINE_SQL_PORT}
    ports:
      - ${WREN_ENGINE_PORT}:${WREN_ENGINE_PORT}
    volumes:
      - data:/usr/src/app/etc
    networks:
      - wren
    depends_on:
      - bootstrap
    ...
# comment out the ai-service service
wren-ai-service:
    image: ghcr.io/canner/wren-ai-service:${WREN_AI_SERVICE_VERSION}
    pull_policy: always
    platform: ${PLATFORM}
    ports:
      - ${AI_SERVICE_FORWARD_PORT}:${WREN_AI_SERVICE_PORT}
    environment:
      WREN_UI_ENDPOINT: http://host.docker.internal:${WREN_UI_PORT}
      # sometimes the console won't show print messages,
      # using PYTHONUNBUFFERED: 1 can fix this
      PYTHONUNBUFFERED: 1
      CONFIG_PATH: /app/data/config.yaml
    env_file:
      - ${PROJECT_DIR}/.env
    volumes:
      - ${PROJECT_DIR}/config.yaml:/app/data/config.yaml
    networks:
      - wren
    depends_on:
      - qdrant

ibis-server:
    image: ghcr.io/canner/wren-engine-ibis:${IBIS_SERVER_VERSION}
    ...
```
Then refer to the README.md or CONTRIBUTION.md file the module for starting the module from the source code. 

eg: refer to the [ai-service README](https://github.com/Canner/WrenAI/blob/main/wren-ai-service/README.md#start-the-service-for-development) to start the ai-service from the source code.



## FAQ
### Can I have multiple project at the same time in TrendRadarAI?
We currently do not support multiple projects in TrendRadarAI. You can only have one project at a time.
But there is a workaround for this. Since TrendRadarEngine is stateless and we store your semantic model in the database(Sqlite or Postgres), 
you can switch between projects by switching the database and make sure you deploying after server started.

> Tip: Define the `DB_TYPE` and `SQLITE_FILE` or `PG_URL` variable to specify which database you intend to use.

eg: 
```bash
# start your first project using default database(sqlite by defulat)
yarn migrate
yarn dev

# ... after onboarding and lots of hard work, you want to switch to another project 
# stop the server

# set another sqlite file
export SQLITE_FILE=./new_project.sqlite
yarn migrate
yarn dev

# In the Browser, ... after another onboarding process and hard work
# you can switch back to the first project by setting the first sqlite file
export SQLITE_FILE=./first_project.sqlite

yarn dev  # no need to do migration again

# in the modeling page, click the deploy button to deploy the project to the wren-ai-service.
# your TrendRadarAI is ready to answer your question.
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!