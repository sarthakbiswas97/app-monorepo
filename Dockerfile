FROM node:alpine

WORKDIR /app/

RUN npm install -g pnpm

# Copy all workspace configuration files first
COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY turbo.json .

# Copy the entire packages directory
COPY packages/ ./packages/

# Copy your docs app
COPY apps/docs/ ./apps/docs/

# Ensure eslint config is present
COPY packages/eslint-config/ ./packages/eslint-config/

RUN pnpm install
RUN pnpm build

CMD [ "pnpm", "start:docs" ]