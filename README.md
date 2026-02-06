# ⚠️! USE WITH CAUTION !⚠️ #

Vibed with Claude Code 🤖

## Russian Roulette Discord Bot

A Discord bot that lets you play Russian Roulette with server members. Target someone with `!rr @user` and there's a 1/6 chance they get banned from the server.

## Setup

### 1. Create a Discord Bot

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" section and click "Add Bot"
4. Under "Privileged Gateway Intents", enable:
   - **Server Members Intent**
   - **Message Content Intent**
5. Copy the bot token (you'll need this later)

### 2. Invite the Bot to Your Server

1. Go to the "OAuth2" → "URL Generator" section
2. Select these scopes:
   - `bot`
3. Select these bot permissions:
   - `Ban Members`
   - `Send Messages`
   - `Read Message History`
4. Copy the generated URL and open it to invite the bot

### 3. Configure and Run

```bash
# Install dependencies
npm install

# Copy the example env file and add your token
cp .env.example .env
# Edit .env and add your DISCORD_TOKEN

# Build and run
npm run dev
```

## Usage

```
!rr @username
```

- 1/6 chance (16.67%) the target gets banned
- 5/6 chance they survive

## Requirements

- Node.js 18+
- A Discord bot token with the required permissions

## Warning

Use responsibly! This bot actually bans people. Make sure your server members know the risks before playing.
