@echo off
REM XinSor Bot - Windows Start Script
echo Starting XinSor Agents...

if not exist node_modules (
    echo Installing dependencies...
    call npm install
)

if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env
    echo Please edit .env and add your DISCORD_TOKEN
    pause
    exit /b 1
)

node src/index.js
pause
