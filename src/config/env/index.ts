export function getEnvPath() {
  switch (process.env.NODE_ENV) {
    case 'production':
      return `${__dirname}/.production.env`;
    case 'stage':
      return `${__dirname}/.stage.env`;
    default:
      return `${__dirname}/.development.env`;
  }
}
