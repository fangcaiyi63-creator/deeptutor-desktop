@echo off
chcp 65001 >nul
cd /d "%~dp0"
title DeepTutor
echo ================================================
echo   DeepTutor - starting backend + frontend...
echo   Web:  http://localhost:3782
echo   Stop: close this window (Ctrl+C also works)
echo ================================================
deeptutor start
pause
