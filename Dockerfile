FROM node:20-alpine AS builder

WORKDIR /app

# 複製依賴配置檔案
COPY package.json package-lock.json ./
# 安裝所有依賴（包括開發依賴）
RUN npm ci

# 複製所需配置檔案和源代碼
COPY tsconfig.json ./
COPY src/ ./src/

# 生成 Prisma 客戶端
RUN npm run generate
# 編譯 TypeScript 代碼
RUN npm run build
# 移除開發依賴，只保留生產所需依賴
RUN npm prune --production

# 生產階段映像
FROM node:20-alpine AS production

WORKDIR /app

# 設定環境變數
ENV NODE_ENV=production
# 使用 Render 提供的 PORT 或預設 3000
ENV PORT=${PORT:-3000}

# 從 builder 階段複製必要檔案
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
# 複製 Prisma schema 以便能正確連接資料庫
COPY --from=builder /app/src/prisma/schema.prisma ./src/prisma/
COPY --from=builder /app/src/prisma/generated ./src/prisma/generated

# 設定容器對外端口
EXPOSE ${PORT}

# 啟動應用
CMD ["npm", "start"]
