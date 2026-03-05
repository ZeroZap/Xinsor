# XinSor Deployment Guide

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Discord Bot Token

## Installation

### 1. Clone the repository

```bash
git clone git@github.com:ZeroZap/Xinsor.git
cd Xinsor
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and add your Discord bot token:

```
DISCORD_TOKEN=your_bot_token_here
```

### 4. Get Discord Bot Token

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "Bot" section
4. Click "Reset Token" and copy your token
5. Enable "Message Content Intent"
6. Go to "OAuth2" → "URL Generator"
7. Select scopes: `bot`
8. Select permissions: `Send Messages`, `Embed Links`, `Read Message History`
9. Use the generated URL to invite the bot to your server

## Running

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

### Windows

```cmd
start.bat
```

### Linux/Mac

```bash
chmod +x start.sh
./start.sh
```

## PM2 (Optional)

For production deployment with auto-restart:

```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Available Commands

| Command | Description |
|---------|-------------|
| `!help` | Show help message |
| `!agents` | List all agents |
| `!skills` | List all skills |
| `!discuss <topic>` | Start multi-agent discussion |
| `!xinsor` | Sensor ecosystem blueprint |
| `!sensor` | Sensor information |
| `!data` | Data collection pipeline |
| `!sim` | Simulation framework |
| `!protocol` | Protocol information |
| `!hal` | HAL code generation |

## Troubleshooting

### Bot not responding

1. Check if bot is online
2. Verify `DISCORD_TOKEN` is correct
3. Ensure "Message Content Intent" is enabled
4. Check bot permissions in your server

### Installation errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## Support

- GitHub: https://github.com/ZeroZap/Xinsor
- ZeroZap Discord: https://github.com/ZeroZap/discord
