# TMachine – Detección de Objetos en Tiempo Real

TMachine es una aplicación web hecha con Next.js que reconoce objetos con la cámara del navegador.
Todo el procesamiento ocurre en el navegador con TensorFlow.js; no se envían imágenes a ningún servidor.

## Modos

| Modo | Modelo | Qué hace |
|---|---|---|
| **Detección (COCO-SSD)** (por defecto) | COCO-SSD `lite_mobilenet_v2` | Detecta hasta 80 tipos de objetos a la vez (personas, celulares, tazas, libros...) y dibuja un recuadro con su etiqueta en español y el porcentaje de confianza. |
| **Modelo propio** | Teachable Machine | Clasifica el objeto que tienes en la mano entre unos 20 objetos con los que entrené el modelo. |

Se puede cambiar de modo sin detener la cámara.

## Funcionalidades

- Reconocimiento continuo, cuadro a cuadro (`requestAnimationFrame`), con contador de FPS
- Varios objetos a la vez con recuadros y etiquetas (modo COCO-SSD)
- Solo muestra resultados con confianza de al menos 50 %
- Botones para iniciar y detener la cámara
- Estado del sistema y mensajes de error claros
- Diseño responsive (funciona en el celular)

## Tecnologías

- Next.js 15 / React
- TensorFlow.js: `@tensorflow-models/coco-ssd` y Teachable Machine (`@teachablemachine/image`)
- FontAwesome para los íconos

## Instalación y uso

1. Clonar el repositorio:
   ```
   git clone https://github.com/kevvj/TMachine
   cd TMachine
   ```
2. Instalar dependencias:
   ```
   npm install
   ```
3. Ejecutar el servidor de desarrollo:
   ```
   npm run dev
   ```
4. Abrir `http://localhost:3000`, elegir un modo, pulsar "Iniciar cámara" y aceptar el permiso.

## Configuración

Variables opcionales al compilar:

- `NEXT_PUBLIC_TM_URL`: URL del modelo de Teachable Machine (carpeta con `model.json` y `metadata.json`).
- `NEXT_PUBLIC_COCO_URL`: URL propia de los pesos de COCO-SSD (por defecto se cargan desde storage.googleapis.com).

Exportación estática (por ejemplo, para servirlo dentro de otro sitio):

```
STATIC_EXPORT=1 BASE_PATH=/demos/tmachine NEXT_PUBLIC_TM_URL=/demos/tmachine/model/ npm run build
```

El resultado queda en `out/`.

## Notas

- El modelo propio solo reconoce los objetos con los que fue entrenado.
- Con buena iluminación la precisión mejora.
- La cámara solo funciona en `localhost` o con HTTPS.

## Mejoras futuras

- Añadir más objetos al modelo propio
- Guardar el historial de objetos detectados
- Exportar capturas con las etiquetas
