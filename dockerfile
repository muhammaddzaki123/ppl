# Tahap 1: Build
# Pada tahap ini, kita akan meng-install dependencies dan membangun aplikasi Next.js
FROM node:20-alpine AS builder

# Set direktori kerja di dalam container
WORKDIR /app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Install semua dependencies (termasuk devDependencies yang dibutuhkan untuk build)
RUN npm install

# Salin sisa kode sumber aplikasi
COPY . .

# Nonaktifkan telemetri Next.js
ENV NEXT_TELEMETRY_DISABLED 1

# Bangun aplikasi Next.js untuk produksi
# Ini akan menghasilkan output di folder .next
RUN npm run build

# Tahap 2: Produksi
# Pada tahap ini, kita akan membuat image yang ringan untuk menjalankan aplikasi
FROM node:20-alpine AS runner

# Set direktori kerja
WORKDIR /app

# Set environment ke 'production'
ENV NODE_ENV=production
# Nonaktifkan telemetri Next.js
ENV NEXT_TELEMETRY_DISABLED 1

# Buat user dan grup khusus untuk aplikasi agar tidak berjalan sebagai root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Salin output dari tahap 'builder'
# Kita akan menggunakan output 'standalone' dari Next.js untuk image yang lebih kecil
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Ganti user ke non-root yang sudah dibuat
USER nextjs

# Expose port yang akan digunakan oleh aplikasi
EXPOSE 3000

# Set port default
ENV PORT 3000

# Perintah untuk menjalankan aplikasi
# Ini akan menjalankan server Node.js yang dibuat oleh output 'standalone'
CMD ["node", "server.js"]
