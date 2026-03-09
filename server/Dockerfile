FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm install typescript ts-node

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

EXPOSE 2567

CMD ["node", "dist/index.js"]
