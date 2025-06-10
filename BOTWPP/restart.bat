@echo off
echo Reiniciando WhatsApp Bot...
echo.

:: Remove a sessão antiga (caso queira reconectar com outro WhatsApp)
rmdir /s /q .wwebjs_auth

:: Reinicia o bot
call pm2 restart whatsapp-bot

echo.
echo Bot reiniciado! Para ver o QR Code, digite: pm2 logs whatsapp-bot
pause 