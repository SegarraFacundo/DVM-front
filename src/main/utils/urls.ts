import { app } from "electron";
import path from "path";

export const APP_DATA_PATH: string =
process.platform === 'darwin'
  ? path.resolve(app.getPath('logs'), `../${app.name}`)
  : path.resolve(app.getPath('userData'), 'data')