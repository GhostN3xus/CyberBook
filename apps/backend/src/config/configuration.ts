export default () => ({
  port: parseInt(process.env.PORT ?? '4000', 10),
  databaseUrl: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/appsec',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? 'change-me-access',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'change-me-refresh',
    accessTtl: process.env.JWT_ACCESS_TTL ?? '15m',
    refreshTtl: process.env.JWT_REFRESH_TTL ?? '7d'
  },
  corsOrigin: process.env.CORS_ORIGIN ?? '*'
});
