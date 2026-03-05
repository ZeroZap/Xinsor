@echo off
REM XinSor Bot - Windows Stop Script
echo Stopping XinSor Agents...
taskkill /F /IM node.exe 2>nul
echo XinSor stopped.
