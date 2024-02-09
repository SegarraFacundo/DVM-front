import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron'
import path from 'node:path'
import { OperariosStore } from './api/operarios/operarios.store'
import { TiposAplicacionesStore } from './api/tipos-aplicaciones/tipos-aplicaciones.store'
import { asyncEmit } from './api/socket/socket'

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

function createWindow () {
  win = new BrowserWindow({
    minWidth: 1280,
    minHeight: 800,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    useContentSize: false,
    fullscreen: false,
    autoHideMenuBar: true,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false,
      devTools: true
    }
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date()).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)

const operariosStore = OperariosStore({ urlDataJson: path.join(process.env.DIST, '../data/operarios.json') })

const tiposAplicacionesStore = TiposAplicacionesStore({ urlDataJson: path.join(process.env.DIST, '../data/tipos-aplicaciones.json') })

ipcMain.handle('getOperariosAsync', async () => {
  return await operariosStore.all()
})

ipcMain.handle('addOperarioAsync', async (_: IpcMainInvokeEvent, name: string) => {
  return await operariosStore.add({ name })
})

ipcMain.handle('removeOperarioAsync', async (_: IpcMainInvokeEvent, id: number) => {
  return await operariosStore.remove(id)
})

ipcMain.handle('getTiposAplicacionesAsync', async () => {
  return await tiposAplicacionesStore.all()
})

ipcMain.handle('getDatosMeteorologicosAsync', async () => {
  return await asyncEmit('datosMeteorologicos')
})
