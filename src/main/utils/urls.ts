import { app } from 'electron'
import path from 'path'

export const APP_DATA_PATH: () => string = (): string => {
  switch (process.platform) {
    case 'darwin': {
      return path.join(process.env.HOME, 'Library', 'Application Support', `${app.name}`)
    }
    case 'win32': {
      return path.join(process.env.APPDATA, `${app.name}`)
    }
    case 'linux': {
      return path.join(process.env.HOME, `${app.name}`)
    }
    default: {
      console.log('Unsupported platform!')
      process.exit(1)
    }
  }
}
