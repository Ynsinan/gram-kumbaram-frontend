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

# Ortam değişkenlerini al (Build sırasında gereklidir)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

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