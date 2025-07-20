# syntax=docker/dockerfile:1

# ARGs for versioning
ARG NODE_VERSION=24.3.0
ARG PNPM_VERSION=10.13.1

################################################################################
# Base stage
FROM node:${NODE_VERSION:-latest}-alpine AS base

# Install required packages
RUN apk add --no-cache \
    ca-certificates \
    curl \
    cronie \
    && mkdir -p /usr/src/app

# Set working directory
WORKDIR /usr/src/app

# Install pnpm
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}


################################################################################
# Dependencies stage
FROM base AS deps

# Copy only necessary files for dependencies
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

################################################################################
# Build stage
FROM deps AS build

COPY . .

# ...existing code...

# Build the app
RUN pnpm run build

################################################################################
# Final stage
FROM base AS final

# Set production environment
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup -s /bin/sh

# Set working directory ownership
RUN chown -R appuser:appgroup /usr/src/app

COPY --from=build --chown=appuser:appgroup /usr/src/app/build ./build
COPY --from=build --chown=appuser:appgroup /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=appuser:appgroup /usr/src/app/package.json ./package.json
COPY --from=build --chown=appuser:appgroup /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=build --chown=appuser:appgroup /usr/src/app/static ./static
COPY --from=build --chown=appuser:appgroup /usr/src/app/.svelte-kit ./.svelte-kit
COPY --from=build --chown=appuser:appgroup /usr/src/app/svelte.config.js ./svelte.config.js
COPY --from=build --chown=appuser:appgroup /usr/src/app/vite.config.ts ./vite.config.ts


# Copy cronjobs file and enable cron
COPY cronjobs /etc/crontabs/root
RUN chmod 0644 /etc/crontabs/root
RUN crontab /etc/crontabs/root


EXPOSE 3000
CMD sh -c 'crond && su appuser -c "node build"'