'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye } from "@fortawesome/free-regular-svg-icons"
import { faLightbulb } from "@fortawesome/free-regular-svg-icons"
import { faCamera } from "@fortawesome/free-regular-svg-icons"
import { useState } from "react"
const Main = () => {

  const [state, setState] = useState('Inactivo')
  const [object, setObject] = useState('...')


  return (
    <div className="main-container">
      <h1 className="title"><div className="fontA"><FontAwesomeIcon icon={faEye}></FontAwesomeIcon></div> Detección de Objetos</h1>

      <p>Enciende la camara y muestra algún objeto que tengas en las manos.</p>

      <div className="main">

        <div className="side-bar">
          <h3 className="side-bar-title"> <div className="fontA"><FontAwesomeIcon icon={faLightbulb}></FontAwesomeIcon></div> Control</h3>

          <div className="button">
            <div className="fontA"><FontAwesomeIcon icon={faCamera} color="white"></FontAwesomeIcon></div>
            <p>Iniciar camara</p>
          </div>

          <div className="state">
            <h3>Estado:</h3>
            <div className="state-label">{state}</div>
          </div>

          <div className="state">
            <h3>Objeto:</h3>
            <div className="state-label">{object}</div>
          </div>

          <div className="information">
            <h3>Información</h3>

            <p>La detección se actualiza cada 2 segundos. Muestra diferentes objetos frente a la cámara para probar el sistema.</p>
          </div>
        </div>

        <div className="camera">
          <h3>Feed de cámara en Vivo</h3>
          <div className="camera-content">
            <div className="fontA"><FontAwesomeIcon icon={faCamera} color="black" size="5x"></FontAwesomeIcon></div>
            Haz clic en "Iniciar Cámara" para comenzar
          </div>
        </div>

      </div>

    </div>
  )
}

export default Main