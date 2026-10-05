# Tauri Development & Build Environment (Rust + Node.js + Bun)
FROM rust:1-slim-bookworm

# Prevent interactive prompts during apt installations
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies required for Node, Bun, and Tauri (Linux/WebKit/SSL)
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    build-essential \
    pkg-config \
    libssl-dev \
    libwebkit2gtk-4.1-dev \
    libappindicator3-dev \
    librsvg2-dev \
    patchelf \
    ca-certificates \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js (v22 LTS)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install Bun
ENV BUN_INSTALL="/root/.bun"
ENV PATH="${BUN_INSTALL}/bin:${PATH}"
RUN curl -fsSL https://bun.sh/install | bash

# Working directory inside container
WORKDIR /app

# Copy dependency manifests first for cached layer builds
COPY package.json bun.lock* ./

# Install project frontend dependencies via bun
RUN bun install

# Copy application source code
COPY . .

# Expose default Vite development port if running dev mode
EXPOSE 1420 5173

# Default command builds the frontend & tauri application
CMD ["bun", "run", "tauri", "build"]
