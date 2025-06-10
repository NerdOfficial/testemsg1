@echo off
color 0B
mode con: cols=100 lines=35

title Bot WhatsApp SMS v.0.2 - pelo NERD

set "BOTPATH=C:\Users\Administrator\Desktop\BOTWPP"

:menu
cls
call :printDoubleLine
call :printCenter "   BEM-VINDO AO BOT WHATSAPP SMS v.0.2   "
call :printCenter "   Criado pelo N E R D   "
call :printDoubleLine
call :printCenter "Este bot permite enviar comandos de SMS pelo WhatsApp."
call :printCenter "Ideal para automacao de mensagens e notificacoes."
call :printDoubleLine
call :printCenter "COMANDOS DISPONIVEIS PARA WHATSAPP:"
call :printSingleLine
call :printCenter "!sms - Mostra esta lista de comandos"
call :printCenter "!sms1 [numero] - Prova de vida em andamento"
call :printCenter "!sms2 [numero] - l N S S : PARA NAO PERDER SEU BENEFlCl0 FINALIZE SUA PROVA DE VIDA."
call :printCenter "!sms2.1 [numero] - Finalize sua Prova de Vida para evitar o bloqueio"
call :printCenter "!sms2.2 [numero] - Não perca o acesso, faça a Prova de Vida e evite o bloqueio"
call :printCenter "!sms3 [numero] - Solicitacao de ressarcimento"
call :printCenter "!sms4 [numero] - Aguardando Confirmacao de Ressarcimento"
call :printCenter "!sms5 [numero] - Estorno de simulacao"
call :printCenter "!sms6 [numero] - Confirmacoes 1/3"
call :printCenter "!sms7 [numero] - Confirmacoes 2/3"
call :printCenter "!sms8 [numero] - Confirmacoes 3/3"
call :printCenter "!sms9 [numero] (mensagem) - Mensagem personalizada"
call :printCenter "Exemplo: !sms1 11999999999"
call :printCenter "Exemplo: !sms9 11999999999 (Ola, esta e uma mensagem personalizada!)"
call :printDoubleLine
echo.
call :printCenter " [1] Iniciar Bot   [2] Parar Bot   [3] Reiniciar Bot   [4] Sair "
call :printDoubleLine
echo.
set /p opcao="Digite apenas o numero da opcao desejada: "

if "%opcao%"=="1" (
    cls
    call :printDoubleLine
    call :printCenter " INICIANDO O BOT... "
    call :printDoubleLine
    if exist "%BOTPATH%" (
        cd /d "%BOTPATH%"
        npm install
        node index.js
    ) else (
        echo ERRO: A pasta BOTWPP nao foi encontrada em %BOTPATH%!
        echo Certifique-se de que a pasta existe e tente novamente.
    )
    pause
    goto menu
)
if "%opcao%"=="2" (
    cls
    call :printDoubleLine
    call :printCenter " PARANDO O BOT... "
    call :printDoubleLine
    taskkill /im node.exe /f >nul 2>&1
    echo Bot parado!
    pause
    goto menu
)
if "%opcao%"=="3" (
    cls
    call :printDoubleLine
    call :printCenter " REINICIANDO O BOT... "
    call :printDoubleLine
    taskkill /im node.exe /f >nul 2>&1
    if exist "%BOTPATH%" (
        cd /d "%BOTPATH%"
        npm install
        node index.js
    ) else (
        echo ERRO: A pasta BOTWPP nao foi encontrada em %BOTPATH%!
        echo Certifique-se de que a pasta existe e tente novamente.
    )
    pause
    goto menu
)
if "%opcao%"=="4" (
    exit
)
goto menu

REM Linha dupla
:printDoubleLine
setlocal EnableDelayedExpansion
set "line="
for /l %%i in (1,1,96) do set "line=!line!=="
echo =%line%=
endlocal
exit /b

REM Linha simples
:printSingleLine
setlocal EnableDelayedExpansion
set "line="
for /l %%i in (1,1,96) do set "line=!line!-"
echo -!line!-
endlocal
exit /b

REM Centralizar texto
:printCenter
setlocal EnableDelayedExpansion
set "str=%~1"
set "len=0"
for /l %%i in (12,-1,0) do (
    set /a "len|=1<<%%i"
    for %%j in (!len!) do if not "!str:~%%j,1!"=="" set /a len+=1
)
set /a pad=(96-len)/2
set "spaces="
for /l %%i in (1,1,!pad!) do set "spaces=!spaces! "
echo !spaces!!str!
endlocal
exit /b 