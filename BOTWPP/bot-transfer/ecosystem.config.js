module.exports = {
  apps: [{
    name: 'whatsapp-bot',
    script: 'index.js',
    watch: true,
    max_memory_restart: '1G',
    exec_mode: 'fork',
    autorestart: true,
    node_args: [],
    env: {
      NODE_ENV: 'production'
    }
  }]
}; 