# WhatsApp SMS Bot

Bot de WhatsApp para envio de SMS usando a API Facilita Móvel.

## Instalação Rápida

1. Clone o repositório:
```bash
git clone [URL_DO_SEU_REPOSITORIO]
cd [NOME_DA_PASTA]
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o bot:
```bash
node index.js
```

4. Escaneie o QR Code que aparecer no terminal com seu WhatsApp

## Comandos Disponíveis

- `!sms` - Mostra a lista de comandos
- `!sms1 [número]` - Prova de vida em andamento
- `!sms2 [número]` - Evite o bloqueio
- `!sms3 [número]` - Solicitação de ressarcimento
- `!sms4 [número]` - Aguardando confirmação
- `!sms5 [número]` - Estorno de simulação
- `!sms6 [número]` - Confirmações 1/3
- `!sms7 [número]` - Confirmações 2/3
- `!sms8 [número]` - Confirmações 3/3

## Exemplo de Uso

```
!sms1 11999999999
```

## Observações

- O bot envia cada mensagem como SMS normal e Flash SMS
- Os números devem ter 10 ou 11 dígitos
- A sessão do WhatsApp fica salva na pasta `.wwebjs_auth`

## Arquivos do Projeto

- `index.js` - Código principal do bot
- `package.json` - Dependências do projeto
- `ecosystem.config.js` - Configuração do PM2 (opcional)
- `install.bat` - Script de instalação para Windows
- `restart.bat` - Script para reiniciar o bot 