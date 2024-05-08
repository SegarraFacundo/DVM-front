import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './ui/layout/Layout'
import Home from './app/home/Home'
import { Testing } from './app/testing/Testing'
import { useEffect, useState } from 'react'
import { useCarga } from './ui/layout/hooks/useCarga'
import { Trabajo } from './app/trabajo/Trabajo'
import { Reportes } from './app/reportes/Reportes'
import ConfiguracionGeneral from './app/configuracion-general/ConfiguracionGeneral'
import ConfiguracionAvanzada from './app/configuracion-avanzada/ConfiguracionAvanzada'
import { Socket, io } from 'socket.io-client'
import {
  ClientToServerEvents,
  ServerToClientEvents
} from './lib/socket/interfaces/socket-client.interface'
import { ConfiguracionesAvanzadasData, SendConfiguracionesAvanzadasData } from './app/configuracion-avanzada/interfaces/configuraciones-avanzadas-data'

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io()

export function App() {
  const { setCargando } = useCarga()
  const [presentar, setPresentar] = useState<boolean>(true)
  useEffect(() => {
    setCargando(true)
    setTimeout(() => {
      setPresentar(false)
    }, 2000)
    setTimeout(() => {
      setCargando(false)
    }, 3000)
    setConfiguracionInicial()
    escuchoDesconeccion()
  }, [])

  const escuchoDesconeccion = (): void => {
    socket.on('desconectado', () => alert('Se desconecto'))
    //socket.on('error', (err) => alert(JSON.stringify(err)))
  }

  const setConfiguracionInicial = async (): Promise<void> => {
    const configuracionesAvanzadasData: ConfiguracionesAvanzadasData = await window.api.invoke.getConfiguracionesAvanzadasAsync()
    const data: SendConfiguracionesAvanzadasData = {
      variacionRPM: configuracionesAvanzadasData.variacionRPM,
      subcorriente: configuracionesAvanzadasData.corriente.minimo,
      sobrecorriente: configuracionesAvanzadasData.corriente.maximo,
      cortocicuito: configuracionesAvanzadasData.corriente.limite,
      sensor: configuracionesAvanzadasData.sensorRPM,
      electrovalvula: configuracionesAvanzadasData.electroValvula
    }
    socket.emit('setConfiguracion', data)
  }
  return presentar ? (
    <Presentacion />
  ) : (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/testing" element={<Testing />} />
          <Route path="/trabajo" element={<Trabajo />} />
          <Route path="/configuracion-general" element={<ConfiguracionGeneral />} />
          <Route path="/configuracion-avanzada" element={<ConfiguracionAvanzada />} />
          <Route path="/reportes" element={<Reportes />} />
        </Routes>
      </Layout>
    </Router>
  )
}

