module.exports = {
  apps: [
    {
      name: "fixartebcn",
      cwd: "/var/www/fixartebcn",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: "4008",
      },
    },
  ],
};
