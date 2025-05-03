# Eventa Backend
This project is the backend service for Eventa, a TypeScript-based RESTful API server built with Express.js, Prisma, and PostgreSQL.

## Tech Stack
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- Biome (formatter + linter)
- Swagger (API documentation)

## Project Structure
```
Eventa_Backend/
├── node_modules/
├── src/
│   ├── server.ts             # 入口：啟動伺服器
│   ├── routes/               # 所有 API 路由進入點
│   ├── controllers/          # 控制邏輯，處理 req/res 邏輯
│   ├── services/             # 商業邏輯、資料處理
│   ├── middlewares/          # 中介函式（錯誤處理、驗證等）
│   ├── config/               # 設定檔（.env 或連線資訊）
│   ├── prisma/               # Prisma 專屬資料夾
│   │   └── schema.prisma     # Prisma 連線資訊、Table schema
│   ├── utils/                # 共用工具函式
│   ├── validators/                # 定義 Zod 驗證 schema
│   └── types/                # 自訂型別定義
├── dist/                     # 編譯後的 JS 檔案（由 TS 編譯而來）
├── tsconfig.json
├── package.json
├── .env
├── .biome.jsonc
├── commitlint.config.js
└── README.md
```


# Project documentation
## Getting Started

### 1. Clone the repository

```
git clone https://github.com/Eventa5/Eventa_Backend.git
cd Eventa_Backend
```
### 2. Install dependencies
```
npm install
```

### 3. Set up environment variables
Create a .env file in the root directory and define your environment variables (e.g., database connection string).

Example:
```
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

### 4. Run database migrations
```
npm run deploy
```

### 5. Start the development server
```
npm run dev
```
The server will start on http://localhost:3000 by default.

## Available Scripts

| Script | Description |
|:---|:---|
| `npm run dev` | Start the server in development mode with hot-reload |
| `npm run build` | Compile TypeScript files to JavaScript |
| `npm run start` | Run the compiled server (`dist/server.js`) |
| `npm run migrate` | Run Prisma database migrations |
| `npm run generate` | Generate Prisma client |
| `npm run deploy` | Apply database migrations and regenerate Prisma client |
| `npm run studio` | Open Prisma Studio (GUI for the database) |
| `npm run reset` | Reset the database with Prisma |
| `npm run seed` | Seed the database |
| `npm run lint` | Run Biome linting and apply fixes |
| `npm run format` | Format code using Biome |

## API Documentation
Swagger UI is available at: `http://localhost:3000/api/docs`
