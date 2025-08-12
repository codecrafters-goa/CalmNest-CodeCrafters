# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/calmnest

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# Email Configuration (for future features like password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Upload Configuration
MAX_FILE_SIZE=50MB
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5

# Admin Configuration
ADMIN_EMAIL=admin@calmnest.com
ADMIN_PASSWORD=admin123

# External APIs (for future integrations)
YOUTUBE_API_KEY=your-youtube-api-key
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# Security
BCRYPT_SALT_ROUNDS=12
JWT_EXPIRE_TIME=7d
REFRESH_TOKEN_EXPIRE_TIME=30d

# Analytics & Monitoring
ANALYTICS_ENABLED=true
ERROR_TRACKING_DSN=your-sentry-dsn-here