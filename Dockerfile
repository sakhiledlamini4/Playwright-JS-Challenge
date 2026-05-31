# Multi-stage Dockerfile for the Performance Engineering Framework

# Stage 1: Base image with k6 and Node.js
FROM grafana/k6:latest as k6-base

# Install Node.js for running Playwright tests
RUN apk add --no-cache nodejs npm python3 make g++

# Stage 2: Final image with all dependencies
FROM k6-base

WORKDIR /app

# Copy project files
COPY . .

# Install dependencies
RUN npm install
RUN cd playwright/restful-booker && npm install
RUN cd ../sauce-demo && npm install
RUN cd ../../k6 && npm install

# Set environment variables
ENV ENV=dev
ENV K6_OUT=influxdb=http://influxdb:8086/k6

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Default command
CMD ["k6", "run", "k6/load/load.js"]
