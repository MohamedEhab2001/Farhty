module.exports = {
  apps: [
    {
      name: 'farhty-api',
      script: './apps/api/dist/index.js',
      cwd: '/var/www/farhty',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: '/var/log/farhty/api-error.log',
      out_file: '/var/log/farhty/api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
}
