# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.3.0
ARG PNPM_VERSION=10.13.1

################################################################################
# Base stage
FROM node:${NODE_VERSION:-latest}-alpine AS base

# Install required packages (cronie provides crond)
RUN apk add --no-cache \
    ca-certificates \
    curl \
    cronie \
 && mkdir -p /usr/src/app

WORKDIR /usr/src/app

# Install pnpm globally
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}


################################################################################
# Dependencies stage
FROM base AS deps

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile


################################################################################
# Build stage
FROM deps AS build

COPY . .
RUN pnpm run build


################################################################################
# Final stage
FROM base AS final

ENV NODE_ENV=production

# Create non-root runtime user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup -s /bin/sh

# Copy production artifacts from build stage
COPY --from=build --chown=appuser:appgroup /usr/src/app/build ./build
COPY --from=build --chown=appuser:appgroup /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=appuser:appgroup /usr/src/app/package.json ./package.json
COPY --from=build --chown=appuser:appgroup /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=build --chown=appuser:appgroup /usr/src/app/static ./static
COPY --from=build --chown=appuser:appgroup /usr/src/app/.svelte-kit ./.svelte-kit
COPY --from=build --chown=appuser:appgroup /usr/src/app/svelte.config.js ./svelte.config.js
COPY --from=build --chown=appuser:appgroup /usr/src/app/vite.config.ts ./vite.config.ts

# Copy cronjobs file (root temp location first)
COPY --from=build /usr/src/app/cronjobs /tmp/cronjobs

# Normalize line endings, ensure trailing newline, set perms, install for appuser
# Using sed strips CRLF; printf always appends a newline (harmless if one already there)
RUN sed -i 's/\r$//' /tmp/cronjobs \
 && printf '\n' >> /tmp/cronjobs \
 && chown appuser:appgroup /tmp/cronjobs \
 && chmod 0644 /tmp/cronjobs \
 && crontab -u appuser /tmp/cronjobs

# Ensure sitemap log exists and is writable
RUN touch /var/log/sitemap.log \
 && chown appuser:appgroup /var/log/sitemap.log

# Switch to non-root user for runtime
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

EXPOSE 3000

# Create custom run dir for crond
RUN mkdir -p /home/appuser/var/run && chown -R appuser:appgroup /home/appuser/var

CMD sh -c "crond -f -p /home/appuser/var/run/crond.pid & node build"

