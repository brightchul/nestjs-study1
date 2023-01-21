export function getEnvPath() {
  switch (process.env.NODE_ENV) {
    case 'production':
      return 'envs/.production.env';
    case 'stage':
      return 'envs/.stage.env';
    default:
      return 'envs/.development.env';
  }
}
