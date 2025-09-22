# --------- Build Stage ---------
FROM node:24-slim AS builder

WORKDIR /app

ENV VITE_NODE_ENV=production

COPY package*.json ./
COPY tsconfig.json ./
COPY server ./server
COPY client ./client
COPY shared ./shared

RUN npm ci

ARG TARGETARCH
RUN if [ "$TARGETARCH" = "arm64" ]; then \
    npm i -w client -D --no-save @rollup/rollup-linux-arm64-gnu || true; \
    elif [ "$TARGETARCH" = "amd64" ] || [ "$TARGETARCH" = "x86_64" ]; then \
    npm i -w client -D --no-save @rollup/rollup-linux-x64-gnu || true; \
    else \
    echo "Unknown TARGETARCH=$TARGETARCH; relying on Rollup JS fallback"; \
    fi

RUN npm run build


# --------- Run Stage ---------
FROM node:24-slim

ENV NODE_ENV=production


ENV CODE_SERVER_VERSION=4.103.1


RUN apt-get update && apt-get install -y \
    curl ca-certificates gnupg nginx supervisor \
    && rm -rf /var/lib/apt/lists/*

RUN ARCH=$(dpkg --print-architecture) \
    && curl -fL -o /tmp/code-server.deb \
    "https://github.com/coder/code-server/releases/download/v${CODE_SERVER_VERSION}/code-server_${CODE_SERVER_VERSION}_${ARCH}.deb" \
    && dpkg -i /tmp/code-server.deb \
    && rm /tmp/code-server.deb

WORKDIR /app


RUN npm install better-sqlite3
COPY --from=builder /app/dist/client ./dist/client
COPY --from=builder /app/dist/server ./dist/server
COPY /runner ./runnerDemo
COPY configs/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

RUN cd /app/runnerDemo && npm install

# Configs
COPY configs/supervisord/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY configs/nginx/nginx.conf /etc/nginx/nginx.conf
COPY configs/code-server/settings.json /root/.local/share/code-server/User/settings.json

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

