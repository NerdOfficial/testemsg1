@echo off
echo Instalando WhatsApp Bot...
echo.

:: Verifica se o Node.js está instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js nao encontrado. Baixando e instalando...
    curl -o node-installer.msi https://nodejs.org/dist/v18.17.0/node-v18.17.0-x64.msi
    start /wait node-installer.msi /quiet
    del node-installer.msi
)

:: Instala o PM2 globalmente
echo Instalando PM2...
call npm install -g pm2@latest

:: Instala as dependências do projeto
echo Instalando dependencias do projeto...
call npm install

:: Configura o PM2 para iniciar com o Windows
echo Configurando PM2 para iniciar automaticamente...
call pm2 install pm2-windows-startup
call pm2 start ecosystem.config.js
call pm2 save

echo.
echo Instalacao concluida!
echo Para ver o QR Code, digite: pm2 logs whatsapp-bot
echo Para ver o status do bot, digite: pm2 status
pause 