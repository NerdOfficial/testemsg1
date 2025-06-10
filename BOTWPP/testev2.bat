@echo off
color 0B
mode con: cols=100 lines=35

title Bot WhatsApp SMS v.0.2 - TESTE V2

cd /d "%~dp0"
cd BOTWPP

echo ================================
echo INICIANDO O BOT TESTE V2...
echo ================================

npm install --silent
node index.js

pause 