export default {
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  APP_ENV: process.env.ENV ?? '',
  LOG_LEVEL: process.env.LOG_LEVEL ?? '',
  EXTERNAL_API: process.env.EXTERNAL_API ?? '',
  ADMIN_USER_NAME: process.env.ADMIN_USER_NAME ?? '',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? '',
}
