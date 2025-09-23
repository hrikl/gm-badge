# Chess.com GM Badge Extension

A simple browser extension for customizing your Chess.com profile with a GM badge. Just for fun and personal customization.

## Features
- Adds GM badge next to your username
- Works on your profile page, game history, and live games
- Easy to install and use

## Installation

1. Download the **chess-gm-badge-extention** folder on your computer

2. **Edit the configuration** in `content.js`:
   - Open `content.js` in a text editor
   - Change the username values on lines 5-6:
   ```javascript
   // YOUR USERNAME - Change this to your actual Chess.com username
   const YOUR_USERNAME = 'your-chess-username';
   
3. Go to **chrome://extensions/**

4. Enable **Developer mode** (toggle in top-right)

5. Click **Load unpacked** and select the downloaded folder

**Note**
This extension only works locally on your browser and doesn't modify your actual Chess.com account.

## Screenshots

### Profile Page
![Profile with GM badge](screenshots/profile.png)

### Game History  
![Game history with GM badge](screenshots/game-history.png)

### Live Game
![Live game with GM badge](screenshots/live-game.png)



