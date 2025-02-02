# Stage 1: Build da aplicação
FROM node:18-alpine AS builder
WORKDIR /app

# Instala as dependências necessárias para compilar módulos nativos
RUN apk add --no-cache python3 make g++ git

# Copia explicitamente os arquivos essenciais da raiz para o container
# Se houver variações (por exemplo, tsconfig.build.json), inclua-as também
COPY package*.json tsconfig.json ./

# Instala todas as dependências (dev e produção)
RUN npm install

# Copia todo o restante do código da raiz
COPY . .

# Exibe os arquivos para depuração (opcional)
RUN ls -la /app

# Executa o build da aplicação (ajuste conforme seu script de build)
RUN npm run build

# Stage 2: Imagem de produção (para quando rodar npm run build && npm run test && npm run start)
FROM node:18-alpine AS production
WORKDIR /app

# Copia os artefatos do estágio anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/tsconfig.json ./

EXPOSE 3000

CMD ["node", "dist/main.js"]
