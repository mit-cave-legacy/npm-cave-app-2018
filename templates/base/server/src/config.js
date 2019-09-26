import path from 'path'

export const {
  NODE_ENV,
  PORT = 4000,
  RESOURCE_DIR = path.resolve(__dirname + '../../public')
} = process.env

export const isProduction = NODE_ENV === 'production'
