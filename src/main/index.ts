import { app, shell, BrowserWindow, ipcMain, IpcMainInvokeEvent, nativeTheme } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { OperariosStore } from './api/operarios/operarios.store'
import { TiposAplicacionesStore } from './api/tipos-aplicaciones/tipos-aplicaciones.store'
import { ItemsMenuStore } from './api/menu/items-menu.store'
import { ItemsInfoStore } from './api/info/items-info.store'
import { LotesStore } from './api/lotes/lotes.store'
import * as shutdown from 'electron-shutdown-command'
import './api/socket/socket'
import { NodosStore } from './api/nodos/nodos.store'
import { Configuraciones } from './api/configuraciones/configuraciones'
import { UnidadesStore } from './api/unidades/unidades.store'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    frame: true,
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

const nodosStore = NodosStore()
ipcMain.handle('cambiarHabilitacionNodo', async (_: IpcMainInvokeEvent, idNodo: number) => {
  return await nodosStore.cambiarHabilitacionNodo(idNodo)
})

ipcMain.handle('cambiarHabilitacionAspersor', async (_: IpcMainInvokeEvent, idNodo: number, idAspersor: number, deshabilitado: boolean) => {
  return await nodosStore.cambiarHabilitacionAspersor(idNodo, idAspersor, deshabilitado)
})

ipcMain.handle('apagarDispositivo', () => {
  shutdown.shutdown()
})

ipcMain.handle('isThemeModeDark', () => {
  return nativeTheme.shouldUseDarkColors
})

const configuraciones = Configuraciones()

ipcMain.handle('setBrillo', async (_: IpcMainInvokeEvent, porcentaje: number) => {
  return await configuraciones.setBrillo(porcentaje)
})

ipcMain.handle('getBrilloActual', async () => {
  return await configuraciones.getBrilloActual()
})

const unidadesStore = UnidadesStore()

ipcMain.handle('getUnidadesAsync', async () => {
  return await unidadesStore.all()
})

ipcMain.handle('cambiarUnidadVelocidad', async (_: IpcMainInvokeEvent, id: 1 | 2) => {
  return await unidadesStore.cambiarUnidadVelocidad(id)
})

ipcMain.handle('cambiarUnidadTemperatura', async (_: IpcMainInvokeEvent, id: 1 | 2) => {
  return await unidadesStore.cambiarUnidadTemperatura(id)
})