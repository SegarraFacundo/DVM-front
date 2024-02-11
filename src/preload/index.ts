import { electronAPI } from '@electron-toolkit/preload'
import {
  contextBridge,
  createIpcRenderer,
  GetApiType
} from 'electron-typescript-ipc'
import { Operario } from '../main/api/operarios/operarios.store';
import { TipoAplicacion } from '../main/api/tipos-aplicaciones/tipos-aplicaciones.store';
import { DatosMeteorologicos } from '../main/api/socket/socket';
import { ItemMenu } from '../main/api/menu/items-menu.store';
import { ItemInfoData } from '../main/api/info/items-info.store';


const ipcRenderer = createIpcRenderer<Api>()

export type Api = GetApiType<
  {
    getOperariosAsync: () => Promise<Operario[]>;
    addOperarioAsync: (name: string) => Promise<Operario>;
    removeOperarioAsync: (id: number) => Promise<Operario>;
    getTiposAplicacionesAsync: () => Promise<TipoAplicacion[]>;
    getItemsMenuAsync: () => Promise<ItemMenu[]>;
    getItemsInfoAsync: () => Promise<ItemInfoData[]>;
    getDatosMeteorologicosAsync: () => Promise<DatosMeteorologicos>;
  },
  {
  }
>;

const api: Api = {
  invoke: {
    getOperariosAsync: async () => {
      return await ipcRenderer.invoke('getOperariosAsync')
    },
    addOperarioAsync: async (name: string) => {
      return await ipcRenderer.invoke('addOperarioAsync', name)
    },
    removeOperarioAsync: async (id: number) => {
      return await ipcRenderer.invoke('removeOperarioAsync', id)
    },
    getTiposAplicacionesAsync: async () => {
      return await ipcRenderer.invoke('getTiposAplicacionesAsync')
    },
    getItemsMenuAsync: async () => {
      return await ipcRenderer.invoke('getItemsMenuAsync')
    },
    getItemsInfoAsync: async () => {
      return await ipcRenderer.invoke('getItemsInfoAsync')
    },
    getDatosMeteorologicosAsync: async () => {
      return await ipcRenderer.invoke('getDatosMeteorologicosAsync')
    }
  },
  on: {

  }
}

declare global {
  interface Window {
    api: Api;
  }
}


// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
