FROM node:lts-alpine AS build
WORKDIR /app

# 패키지 설치
COPY package.json package-lock.json ./
RUN npm ci --silent

# 소스 복사 및 빌드
COPY . ./
RUN npm run build

# Nginx 배포
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# 빌드 결과물 복사
COPY --from=build /app/build .

# Nginx 설정 적용
COPY ./nginx/admin-nginx.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/env-config.template.js ./env-config.js
COPY ./nginx/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
