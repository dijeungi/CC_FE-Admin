FROM node:alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --silent

COPY . /app
RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# 빌드된 React 앱 복사
COPY --from=build /app/build .

# Nginx 설정 파일 복사
COPY ./nginx/nginx-admin.conf /etc/nginx/conf.d/nginx.conf

# 환경 변수 템플릿 및 엔트리포인트 스크립트 복사
COPY ./nginx/env-config.template.js ./env-config.template.js
COPY ./nginx/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

# 엔트리포인트 스크립트 실행 권한 부여
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# 실행 시 환경 변수를 적용한 후 Nginx 실행
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
