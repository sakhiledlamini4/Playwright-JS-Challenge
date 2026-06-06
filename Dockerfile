# Multi-stage Dockerfile for the Performance Engineering Framework

# Stage 1: Base image with k6 and Node.js
FROM grafana/k6:latest as k6-base

# Switch to root so we can install packages into the image
USER root

# Install Node.js for running Playwright tests
RUN apk add --no-cache nodejs npm python3 make g++

# Restore the default k6 user for the final image
USER k6

# Stage 2: Final image with all dependencies
FROM k6-base

USER root
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies as root so package files can be written
RUN npm install
RUN cd playwright/restful-booker && npm install
RUN cd playwright/sauce-demo && npm install
RUN cd k6 && npm install

# Ensure app files are owned by the default k6 user
RUN chown -R k6:k6 /app
USER k6

# Set environment variables
ENV ENV=dev
ENV K6_OUT=influxdb=http://influxdb:8086/k6

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Default command
CMD ["run", "k6/load/load.js"]
