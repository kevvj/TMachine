'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faLightbulb, faCamera, faCircleStop } from "@fortawesome/free-regular-svg-icons"
import { useRef, useState, useEffect } from "react"
import { cocoLabel } from "./cocoLabels"

// Se pueden cambiar al compilar (por ejemplo, para servir los modelos en local).
const TM_URL = process.env.NEXT_PUBLIC_TM_URL || "https://teachablemachine.withgoogle.com/models/iJTFhiE7a/"
const COCO_URL = process.env.NEXT_PUBLIC_COCO_URL || undefined

const MODES = {
  coco: {
    name: "Detección (COCO-SSD)",
    info: "Detecta hasta 80 tipos de objetos a la vez (personas, celulares, tazas, libros...) y dibuja un recuadro sobre cada uno.",
  },
  tm: {
    name: "Modelo propio",
    info: "Clasifica el objeto que tienes en la mano entre unos 20 objetos con los que entrené el modelo en Teachable Machine.",
  },
}

const MIN_SCORE = 0.5
const BOX_COLOR = "rgb(1, 169, 108)"

const Main = () => {
  const [mode, setMode] = useState("coco")
  const [status, setStatus] = useState("idle") // idle | loading | running | error
  const [error, setError] = useState("")
  const [results, setResults] = useState([])
  const [fps, setFps] = useState(0)

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const rafRef = useRef(0)
  const modelsRef = useRef({})
  const modeRef = useRef(mode)
  const lastUiRef = useRef(0)
  const framesRef = useRef({ count: 0, since: 0 })

  useEffect(() => { modeRef.current = mode; clearCanvas(); setResults([]) }, [mode])
  useEffect(() => () => stop(), [])

  async function loadModel(m) {
    if (modelsRef.current[m]) return modelsRef.current[m]
    const tf = await import("@tensorflow/tfjs")
    await tf.ready()
    let model
    if (m === "coco") {
      const cocoSsd = await import("@tensorflow-models/coco-ssd")
      model = await cocoSsd.load({ base: "lite_mobilenet_v2", modelUrl: COCO_URL })
    } else {
      const tmImage = await import("@teachablemachine/image")
      model = await tmImage.load(TM_URL + "model.json", TM_URL + "metadata.json")
    }
    modelsRef.current[m] = model
    return model
  }

  async function start() {
    setError("")
    setStatus("loading")
    try {
      const [stream] = await Promise.all([
        navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: "user" }, audio: false }),
        loadModel(modeRef.current),
      ])
      streamRef.current = stream
      const video = videoRef.current
      video.srcObject = stream
      await video.play()
      canvasRef.current.width = video.videoWidth
      canvasRef.current.height = video.videoHeight
      setStatus("running")
      framesRef.current = { count: 0, since: performance.now() }
      rafRef.current = requestAnimationFrame(loop)
    } catch (e) {
      console.error(e)
      stop()
      setStatus("error")
      setError(e?.name === "NotAllowedError"
        ? "No se dio permiso para usar la cámara."
        : "No se pudo iniciar la cámara o cargar el modelo.")
    }
  }

  function stop() {
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    clearCanvas()
    setResults([])
    setFps(0)
    setStatus("idle")
  }

  async function changeMode(m) {
    if (m === mode) return
    setMode(m)
    if (streamRef.current) {
      setStatus("loading")
      try { await loadModel(m) } catch (e) { console.error(e); setError("No se pudo cargar el modelo.") }
      setStatus("running")
    }
  }

  async function loop() {
    const video = videoRef.current
    if (!streamRef.current || !video) return
    const m = modeRef.current
    const model = modelsRef.current[m]
    if (model && video.readyState >= 2) {
      let found = []
      if (m === "coco") {
        const dets = await model.detect(video, 10, MIN_SCORE)
        drawBoxes(dets)
        found = dets.map((d) => ({ label: cocoLabel(d.class), score: d.score }))
      } else {
        clearCanvas()
        const preds = await model.predict(video)
        found = preds
          .map((p) => ({ label: p.className, score: p.probability }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
      }
      updateUi(found)
    }
    if (streamRef.current) rafRef.current = requestAnimationFrame(loop)
  }

  // Actualiza la interfaz unas 4 veces por segundo para que no parpadee.
  function updateUi(found) {
    const now = performance.now()
    const f = framesRef.current
    f.count++
    if (now - f.since >= 1000) {
      setFps(Math.round((f.count * 1000) / (now - f.since)))
      f.count = 0
      f.since = now
    }
    if (now - lastUiRef.current > 250) {
      lastUiRef.current = now
      setResults(found)
    }
  }

  function clearCanvas() {
    const c = canvasRef.current
    c?.getContext("2d").clearRect(0, 0, c.width, c.height)
  }

  // El video se ve en espejo, así que se reflejan las cajas en X para que coincidan.
  function drawBoxes(dets) {
    const c = canvasRef.current
    const ctx = c.getContext("2d")
    ctx.clearRect(0, 0, c.width, c.height)
    ctx.lineWidth = 3
    ctx.font = "600 16px sans-serif"
    for (const d of dets) {
      const [x, y, w, h] = d.bbox
      const mx = c.width - x - w
      const text = `${cocoLabel(d.class)} ${Math.round(d.score * 100)}%`
      ctx.strokeStyle = BOX_COLOR
      ctx.strokeRect(mx, y, w, h)
      const tw = ctx.measureText(text).width + 10
      const ty = y > 24 ? y - 24 : y
      ctx.fillStyle = BOX_COLOR
      ctx.fillRect(mx, ty, tw, 24)
      ctx.fillStyle = "white"
      ctx.fillText(text, mx + 5, ty + 17)
    }
  }

  const running = status === "running"
  const statusText = { idle: "Inactivo", loading: "Cargando modelo...", running: "Activo", error: "Error" }[status]

  return (
    <div className="main-container">
      <h1 className="title"><div className="fontA"><FontAwesomeIcon icon={faEye} /></div> Detección de Objetos</h1>

      <p>Enciende la cámara y muestra algún objeto. Todo se procesa en tu navegador.</p>

      <div className="main">

        <div className="side-bar">
          <h3 className="side-bar-title"><div className="fontA"><FontAwesomeIcon icon={faLightbulb} /></div> Control</h3>

          <div className="modes">
            {Object.entries(MODES).map(([key, m]) => (
              <button
                key={key}
                className={`mode ${mode === key ? "active" : ""}`}
                onClick={() => changeMode(key)}
                disabled={status === "loading"}
              >
                {m.name}
              </button>
            ))}
          </div>

          <button
            className="button"
            onClick={() => (streamRef.current ? stop() : start())}
            disabled={status === "loading"}
          >
            <div className="fontA"><FontAwesomeIcon icon={streamRef.current ? faCircleStop : faCamera} color="white" /></div>
            <p>{streamRef.current ? "Detener cámara" : "Iniciar cámara"}</p>
          </button>

          <div className="state">
            <h3>Estado:</h3>
            <div className="state-label">{statusText}{running && fps ? ` · ${fps} FPS` : ""}</div>
            {error && <p className="error">{error}</p>}
          </div>

          <div className="state">
            <h3>{mode === "coco" ? `Objetos (${results.length}):` : "Objeto:"}</h3>
            <ul className="results">
              {results.length === 0 && <li className="empty">{running ? "Nada por ahora" : "—"}</li>}
              {results.map((r, i) => (
                <li key={i}>
                  <span>{r.label}</span>
                  <span className="bar"><span style={{ width: `${Math.round(r.score * 100)}%` }} /></span>
                  <span className="pct">{Math.round(r.score * 100)}%</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="information">
            <h3>Información</h3>
            <p>{MODES[mode].info}</p>
          </div>
        </div>

        <div className="camera">
          <h3 style={{ display: streamRef.current ? "none" : "flex" }}>Feed de cámara en vivo</h3>
          <div className="camera-content" style={{ display: streamRef.current ? "none" : "flex" }}>
            <div className="fontA"><FontAwesomeIcon icon={faCamera} color="black" size="5x" /></div>
            Haz clic en "Iniciar cámara" para comenzar
          </div>
          <div id="webcam-container" style={{ display: streamRef.current ? "block" : "none" }}>
            <video ref={videoRef} playsInline muted />
            <canvas ref={canvasRef} />
          </div>
        </div>

      </div>
    </div>
  )
}

export default Main
