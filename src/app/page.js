'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye } from "@fortawesome/free-regular-svg-icons"
import { faLightbulb } from "@fortawesome/free-regular-svg-icons"
import { faCamera } from "@fortawesome/free-regular-svg-icons"
import { useRef, useState, useEffect } from "react"
const Main = () => {

  const [state, setState] = useState(false)
  const [object, setObject] = useState('')

  const [predictions, setPredictions] = useState([])

  useEffect(() => {

    const most = () => {

      if (predictions.length === 0) return

      const best = predictions.reduce((a, b) =>
        a.probability > b.probability ? a : b
      )

      setObject(best.className)
    }

    most()

  }, [predictions])

  //asdasdasd

  const webcamContainerRef = useRef(null)
  const labelContainerRef = useRef(null)
  const rafRef = useRef(0)
  const modelRef = useRef(null)
  const webcamRef = useRef(null)
  const maxPredictionsRef = useRef(0)
  const [ready, setReady] = useState(false)
  const URL = "https://teachablemachine.withgoogle.com/models/iJTFhiE7a/"

  async function init() {
    if (ready) return
    const tmImage = await import("@teachablemachine/image")
    await import("@tensorflow/tfjs")
    const modelURL = URL + "model.json"
    const metadataURL = URL + "metadata.json"
    modelRef.current = await tmImage.load(modelURL, metadataURL)
    maxPredictionsRef.current = modelRef.current.getTotalClasses()
    const flip = true
    webcamRef.current = new tmImage.Webcam(600, 600, flip)
    await webcamRef.current.setup()
    await webcamRef.current.play()
    setState(true)
    rafRef.current = requestAnimationFrame(loop)
    if (webcamContainerRef.current && !webcamContainerRef.current.contains(webcamRef.current.canvas)) {
      webcamContainerRef.current.appendChild(webcamRef.current.canvas)
    }
    if (labelContainerRef.current) {
      labelContainerRef.current.innerHTML = ""
      for (let i = 0; i < maxPredictionsRef.current; i++) {
        const div = document.createElement("div")
        labelContainerRef.current.appendChild(div)
      }
    }
    setReady(true)
  }

  async function loop() {
    if (!webcamRef.current) return
    webcamRef.current.update()
    await predict()
    rafRef.current = requestAnimationFrame(loop)
  }

  async function predict() {
    if (!modelRef.current || !webcamRef.current) return
    const prediction = await modelRef.current.predict(webcamRef.current.canvas)
    if (labelContainerRef.current) {
      for (let i = 0; i < maxPredictionsRef.current; i++) {
        const p = prediction[i]
        const text = p.className + ": " + p.probability.toFixed(2)
        labelContainerRef.current.childNodes[i].textContent = text
      }
    }
    setPredictions(prediction)
  }

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (webcamRef.current) webcamRef.current.stop()
    }
  }, [])



  return (
    <div className="main-container">
      <h1 className="title"><div className="fontA"><FontAwesomeIcon icon={faEye}></FontAwesomeIcon></div> Detección de Objetos</h1>

      <p>Enciende la camara y muestra algún objeto que tengas en las manos.</p>

      <div className="main">

        <div className="side-bar">
          <h3 className="side-bar-title"> <div className="fontA"><FontAwesomeIcon icon={faLightbulb}></FontAwesomeIcon></div> Control</h3>

          <div className="button" onClick={() => init()}>
            <div className="fontA"><FontAwesomeIcon icon={faCamera} color="white"></FontAwesomeIcon></div>
            <p>Iniciar camara</p>
          </div>

          <div className="state">
            <h3 onClick={() => console.log(predictions)}>Estado:</h3>
            <div className="state-label">{state ? "Activo" : "Inactivo"}</div>
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
          <h3 style={{ display: state ? "none" : "flex" }}>Feed de cámara en Vivo</h3>
          <div className="camera-content" style={{ display: state ? "none" : "flex" }}>
            <div className="fontA"><FontAwesomeIcon icon={faCamera} color="black" size="5x"></FontAwesomeIcon></div>
            Haz clic en "Iniciar Cámara" para comenzar
          </div>
          <div style={{ display: state ? "block" : "none" }} ref={webcamContainerRef} id="webcam-container" />
        </div>

      </div>


      <div ref={labelContainerRef} id="label-container" />
    </div>
  )
}

export default Main