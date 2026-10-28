@echo off
chcp 65001 >nul
title DeepTutor - Stop
echo Stopping DeepTutor backend/frontend...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8001,3782 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"
echo Done.
timeout /t 2 >nul
