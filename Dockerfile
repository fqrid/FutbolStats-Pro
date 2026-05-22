# Corrección 1: Se optimizó la imagen base utilizando node:24-slim
FROM node:24-slim

WORKDIR /app

# Corrección 2: Copia previa de package.json y package-lock.json para optimizar la caché de capas de Docker
COPY package*.json ./
RUN npm install

# Copia del resto del código de la aplicación
COPY . .

# Se cambia el puerto expuesto al puerto 3000 (el que usa la API de Express)
EXPOSE 3000

CMD ["npm", "start"]