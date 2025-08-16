# Router Development Environment

A Python-based local development server for router admin interface development.

Device Link: https://www.cofeonline.com/products/cf-707-cf-707-wf?srsltid=AfmBOoqgzb5vhaqfLbIgtm8sxDvXtn2TGjj0C6jU9Bk0FdSSY-Ldyx70

## Directory Structure

```
📁 Project Root
├── 📁 code/              # Modified router source files (HTML, CSS, JS)
├── 📁 extracted/         # Original router sources from Chrome DevTools
├── 📁 sources/           # Source ZIP archives
├── 🐍 server.py          # Python development server with proxy
├── ⚡ start-server.bat   # Windows startup script
├── 📄 requirements.txt   # Documentation (no dependencies needed)
└── 📖 README.md          # This file
```

## Quick Start

### Option 1: Run Server Directly

```bash
python server.py
```

### Option 2: Use Batch File (Windows)

```bash
start-server.bat
```

### Option 3: Browser Access

Open http://localhost:8080 in your browser

## How It Works

### Architecture

```
Browser → Python Server → Router Device
         ↓              ↓
    Modified Code   Real API Data
```

1. **Static Files**: Served from `./code` directory (your modified code)
2. **API Calls**: Proxied to actual router at `192.168.150.1`
3. **Authentication**: Handled through router's session system
4. **Real Data**: All SMS, settings, and status from actual hardware

### Features

✅ **Pure Python**: No external dependencies  
✅ **Proxy Support**: Forwards API calls to router  
✅ **Authentication**: Handles router login and sessions  
✅ **Live Development**: Edit code and refresh browser  
✅ **Real Data**: Works with actual router hardware  
✅ **Debug Logging**: Shows API requests and responses

## Router Connection

### Prerequisites

- Router must be accessible at `192.168.150.1`
- Know router admin password (default: `admin`)
- Network connection to router

### Authentication

The server will attempt auto-login on startup. If it fails:

1. Access http://localhost:8080
2. Login manually with router credentials
3. Server will maintain session for API calls

## Development Workflow

### 1. Make Code Changes

Edit files in `./code` directory:

- `js/sms/smslist.js` - SMS functionality
- `js/service.js` - API calls
- `theme/app.css` - Styling
- `tmpl/*.html` - Templates

### 2. Test Changes

1. Save your changes
2. Refresh browser at http://localhost:8080
3. Changes are immediately visible
4. API calls use real router data

### 3. Debug Issues

- Check server console for API logs
- Browser dev tools for frontend debugging
- Real router responses for data validation

## Key Files for SMS Development

### SMS Functionality

- `code/js/sms/smslist.js` - Main SMS interface logic
- `code/js/service.js` - SMS API calls (`getSmsCapability`, `sendSMS`)
- `code/tmpl/sms.html` - SMS page template

### Configuration

- `code/js/config/config.js` - Router settings
- `code/i18n/Messages_en.properties` - Text strings

### Bug Fixes Applied

- SMS capacity check before sending
- Infinite loading dialog fix
- Enhanced error handling
- Graceful capacity limit handling

## Server Configuration

### Change Router IP

Edit `server.py`:

```python
ROUTER_IP = "your.router.ip.here"
```

### Change Server Port

Edit `server.py`:

```python
PORT = 8080  # Change to desired port
```

### Enable Debug Logging

The server automatically logs:

- 🌐 API requests to router
- 📁 Static file requests
- 📱 SMS capacity responses
- 🔐 Authentication status

## Troubleshooting

### "Router unreachable"

- Check router IP address
- Verify network connection
- Ensure router web interface is enabled

### "Authentication failed"

- Verify router admin password
- Check if router requires PIN/PUK unlock
- Try manual login through browser

### "Code changes not visible"

- Hard refresh browser (Ctrl+F5)
- Check file paths in `./code` directory
- Verify server is serving from correct directory

## Production Deployment

⚠️ **This is for development only!**

For production deployment:

1. Apply changes to actual router firmware
2. Use router's built-in web server
3. Follow manufacturer's update procedures

## SMS Capacity Bug Fix

The development environment includes fixes for:

- Infinite loading when SMS storage full
- Proper capacity checking before sending
- User-friendly error messages
- Graceful handling of 100-message limit

Test the fix by:

1. Filling SMS storage to capacity (100 messages)
2. Attempting to send new SMS
3. Verify error message instead of infinite loading
