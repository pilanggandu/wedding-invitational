module.exports = {
  apps: [
    {
      name: "wedding-backend",
      cwd: "./backend",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: 5022,
      },
      watch: false,
      autorestart: true,
      max_memory_restart: "500M",
    },
    {
      name: "wedding-frontend",
      cwd: "./frontend",
      script: "npm",
      args: "run start -- -p 3022 -H 0.0.0.0",
      env: {
        NODE_ENV: "production",
        PORT: 3022,
        BACKEND_PORT: 5022,
      },
      watch: false,
      autorestart: true,
      max_memory_restart: "1G",
    },
  ],
};
