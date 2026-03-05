@echo off
chcp 65001 >nul
title XinSor 综合学习系统

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║        🚀 XinSor 学习系统启动器                            ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

:menu
echo 请选择启动模式:
echo.
echo  1. 综合学习系统 (YOLO + 硬件 + 项目 + 进度追踪)
echo  2. YOLO 自主学习
echo  3. 硬件学习系统
echo  4. 项目学习系统 (交互式)
echo  5. 查看学习进度
echo  6. 退出
echo.
set /p choice=请输入选项 (1-6): 

if "%choice%"=="1" goto full
if "%choice%"=="2" goto yolo
if "%choice%"=="3" goto hardware
if "%choice%"=="4" goto project
if "%choice%"=="5" goto status
if "%choice%"=="6" goto end
goto menu

:full
echo.
echo 🚀 启动综合学习系统...
npm run learn:full
goto menu

:yolo
echo.
echo 🧠 启动 YOLO 学习...
npm run learn:yolo
goto menu

:hardware
echo.
echo 🔧 启动硬件学习...
npm run learn:hardware
goto menu

:project
echo.
echo 🛠️  启动项目学习...
npm run project
goto menu

:status
echo.
echo 📊 学习进度:
npm run status
goto menu

:end
echo.
echo 👋 再见!
exit /b
