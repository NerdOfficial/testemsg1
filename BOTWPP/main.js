const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const qrcode = require('qrcode');

let mainWindow;
let botProcess = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    resizable: false,
    title: 'WhatsApp Bot - Interface Simples'
  });

  mainWindow.loadFile(path.join(__dirname, 'ui.html'));
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

// Funções para controle do bot
function startBot() {
  if (botProcess) return;
  botProcess = spawn('node', ['index.js'], { cwd: __dirname });
  mainWindow.webContents.send('status', 'Iniciando...');

  botProcess.stdout.on('data', data => {
    const str = data.toString();
    mainWindow.webContents.send('log', str);
    // Detecta QR Code no stdout
    const qrMatch = str.match(/(\s*[\u2580-\u259F\u25A0-\u25FF\u2588\u2592\u2593\u2591\u25A1\u25A0\u25A3\u25A2\u25A4\u25A5\u25A6\u25A7\u25A8\u25A9\u25AA\u25AB\u25AC\u25AD\u25AE\u25AF\u25B0\u25B1\u25B2\u25B3\u25B4\u25B5\u25B6\u25B7\u25B8\u25B9\u25BA\u25BB\u25BC\u25BD\u25BE\u25BF\u25C0\u25C1\u25C2\u25C3\u25C4\u25C5\u25C6\u25C7\u25C8\u25C9\u25CA\u25CB\u25CC\u25CD\u25CE\u25CF\u25D0\u25D1\u25D2\u25D3\u25D4\u25D5\u25D6\u25D7\u25D8\u25D9\u25DA\u25DB\u25DC\u25DD\u25DE\u25DF\u25E0\u25E1\u25E2\u25E3\u25E4\u25E5\u25E6\u25E7\u25E8\u25E9\u25EA\u25EB\u25EC\u25ED\u25EE\u25EF\u25F0\u25F1\u25F2\u25F3\u25F4\u25F5\u25F6\u25F7\u25F8\u25F9\u25FA\u25FB\u25FC\u25FD\u25FE\u25FF]+\s*)+/);
    if (qrMatch) {
      // Não é possível converter diretamente, mas pode-se melhorar depois
      mainWindow.webContents.send('status', 'Escaneie o QR Code no terminal!');
    }
    if (str.includes('Bot está pronto')) {
      mainWindow.webContents.send('status', 'Conectado!');
    }
    if (str.includes('Bot desconectado')) {
      mainWindow.webContents.send('status', 'Desconectado!');
    }
  });
  botProcess.stderr.on('data', data => {
    mainWindow.webContents.send('log', '[ERRO] ' + data.toString());
  });
  botProcess.on('close', code => {
    mainWindow.webContents.send('status', 'Parado');
    botProcess = null;
  });
}

function stopBot() {
  if (botProcess) {
    botProcess.kill();
    botProcess = null;
    mainWindow.webContents.send('status', 'Parado');
  }
}

function restartBot() {
  stopBot();
  setTimeout(startBot, 1000);
}

ipcMain.on('bot-control', (event, action) => {
  if (action === 'start') startBot();
  if (action === 'stop') stopBot();
  if (action === 'restart') restartBot();
});

// Comunicação com o backend do bot (pode ser expandida depois)
// Exemplo: receber QR Code, status, logs, etc. 