function Presentacion() {
  return (
    <div className="bg-[#172530] w-full h-[800px] flex items-center justify-center">
      <svg
        width="191"
        height="76"
        viewBox="0 0 191 76"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M123.886 51.7242C120.12 51.7242 116.943 48.9007 116.491 45.1458L112.411 11.3516V10.9426H118.514C119.05 10.9426 119.501 11.3467 119.56 11.8838L123.15 44.6678C123.209 45.2 123.66 45.609 124.195 45.609C124.613 45.609 124.986 45.3626 125.158 44.9831L139.908 11.5783C140.075 11.1989 140.453 10.9525 140.87 10.9525H147.229V11.3615L130.8 47.3681C129.587 50.0242 126.94 51.7292 124.024 51.7292H123.896L123.886 51.7242Z"
          fill="#F4F4F4"
        />
        <path
          d="M190.755 11.2566C190.569 11.0555 190.348 10.9966 190.259 10.977C187.901 10.9672 185.547 10.9573 183.189 10.9426C182.442 11.0211 181.538 11.2517 180.747 11.8748C179.902 12.5372 179.539 13.3664 179.416 13.6411C178.615 15.4319 173.161 27.1728 165.693 43.3393L165.708 14.0189C165.708 12.3753 164.372 11.0408 162.726 11.0506C162.195 11.0506 161.664 11.0506 161.134 11.0555H156.447C156.014 11.0555 155.621 11.3057 155.44 11.6933C149.421 24.4891 143.407 37.2848 137.388 50.0757C137.04 50.8166 137.585 51.6654 138.401 51.6605C139.349 51.6457 140.302 51.631 141.25 51.6163C141.727 51.5476 142.341 51.3955 142.965 51.0374C144.046 50.4143 144.635 49.4771 144.97 48.8491C146.139 46.6413 151.804 34.5275 159.375 17.8557C159.493 17.8802 159.468 17.8753 159.586 17.8998L159.517 46.1114C159.517 46.5971 159.576 48.0592 160.618 49.4477C161.866 51.106 163.64 51.4838 164.062 51.5574C165.104 51.7537 166.705 51.8665 168.135 51.0374C169.3 50.3603 169.879 49.3349 170.14 48.8491C171.275 46.7001 176.669 35.18 183.931 19.2049V48.2015C183.931 50.1493 185.513 51.7292 187.464 51.7292H189.974C190.539 51.7292 190.996 51.2729 190.996 50.7086V12.0024C191.001 11.9386 191.035 11.5608 190.76 11.2566"
          fill="#F4F4F4"
        />
        <path
          d="M3.68907 52.2104C2.49327 49.7896 1.29263 47.3736 0.0968347 44.9527C-0.164595 44.4207 0.125882 43.7813 0.697154 43.6349L11.285 40.931C12.6503 40.5796 13.7928 39.3691 14.1269 37.9195C14.5916 35.9038 13.2554 34.2199 12.4227 33.3951L4.42494 25.3125C4.42494 25.3125 4.40073 25.2881 4.39105 25.2784C3.61645 24.5853 2.01398 22.9307 1.65089 20.4318C1.28295 17.9084 2.37224 15.839 3.19041 14.282C3.60192 13.4962 4.04248 12.8373 4.43947 12.3053C4.78804 11.8416 5.46582 11.8124 5.85312 12.2419L20.9192 28.8267L20.9967 28.8999C21.7325 29.6076 25.4119 33.4634 24.8019 39.1153C24.3323 43.508 21.4517 47.3297 17.2737 49.1209C17.235 49.1355 17.1914 49.1502 17.1527 49.1648L4.76867 52.6887C4.34264 52.8107 3.88756 52.6106 3.69391 52.2104"
          fill="#32CF9C"
        />
        <path
          d="M25.37 0C28.0926 0.198971 30.8103 0.397942 33.533 0.591939C34.1287 0.636708 34.5373 1.22367 34.365 1.80566L31.2239 12.57C30.8202 13.9578 31.2781 15.5944 32.3661 16.6489C33.8776 18.1064 36.0291 17.8029 37.1763 17.4896L48.3326 14.6194C48.3326 14.6194 48.3671 14.6095 48.3819 14.6045C49.3862 14.2812 51.651 13.724 54.0093 14.699C56.3873 15.6839 57.6231 17.7234 58.5486 19.2554C59.0164 20.0264 59.361 20.7577 59.617 21.3844C59.8386 21.9316 59.5136 22.5484 58.9376 22.6678L36.7332 27.3735L36.6298 27.4033C35.6352 27.6868 30.382 28.9354 25.7885 25.4633C22.219 22.7673 20.3925 18.2307 21.0079 13.6096C21.0128 13.5649 21.0227 13.5251 21.0325 13.4803L24.3952 0.706347C24.5084 0.268611 24.922 -0.0298457 25.37 0.00497428"
          fill="#32CF9C"
        />
        <path
          d="M58.539 45.2684C57.0695 47.4962 55.595 49.7193 54.1255 51.9471C53.8022 52.4347 53.0968 52.5064 52.6804 52.0953L44.882 44.4557C43.8778 43.4709 42.2417 43.1028 40.8162 43.5474C38.8372 44.1593 38.0682 46.1337 37.789 47.2572L34.938 58.0855C34.938 58.0855 34.9282 58.1189 34.9282 58.1333C34.7323 59.1372 34.1298 61.3268 32.1606 62.8805C30.1718 64.4534 27.8254 64.5633 26.057 64.6446C25.1655 64.6876 24.3719 64.6446 23.7058 64.5729C23.1277 64.5107 22.7505 63.9466 22.922 63.4016L29.4615 42.314L29.486 42.2136C29.7162 41.2335 31.1466 36.1851 36.339 33.876C40.3754 32.0833 45.1612 32.6187 48.8645 35.272C48.8988 35.2959 48.9331 35.3246 48.9673 35.3533L58.4019 44.1067C58.7252 44.4079 58.7888 44.8908 58.5439 45.2589"
          fill="#32CF9C"
        />
        <path
          d="M89.2646 10.9426H79.0673C77.1603 10.9426 75.604 12.4845 75.604 14.3849V50.7962C75.604 51.3118 76.024 51.7292 76.5427 51.7292H89.2646C102.644 51.7292 109.427 44.8692 109.427 31.3359C109.427 17.8026 102.644 10.9426 89.2646 10.9426ZM102.219 31.3359C102.219 41.4515 98.3157 45.5763 88.7557 45.5763H82.7579V17.0955H88.7557C98.3157 17.0955 102.219 21.2203 102.219 31.3359Z"
          fill="#F4F4F4"
        />
        <path
          d="M81.3976 72.6199C80.6317 72.6199 79.9579 72.5161 79.3762 72.3086C78.7945 72.1011 78.3049 71.8134 77.9074 71.4455C77.5099 71.0776 77.1997 70.6484 76.9864 70.1579C76.7683 69.6673 76.6423 69.1344 76.5986 68.5684H78.2322C78.2613 69.0212 78.397 69.4551 78.6394 69.8749C78.8818 70.2947 79.2356 70.6342 79.7058 70.8984C80.176 71.1625 80.7625 71.2946 81.4703 71.2946C82.2362 71.2946 82.8372 71.1295 83.2735 70.7993C83.7049 70.4692 83.923 70.0211 83.923 69.4504C83.923 68.8797 83.7146 68.4458 83.2929 68.1392C82.876 67.8326 82.3476 67.5779 81.7078 67.3751L80.5735 67.0072C79.9967 66.8186 79.4489 66.6016 78.9254 66.3516C78.4019 66.1017 77.9704 65.7715 77.636 65.3564C77.3015 64.9414 77.1367 64.4037 77.1367 63.734C77.1367 63.0642 77.2967 62.536 77.6214 62.0832C77.9462 61.6304 78.3922 61.2861 78.969 61.0455C79.5458 60.805 80.2099 60.6824 80.9661 60.6824C81.8871 60.6824 82.6433 60.8427 83.2396 61.1635C83.8358 61.4842 84.2866 61.904 84.5871 62.4228C84.8877 62.9416 85.0622 63.517 85.101 64.1443H83.4625C83.4335 63.7811 83.3268 63.4368 83.1523 63.1114C82.9778 62.7859 82.7063 62.5218 82.3428 62.3143C81.9792 62.1068 81.4993 62.003 80.9031 62.003C80.2584 62.003 79.7397 62.1445 79.3519 62.4228C78.9642 62.701 78.7703 63.0878 78.7703 63.5783C78.7703 64.1302 78.9932 64.5499 79.4441 64.8471C79.8949 65.1395 80.4329 65.3895 81.0582 65.5828L82.2071 65.9507C82.7839 66.13 83.3268 66.3422 83.8358 66.6016C84.3448 66.861 84.7616 67.1912 85.0767 67.6109C85.3967 68.026 85.5518 68.5873 85.5518 69.2806C85.5518 70.3418 85.1737 71.1625 84.4175 71.7426C83.6613 72.3228 82.6482 72.6105 81.3879 72.6105"
          fill="#F4F4F4"
        />
        <path
          d="M88.5363 61.7783C88.2224 61.7783 87.981 61.6819 87.8071 61.4942C87.6333 61.3014 87.5415 61.0477 87.5415 60.7331C87.5415 60.4186 87.6284 60.1649 87.8071 59.9721C87.981 59.7844 88.2272 59.688 88.5363 59.688C88.8454 59.688 89.1061 59.7844 89.2751 59.9721C89.4442 60.1649 89.5311 60.4186 89.5311 60.7331C89.5311 61.0477 89.4442 61.3014 89.2751 61.4942C89.1061 61.6869 88.8598 61.7783 88.5363 61.7783ZM87.7202 63.1075H89.3476V72.6203H87.7202V63.1075Z"
          fill="#F4F4F4"
        />
        <path
          d="M91.5261 72.6201V63.8859H93.0475V65.2089H93.4279C93.5749 64.7151 93.859 64.3331 94.2748 64.0676C94.6907 63.8021 95.2232 63.667 95.8673 63.667C96.5519 63.667 97.1149 63.8067 97.5459 64.0816C97.977 64.3564 98.2965 64.7337 98.4943 65.2089H98.8747C99.0522 64.7151 99.3615 64.3331 99.8027 64.0676C100.239 63.8021 100.797 63.667 101.476 63.667C102.521 63.667 103.282 63.9791 103.748 64.608C104.22 65.2322 104.453 66.038 104.453 67.0163V72.6201H102.739V67.3517C102.739 66.597 102.607 66.0147 102.344 65.6141C102.08 65.2135 101.659 65.0086 101.076 65.0086C100.366 65.0086 99.818 65.2881 99.4275 65.8471C99.037 66.406 98.8442 67.0955 98.8442 67.92V72.6201H97.1301V67.3517C97.1301 66.597 96.9982 66.0147 96.7345 65.6141C96.4708 65.2135 96.0498 65.0086 95.4666 65.0086C94.7566 65.0086 94.2089 65.2881 93.8184 65.8471C93.4279 66.406 93.2352 67.0955 93.2352 67.92V72.6201H91.521H91.5261Z"
          fill="#F4F4F4"
        />
        <path
          d="M106.443 75.5998V63.8826H107.887V65.0262H108.248C108.407 64.6747 108.696 64.3607 109.105 64.0841C109.515 63.8076 110.068 63.667 110.761 63.667C111.532 63.667 112.191 63.8545 112.731 64.2294C113.27 64.6044 113.684 65.1387 113.973 65.8323C114.257 66.526 114.401 67.3415 114.401 68.2789C114.401 69.2163 114.257 70.0177 113.973 70.7114C113.689 71.4051 113.275 71.9394 112.74 72.3237C112.206 72.7033 111.556 72.8955 110.79 72.8955C110.179 72.8955 109.683 72.7783 109.303 72.544C108.922 72.3096 108.629 72.0003 108.431 71.6207H108.07V75.6045H106.448L106.443 75.5998ZM110.473 71.5738C111.204 71.5738 111.768 71.2879 112.158 70.7114C112.548 70.1349 112.745 69.3241 112.745 68.2789C112.745 67.2337 112.548 66.4229 112.158 65.8464C111.768 65.2699 111.204 64.984 110.473 64.984C109.741 64.984 109.125 65.2887 108.682 65.8933C108.239 66.4979 108.017 67.2946 108.017 68.2789C108.017 69.2631 108.239 70.0599 108.682 70.6645C109.125 71.2691 109.722 71.5738 110.473 71.5738Z"
          fill="#F4F4F4"
        />
        <path
          d="M117.26 72.6199C116.999 72.3524 116.789 72.0276 116.629 71.6502C116.47 71.2728 116.391 70.7044 116.391 69.9496V60.6824H118.306V69.7394C118.306 70.5372 118.409 71.1343 118.619 71.5308C118.824 71.9272 119.079 72.2616 119.375 72.5291V72.6199H117.26Z"
          fill="#F4F4F4"
        />
        <path
          d="M124.483 72.6156C123.137 72.6156 122.113 72.2063 121.418 71.3879C120.717 70.5694 120.37 69.4872 120.37 68.1413C120.37 67.2501 120.526 66.4725 120.835 65.8041C121.143 65.1357 121.604 64.6128 122.211 64.2354C122.818 63.858 123.573 63.667 124.469 63.667C125.723 63.667 126.678 64.0444 127.339 64.8038C127.995 65.5631 128.328 66.6589 128.328 68.1004V68.5414H121.976C122.025 69.3735 122.26 70.0601 122.671 70.5921C123.083 71.1287 123.695 71.397 124.498 71.397C125.081 71.397 125.551 71.2469 125.909 70.9423C126.266 70.6376 126.521 70.2193 126.673 69.6782H128.235C128.103 70.2557 127.882 70.7649 127.579 71.206C127.275 71.6471 126.864 71.9926 126.354 72.2427C125.845 72.4928 125.223 72.6201 124.488 72.6201M121.996 67.4365H126.722C126.692 66.6135 126.477 65.9814 126.08 65.5495C125.683 65.113 125.14 64.8947 124.459 64.8947C123.734 64.8947 123.166 65.1175 122.755 65.5631C122.343 66.0087 122.089 66.6317 121.996 67.4365Z"
          fill="#F4F4F4"
        />
        <path
          d="M133.302 72.6199V72.5268L136.976 60.6824H139.576L143.25 72.5268V72.6199H141.557L138.392 62.0148H138.045L134.88 72.6199H133.302ZM135.69 69.1469L136.139 67.7067H140.303L140.752 69.1469H135.694H135.69Z"
          fill="#F4F4F4"
        />
        <path
          d="M148.334 75.6045C147.681 75.6045 147.127 75.5261 146.68 75.374C146.228 75.2218 145.86 75.0235 145.575 74.7746C145.29 74.5302 145.074 74.2628 144.932 73.9769C144.79 73.691 144.696 73.4051 144.657 73.1285H146.312C146.37 73.4559 146.567 73.7463 146.896 74.0092C147.225 74.2674 147.73 74.3965 148.413 74.3965C149.149 74.3965 149.719 74.2028 150.121 73.8201C150.524 73.4374 150.725 72.8149 150.725 71.9619V70.9983H150.357C150.195 71.381 149.915 71.7037 149.522 71.9573C149.13 72.2109 148.594 72.34 147.922 72.34C146.788 72.34 145.889 71.9527 145.231 71.1735C144.574 70.3942 144.245 69.3291 144.245 67.9735C144.245 67.0882 144.392 66.3275 144.682 65.6819C144.971 65.0364 145.393 64.5431 145.938 64.1926C146.483 63.8422 147.136 63.667 147.892 63.667C148.599 63.667 149.144 63.8007 149.527 64.0728C149.91 64.3402 150.19 64.6537 150.362 65.0088H150.73V63.8837H152.203V72.0495C152.203 73.2023 151.869 74.0829 151.206 74.6916C150.544 75.3002 149.586 75.6045 148.339 75.6045M148.123 71.0398C148.909 71.0398 149.517 70.7539 149.95 70.1821C150.377 69.6104 150.593 68.8819 150.593 68.0012C150.593 67.1205 150.377 66.3643 149.94 65.8064C149.503 65.2439 148.904 64.9626 148.138 64.9626C147.421 64.9626 146.871 65.2255 146.483 65.7557C146.096 66.286 145.899 67.0329 145.899 68.0012C145.899 68.9695 146.091 69.7211 146.474 70.2467C146.856 70.7769 147.406 71.0398 148.123 71.0398Z"
          fill="#F4F4F4"
        />
        <path
          d="M157.287 72.6199V62.1225H153.198V60.6824H163.146V62.1225H159.056V72.6199H157.287Z"
          fill="#F4F4F4"
        />
        <path
          d="M167.26 72.6156C165.913 72.6156 164.889 72.2063 164.194 71.3879C163.494 70.5694 163.146 69.4872 163.146 68.1413C163.146 67.2501 163.303 66.4725 163.611 65.8041C163.92 65.1357 164.38 64.6128 164.987 64.2354C165.595 63.858 166.349 63.667 167.245 63.667C168.499 63.667 169.454 64.0444 170.115 64.8038C170.771 65.5631 171.104 66.6589 171.104 68.1004V68.5414H164.752C164.801 69.3735 165.036 70.0601 165.448 70.5921C165.859 71.1287 166.471 71.397 167.275 71.397C167.857 71.397 168.327 71.2469 168.685 70.9423C169.043 70.6376 169.297 70.2193 169.449 69.6782H171.011C170.879 70.2557 170.659 70.7649 170.355 71.206C170.051 71.6471 169.64 71.9926 169.131 72.2427C168.621 72.4928 167.999 72.6201 167.265 72.6201M164.772 67.4365H169.498C169.469 66.6135 169.253 65.9814 168.856 65.5495C168.46 65.113 167.916 64.8947 167.235 64.8947C166.511 64.8947 165.942 65.1175 165.531 65.5631C165.12 66.0087 164.865 66.6317 164.772 67.4365Z"
          fill="#F4F4F4"
        />
        <path
          d="M176.668 72.611C175.481 72.611 174.592 72.202 173.992 71.384C173.396 70.5659 173.094 69.4843 173.094 68.139C173.094 66.7938 173.396 65.6894 174.005 64.8804C174.614 64.0715 175.499 63.667 176.668 63.667C177.627 63.667 178.398 63.9442 178.985 64.4987C179.572 65.0531 179.931 65.8394 180.058 66.8619H178.621C178.538 66.2575 178.337 65.7803 178.017 65.4349C177.697 65.0895 177.259 64.9168 176.703 64.9168C175.98 64.9168 175.45 65.2077 175.109 65.7848C174.767 66.362 174.596 67.1483 174.596 68.1436C174.596 69.1389 174.767 69.9251 175.109 70.5023C175.45 71.0795 175.98 71.3703 176.703 71.3703C177.259 71.3703 177.697 71.1976 178.017 70.8522C178.337 70.5068 178.538 70.0296 178.621 69.4252H180.058C179.913 70.4568 179.545 71.2476 178.963 71.7975C178.38 72.3474 177.614 72.6201 176.664 72.6201"
          fill="#F4F4F4"
        />
        <path
          d="M182.052 72.6199V60.6824H183.823V64.8287H184.216C184.457 64.3797 184.782 64.0358 185.196 63.7969C185.61 63.5581 186.133 63.4387 186.767 63.4387C187.894 63.4387 188.711 63.7587 189.23 64.4036C189.748 65.0437 190.005 65.8701 190.005 66.8733V72.6199H188.24V67.2172C188.24 66.4433 188.088 65.8462 187.779 65.4354C187.475 65.0246 186.998 64.8144 186.353 64.8144C185.557 64.8144 184.934 65.101 184.488 65.6743C184.043 66.2475 183.818 66.9545 183.818 67.8V72.6199H182.047H182.052Z"
          fill="#F4F4F4"
        />
      </svg>
    </div>
  )
}
