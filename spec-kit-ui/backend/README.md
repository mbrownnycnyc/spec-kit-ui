# Subagent Git Manager Backend

A Node.js/Express backend service that manages the awesome-claude-code-subagents repository with automatic git operations.

## Features

- **Automatic Repository Management**: Initial clone and periodic git pulls
- **Smart Pulling**: Only pulls when new commits are detected (commit hash comparison)
- **24-hour Maximum Interval**: Enforces maximum 24 hours between pulls
- **RESTful API**: Clean API endpoints for frontend integration
- **Comprehensive Logging**: Structured logging with configurable levels
- **Error Handling**: Robust error recovery and retry mechanisms
- **Process Management**: Graceful shutdown and health monitoring

## Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Start the Server**:
   ```bash
   npm start
   ```

The server will start on port 3001 by default.

## API Endpoints

### Health Checks
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed health with repository status

### Subagent Management
- `GET /api/subagents` - Get all subagents
- `GET /api/subagents/status` - Repository and scheduler status
- `GET /api/subagents/info` - Repository metadata and statistics
- `POST /api/subagents/update` - Force immediate update
- `GET /api/subagents/search?q=query` - Search subagents

### Root
- `GET /` - API documentation and endpoints

## Configuration

Environment variables can be set in `.env`:

```bash
# Repository Configuration
REPO_URL=https://github.com/VoltAgent/awesome-claude-code-subagents.git
REPO_PATH=./external-subagents

# Server Configuration
SERVER_PORT=3001
NODE_ENV=development

# Scheduling
CHECK_INTERVAL=3600000  # 1 hour in ms
MAX_DAILY_INTERVAL=86400000  # 24 hours in ms

# Logging
LOG_LEVEL=info

# Security
API_KEY=your-secret-api-key

# Frontend Configuration
CORS_ORIGIN=http://localhost:5173
```

## Architecture

### Core Components

1. **GitManager** (`git-manager.js`)
   - Repository cloning and pulling
   - Commit hash tracking and comparison
   - Repository validation and recovery

2. **Scheduler** (`scheduler.js`)
   - Periodic update checks
   - 24-hour interval enforcement
   - Update statistics and monitoring

3. **Express Server** (`server.js`)
   - RESTful API endpoints
   - Middleware for logging and error handling
   - Process management and graceful shutdown

4. **Logger** (`logger.js`)
   - Structured logging to console and file
   - Configurable log levels
   - Operation tracking and metrics

### Repository Management Flow

1. **Initial Startup**: Checks if repository exists
2. **Clone if Missing**: Performs initial git clone
3. **Scheduled Checks**: Runs every hour by default
4. **Smart Updates**: Only pulls if commits differ
5. **Error Recovery**: Automatic reclone on corruption

## Frontend Integration

The frontend uses the `useBackendSubagent` hook to communicate with this backend:

```javascript
import { useBackendSubagent } from './hooks/useBackendSubagent'

const {
  subagents,
  loading,
  error,
  loadSubagents,
  searchSubagents,
  forceRefresh
} = useBackendSubagent()
```

## Monitoring and Logs

### Log Files
- Location: `git-manager.log` (in backend directory)
- Format: JSON structured logging
- Rotation: Manual cleanup recommended

### Health Monitoring
- Memory usage tracking
- Uptime monitoring
- Repository accessibility checks
- Error rate tracking

## Deployment

### Development
```bash
npm run dev  # Same as start, uses .env
```

### Production
```bash
NODE_ENV=production npm start
```

### Process Management

#### PM2 (recommended)
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 logs
```

#### systemd (Linux)
Create `/etc/systemd/system/subagent-git-manager.service`:

```ini
[Unit]
Description=Subagent Git Manager
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/backend
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable subagent-git-manager
sudo systemctl start subagent-git-manager
```

## Security Considerations

- **API Keys**: Configure `API_KEY` for admin operations
- **CORS**: Set appropriate `CORS_ORIGIN` for production
- **Rate Limiting**: Built-in rate limiting prevents abuse
- **File Access**: Git operations restricted to configured directory

## Troubleshooting

### Common Issues

1. **Backend Not Running**:
   ```bash
   # Check if port 3001 is available
   netstat -an | grep 3001

   # Check logs
   tail -f git-manager.log
   ```

2. **Repository Not Cloning**:
   - Check internet connection
   - Verify repository URL is accessible
   - Check disk space availability

3. **Frontend Cannot Connect**:
   - Verify CORS_ORIGIN setting
   - Check backend is running on correct port
   - Review browser console for CORS errors

4. **High Memory Usage**:
   - Monitor with `GET /api/health/detailed`
   - Consider reducing `CHECK_INTERVAL`
   - Implement log rotation

### Manual Operations

#### Force Repository Reclone
```bash
curl -X POST http://localhost:3001/api/subagents/update
```

#### Check Repository Status
```bash
curl http://localhost:3001/api/subagents/status
```

#### Detailed Health Check
```bash
curl http://localhost:3001/api/health/detailed
```

## Development

### Project Structure
```
backend/
├── server.js           # Main Express server
├── config.js           # Configuration management
├── logger.js           # Logging utilities
├── git-manager.js      # Git operations
├── scheduler.js        # Update scheduling
├── routes/             # API routes
│   ├── health.js       # Health check endpoints
│   └── subagents.js    # Subagent endpoints
├── .env.example        # Environment template
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

### Adding New Endpoints
1. Create route file in `routes/`
2. Import and mount in `server.js`
3. Add error handling and logging
4. Update API documentation

### Testing
```bash
# Test basic connectivity
curl http://localhost:3001/api/health

# Test subagent retrieval
curl http://localhost:3001/api/subagents

# Test search functionality
curl "http://localhost:3001/api/subagents/search?q=python"
```

## License

This backend service is part of the Spec-Kit UI project.