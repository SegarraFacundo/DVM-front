import { app, shell, BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { OperariosStore } from './api/operarios/operarios.store'
import { TiposAplicacionesStore } from './api/tipos-aplicaciones/tipos-aplicaciones.store'
import { datosMeteorologicosEmitAsync } from './api/socket/socket'
import { datosTestingAsync } from './api/socket/socket'
import { ItemsMenuStore } from './api/menu/items-menu.store'
import { ItemsInfoStore } from './api/info/items-info.store'
import { LotesStore } from './api/lotes/lotes.store'
import { NodosStore } from './api/nodos/nodos.store'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    frame: false,
    fullscreen: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

const operariosStore = OperariosStore({
  urlDataJson: 'operarios.json'
})

ipcMain.handle('getOperariosAsync', async () => {
  return await operariosStore.all()
})

ipcMain.handle('addOperarioAsync', async (_: IpcMainInvokeEvent, name: string) => {
  return await operariosStore.add({ name })
})

ipcMain.handle('removeOperarioAsync', async (_: IpcMainInvokeEvent, id: number) => {
  return await operariosStore.remove(id)
})

const lotesStore = LotesStore({
  urlDataJson: 'lotes.json'
})

ipcMain.handle('getLotesAsync', async () => {
  return await lotesStore.all()
})

ipcMain.handle('addLoteAsync', async (_: IpcMainInvokeEvent, name: string) => {
  return await lotesStore.add({ name })
})

ipcMain.handle('removeLoteAsync', async (_: IpcMainInvokeEvent, id: number) => {
  return await lotesStore.remove(id)
})

const tiposAplicacionesStore = TiposAplicacionesStore({
  urlDataJson: 'tipos-aplicaciones.json'
})

ipcMain.handle('getTiposAplicacionesAsync', async () => {
  return await tiposAplicacionesStore.all()
})

const itemsMenuStore = ItemsMenuStore({
  urlDataJson: 'items-menu.json'
})

ipcMain.handle('getItemsMenuAsync', async () => {
  return await itemsMenuStore.all()
})

const itemsInfoStore = ItemsInfoStore({
  urlDataJson: 'items-info.json'
})

ipcMain.handle('getItemsInfoAsync', async () => {
  return await itemsInfoStore.all()
})

const nodosStore = NodosStore({
  urlDataJson: 'nodos.json'
})

ipcMain.handle('getNodosAsync', async () => {
  return await nodosStore.all()
})


ipcMain.handle('getDatosMeteorologicosAsync', async () => {
  return await datosMeteorologicosEmitAsync()
})

ipcMain.handle('initTestingAsync', async () => {
  return await datosTestingAsync()
})