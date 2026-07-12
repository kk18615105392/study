@echo off
chcp 65001 >nul
echo 正在开放 3000 端口（需要管理员权限）...

net session >nul 2>&1
if errorlevel 1 (
  echo 请右键此文件，选择「以管理员身份运行」
  pause
  exit /b 1
)

netsh advfirewall firewall delete rule name="京通刷题服务器-3000" >nul 2>&1
netsh advfirewall firewall add rule name="京通刷题服务器-3000" dir=in action=allow protocol=TCP localport=3000

echo.
echo  防火墙已开放 3000 端口！
echo  手机/其他设备现在可以访问这台电脑上的服务器了。
echo.
pause
