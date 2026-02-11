# ============================================
# Stage 1: Build
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Paket dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm ci

# Kaynak kodları kopyala
COPY . .

# ============================================
# Ortam değişkenlerini al (Build sırasında gereklidir)
# Docker build sırasında --build-arg ile geçilebilir
# Örnek: docker build --build-arg NEXT_PUBLIC_API_URL=https://api.gramkumbaram.com .
# ============================================
ARG NEXT_PUBLIC_API_URL=https://api.gramkumbaram.com
ARG NEXT_PUBLIC_API_TIMEOUT=30000
ARG NEXT_PUBLIC_FRONTEND_URL=https://gramkumbaram.com
ARG NEXT_PUBLIC_ENABLE_DEBUG=false
ARG NEXT_PUBLIC_ENABLE_MOCK_API=false

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_API_TIMEOUT=${NEXT_PUBLIC_API_TIMEOUT}
ENV NEXT_PUBLIC_FRONTEND_URL=${NEXT_PUBLIC_FRONTEND_URL}
ENV NEXT_PUBLIC_ENABLE_DEBUG=${NEXT_PUBLIC_ENABLE_DEBUG}
ENV NEXT_PUBLIC_ENABLE_MOCK_API=${NEXT_PUBLIC_ENABLE_MOCK_API}

# Projeyi derle (Build)
RUN npm run build

# ============================================
# Stage 2: Production (Node.js - npm start)
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Sadece gerekli dosyaları builder aşamasından al
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Portu 3000 olarak ayarla (Standart Next.js portu)
EXPOSE 3000

# Uygulamayı başlat
CMD ["npm", "start"]