@echo off
chcp 65001 >nul
set "STARTUP=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "LINK=%STARTUP%\京通刷题服务器.lnk"
set "TARGET=%~dp0启动服务器.bat"

powershell -NoProfile -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%LINK%'); $s.TargetPath = '%TARGET%'; $s.WorkingDirectory = '%~dp0'; $s.WindowStyle = 7; $s.Description = '京通备考刷题宝典本地服务器'; $s.Save()"

echo.
echo  已添加到开机自启动！
echo  位置: %LINK%
echo.
echo  下次开机会自动启动服务器（最小化窗口）。
echo  如需取消：删除上述快捷方式即可。
echo.
pause
