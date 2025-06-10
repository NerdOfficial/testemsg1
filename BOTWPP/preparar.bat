@echo off
echo Preparando arquivos para transferencia...
echo.

:: Cria pasta temporária
mkdir bot-transfer

:: Copia arquivos necessários
copy index.js bot-transfer\
copy package.json bot-transfer\
copy ecosystem.config.js bot-transfer\
copy install.bat bot-transfer\
copy restart.bat bot-transfer\

:: Cria arquivo README com instruções
echo # Instrucoes de Instalacao > bot-transfer\LEIA-ME.txt
echo. >> bot-transfer\LEIA-ME.txt
echo 1. Crie uma pasta C:\WhatsAppBot >> bot-transfer\LEIA-ME.txt
echo 2. Copie todos os arquivos desta pasta para C:\WhatsAppBot >> bot-transfer\LEIA-ME.txt
echo 3. Abra o Prompt de Comando como Administrador >> bot-transfer\LEIA-ME.txt
echo 4. Digite: cd C:\WhatsAppBot >> bot-transfer\LEIA-ME.txt
echo 5. Execute: install.bat >> bot-transfer\LEIA-ME.txt
echo 6. Aguarde a instalacao completar >> bot-transfer\LEIA-ME.txt
echo 7. Digite: pm2 logs whatsapp-bot >> bot-transfer\LEIA-ME.txt
echo 8. Escaneie o QR Code com seu WhatsApp >> bot-transfer\LEIA-ME.txt

echo.
echo Arquivos preparados na pasta 'bot-transfer'
echo Agora voce pode copiar esta pasta para o servidor via AnyDesk
pause 