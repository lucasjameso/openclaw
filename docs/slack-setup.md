# Slack App Setup for OpenClaw

## Step 1: Create the Slack App

1. Go to https://api.slack.com/apps
2. Click "Create New App" > "From scratch"
3. App name: `OpenClaw`
4. Workspace: `Forge Alerts`
5. Click "Create App"

## Step 2: Enable Socket Mode

1. In the left sidebar, click "Socket Mode"
2. Toggle "Enable Socket Mode" to ON
3. When prompted, create an App-Level Token:
   - Token name: `openclaw-socket`
   - Scope: `connections:write`
   - Click "Generate"
4. Copy the token (starts with `xapp-`) -- this is your `SLACK_APP_TOKEN`

## Step 3: Configure Bot Token Scopes

1. In the left sidebar, click "OAuth & Permissions"
2. Scroll to "Scopes" > "Bot Token Scopes"
3. Add these scopes:
   - `app_mentions:read`
   - `assistant:write`
   - `channels:history`
   - `channels:read`
   - `chat:write`
   - `chat:write.customize`
   - `commands`
   - `emoji:read`
   - `files:read`
   - `files:write`
   - `groups:history`
   - `im:history`
   - `im:read`
   - `im:write`
   - `mpim:history`
   - `mpim:read`
   - `mpim:write`
   - `pins:read`
   - `pins:write`
   - `reactions:read`
   - `reactions:write`
   - `users:read`

## Step 4: Subscribe to Bot Events

1. In the left sidebar, click "Event Subscriptions"
2. Toggle "Enable Events" to ON
3. Under "Subscribe to bot events", add:
   - `app_mention`
   - `message.channels`
   - `message.groups`
   - `message.im`
   - `message.mpim`
   - `reaction_added`
   - `reaction_removed`
   - `member_joined_channel`
   - `member_left_channel`
   - `channel_rename`
   - `pin_added`
   - `pin_removed`
4. Click "Save Changes"

## Step 5: Enable App Home

1. In the left sidebar, click "App Home"
2. Under "Show Tabs", enable "Messages Tab"
3. Check "Allow users to send Slash commands and messages from the messages tab"

## Step 6: Install to Workspace

1. In the left sidebar, click "Install App"
2. Click "Install to Workspace"
3. Review permissions and click "Allow"
4. Copy the "Bot User OAuth Token" (starts with `xoxb-`) -- this is your `SLACK_BOT_TOKEN`

## Step 7: Update OpenClaw .env

Edit `~/Forge/openclaw/.env` and replace the placeholder values:

```
SLACK_BOT_TOKEN=xoxb-your-actual-token-here
SLACK_APP_TOKEN=xapp-your-actual-token-here
```

## Step 8: Invite Bot to Channels

In Slack, invite OpenClaw to each channel:

```
/invite @OpenClaw
```

Do this in: #forge-alerts, #content-ready, #book-launch, #claude-code, #n8n-logs

## Step 9: Restart OpenClaw

```bash
cd ~/Forge/openclaw
docker compose restart
```

## Step 10: Verify

Send a message mentioning @OpenClaw in #claude-code. It should respond.

If not, check the logs:

```bash
docker compose logs -f
```
