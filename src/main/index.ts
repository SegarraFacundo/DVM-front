import { app, shell, BrowserWindow, ipcMain, IpcMainInvokeEvent, nativeTheme } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { OperariosStore } from './api/operarios/operarios.store'
import {
  ITipoAplicacion,
  TiposAplicacionesStore
} from './api/tipos-aplicaciones/tipos-aplicaciones.store'
import { ItemsMenuStore } from './api/menu/items-menu.store'
import { ItemsInfoStore } from './api/info/items-info.store'
import { ILote, LotesStore } from './api/lotes/lotes.store'
import * as shutdown from 'electron-shutdown-command'
import './api/socket/socket'
import { Nodo, NodosStore, UbicacionAspersorType } from './api/nodos/nodos.store'
import { Configuraciones } from './api/configuraciones/configuraciones'
import { UnidadesStore } from './api/unidades/unidades.store'
import { ConfiguracionLogger } from './logs/configuracion-logger'
import log from 'electron-log/main'
import {
  ConfiguracionesAvanzadas,
  ConfiguracionesAvanzadasStore
} from './api/configuraciones/configuraciones-avanzadas.store'
import { execFile } from 'child_process'

log.initialize()
ConfiguracionLogger()

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
      sandbox: false,
      webSecurity: false
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

  log.info('Comenzo la aplicacion...')
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    log.info('Aplicacion cerrada...')
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

const operariosStore = OperariosStore()

ipcMain.handle('getOperariosAsync', async () => {
  const operarios = await operariosStore.all()
  return operarios
})

ipcMain.handle('addOperarioAsync', async (_: IpcMainInvokeEvent, name: string) => {
  const nuevoOperario = await operariosStore.add({ name })

  return nuevoOperario
})

ipcMain.handle('removeOperarioAsync', async (_: IpcMainInvokeEvent, id: number) => {
  const operarioEliminado = await operariosStore.remove(id)

  return operarioEliminado
})

const lotesStore = LotesStore()

ipcMain.handle('getLotesAsync', async () => {
  const lotes = await lotesStore.all()
  return lotes
})

ipcMain.handle('addLoteAsync', async (_: IpcMainInvokeEvent, lote: ILote) => {
  const nuevoLote = await lotesStore.add(lote)

  return nuevoLote
})

ipcMain.handle('removeLoteAsync', async (_: IpcMainInvokeEvent, id: number) => {
  const loteEliminado = await lotesStore.remove(id)

  return loteEliminado
})

const tiposAplicacionesStore = TiposAplicacionesStore()

ipcMain.handle('getTiposAplicacionesAsync', async () => {
  const tiposAplicaciones = await tiposAplicacionesStore.all()

  return tiposAplicaciones
})

ipcMain.handle(
  'addTipoAplicacionAsync',
  async (_: IpcMainInvokeEvent, tipoAplicacion: ITipoAplicacion) => {
    const res = await tiposAplicacionesStore.add(tipoAplicacion)
    return res
  }
)

ipcMain.handle('removeTipoAplicacionAsync', async (_: IpcMainInvokeEvent, id: number) => {
  const tipoAplicacionEliminado = await tiposAplicacionesStore.remove(id)
  return tipoAplicacionEliminado
})

const itemsMenuStore = ItemsMenuStore()

ipcMain.handle('getItemsMenuAsync', async () => {
  const items = await itemsMenuStore.all()

  return items
})

const itemsInfoStore = ItemsInfoStore()

ipcMain.handle('getItemsInfoAsync', async () => {
  const items = await itemsInfoStore.all()
  return items
})

const nodosStore = NodosStore()

ipcMain.handle('getNodosAsync', async () => {
  const nodos = await nodosStore.all()
  return nodos
})

ipcMain.handle('cambiarIdsNodosAsync', async (_: IpcMainInvokeEvent, nodos: Nodo[]) => {
  const nodoCambiado = await nodosStore.cambiarIdsNodosAsync(nodos)
  return nodoCambiado
})

ipcMain.handle('cambiarHabilitacionNodo', async (_: IpcMainInvokeEvent, idNodo: number) => {
  const nodoCambiado = await nodosStore.cambiarHabilitacionNodo(idNodo)
  return nodoCambiado
})

ipcMain.handle(
  'cambiarHabilitacionAspersor',
  async (_: IpcMainInvokeEvent, idNodo: number, idAspersor: number, deshabilitado: boolean) => {
    const nodoConElAspersorCambiado = await nodosStore.cambiarHabilitacionAspersor(
      idNodo,
      idAspersor,
      deshabilitado
    )
    return nodoConElAspersorCambiado
  }
)

ipcMain.handle(
  'cambiarUbicacionAspersor',
  async (
    _: IpcMainInvokeEvent,
    idNodo: number,
    idAspersor: number,
    ubicacion: UbicacionAspersorType
  ) => {
    const nodoConElAspersorCambiado = await nodosStore.cambiarUbicacionAspersor(
      idNodo,
      idAspersor,
      ubicacion
    )
    return nodoConElAspersorCambiado
  }
)

ipcMain.handle('apagarDispositivo', () => {
  log.warn('Apagando dispositivo')
  shutdown.shutdown()
})

ipcMain.handle('isThemeModeDark', () => {
  return nativeTheme.shouldUseDarkColors
})

ipcMain.handle('changeModeTheme', () => {
  nativeTheme.themeSource = nativeTheme.shouldUseDarkColors ? 'light' : 'dark'
})

const configuraciones = Configuraciones()

ipcMain.handle('setBrillo', async (_: IpcMainInvokeEvent, porcentaje: number) => {
  return await configuraciones.setBrillo(porcentaje)
})

ipcMain.handle('getBrilloActual', async () => {
  const brilloActual = await configuraciones.getBrilloActual()
  return brilloActual
})

const unidadesStore = UnidadesStore()

ipcMain.handle('getUnidadesAsync', async () => {
  const unidades = await unidadesStore.all()
  return unidades
})

ipcMain.handle(
  'cambiarUnidadVelocidad',
  async (_: IpcMainInvokeEvent, id: 1 | 2): Promise<boolean> => {
    return await unidadesStore.cambiarUnidadVelocidad(id)
  }
)

ipcMain.handle(
  'cambiarUnidadTemperatura',
  async (_: IpcMainInvokeEvent, id: 1 | 2): Promise<boolean> => {
    return await unidadesStore.cambiarUnidadTemperatura(id)
  }
)

const configuracionesAvanzadasStore = ConfiguracionesAvanzadasStore()

ipcMain.handle('getConfiguracionesAvanzadasAsync', async () => {
  const configuracionesAvanzadas = await configuracionesAvanzadasStore.get()
  return configuracionesAvanzadas
})

ipcMain.handle(
  'editConfiguracionesAvanzadasAsync',
  async (_: IpcMainInvokeEvent, value: ConfiguracionesAvanzadas) => {
    const configuracionesAvanzadasEdit = await configuracionesAvanzadasStore.edit(value)
    return configuracionesAvanzadasEdit
  }
)

ipcMain.handle('updateVersion', (): Promise<boolean> => {
  const batchFilePath = '/root/update.sh'

  return new Promise((resolve) => {
    execFile(batchFilePath, ['latest', 'latest'], (error, stdout) => {
      if (error) {
        console.error(`Error executing batch file: ${error}`)
        return resolve(false)
      }
      console.log(`Batch file output: ${stdout}`)
      resolve(true)
    })
  })
})

ipcMain.handle('getVersionApp', (): string => {
  return app.getVersion()
})
