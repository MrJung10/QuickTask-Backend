# QuickTask API

QuickTask is a task and project management API built using **Node.js**, **Express**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**. It is designed to be modular, scalable, and production-ready with Docker support.

---

## 🚀 Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Containerization**: Docker
- **Linting**: ESLint with TypeScript rules

---

## 📁 Project Structure
```
src/
├── app/
│   ├── http/
│   │   ├── controllers/      # Request handlers
│   │   ├── middlewares/      # Express middlewares
│   │   ├── requests/         # Request DTOs or validators
│   │   └── resources/        # Resource formatters / transformers
│   ├── models/               # Prisma model helpers or custom models
│   └── services/             # Business logic services
├── config/                   # App configurations
├── database/                 # DB-related logic like seeders or queries
├── routes/                   # API route definitions
├── types/                    # TypeScript types and interfaces
├── utils/                    # Helper functions
├── app.ts                    # App instance setup (Express, middleware, etc.)
└── server.ts                 # Server bootstrap (listen on port)

prisma/                       # Prisma schema and migrations
├── schema.prisma
└── migrations/

docker-compose.yml           # Docker services configuration
```


---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/quicktask.git
cd quicktask
```


### 2. Setup Environment
Create a .env file based on .env.example:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/quicktask"
PORT=3000
NODE_ENV=development
```

### 3. Install Dependencies
```
npm install
```

### 4. Generate Prisma Client & Run Migrations
```bash
npx prisma generate
npx prisma migrate dev --name init
```

## 🐳 Docker Setup
### 1. Build the Image
```bash
docker build -t quicktask-api .
```

### 2. Run the Container
```bash
docker run -p 3000:3000 --env-file .env quicktask-api
```

📦 Available Scripts
| Script          | Description               |
| --------------- | ------------------------- |
| `npm run dev`   | Start in development mode |
| `npm run build` | Compile TypeScript        |
| `npm start`     | Run compiled app          |
| `npm run lint`  | Run ESLint                |
| `npx prisma`    | Prisma ORM CLI            |


## 📄 License
MIT

## 👨‍💻 Author
Made with ❤️ by Samir Karki
