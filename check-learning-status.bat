@echo off
chcp 65001 >nul
echo ╔═══════════════════════════════════════════════════════════╗
echo ║        📊 XinSor 学习状态查看器                            ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

echo ┌───────────────────────────────────────────────────────────┐
echo │                     🧠 YOLO 学习状态                      │
echo └───────────────────────────────────────────────────────────┘
if exist "docs\yolo_progress.json" (
    powershell -Command "$json = Get-Content 'docs\yolo_progress.json' | ConvertFrom-Json; Write-Host '  代理：' $json.agent; Write-Host '  已完成会话：' $json.sessionsCompleted; Write-Host '  学习进度：' $json.progress'%'; Write-Host '  最后保存：' $json.lastSaved"
) else (
    echo   暂无进度数据
)
echo.

echo ┌───────────────────────────────────────────────────────────┐
echo │                    📚 硬件学习状态                        │
echo └───────────────────────────────────────────────────────────┘
if exist "docs\hardware_progress.json" (
    powershell -Command "$json = Get-Content 'docs\hardware_progress.json' | ConvertFrom-Json; Write-Host '  代理：' $json.agent; Write-Host '  已完成会话：' $json.sessionsCompleted; Write-Host '  学习进度：' $json.progress'%'; Write-Host '  最后保存：' $json.savedAt"
) else (
    echo   暂无进度数据
)
echo.

echo ┌───────────────────────────────────────────────────────────┐
echo │                      📄 学习日志                          │
echo └───────────────────────────────────────────────────────────┘
echo   YOLO 日志：logs\yolo_learning.log
echo   硬件日志：logs\hardware_learning.log
echo.

pause
