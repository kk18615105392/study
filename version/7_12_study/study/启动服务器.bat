@echo off
chcp 65001 >nul
title 京通备考刷题宝典 - 本地服务器
cd /d "%~dp0"

echo.
echo  ========================================
echo    京通备考刷题宝典 - 正在启动服务器...
echo  ========================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [错误] 未找到 Node.js，请先安装: https://nodejs.org
  pause
  exit /b 1
)

echo  本机访问: http://localhost:3000
echo  手机访问: 请看下方显示的 IP 地址
echo.
echo  关闭此窗口 = 停止服务器
echo  ----------------------------------------
echo.

node server.js
pause
