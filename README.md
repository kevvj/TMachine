# TMachine – Detección de Objetos en Tiempo Real

TMachine es una aplicación web desarrollada con Next.js que permite reconocer objetos sostenidos en la mano usando la cámara del navegador.
El modelo fue entrenado en Teachable Machine con aproximadamente 20 objetos.

## Funcionalidades

- Reconocimiento de objetos en tiempo real
- Visualización del nombre del objeto detectado
- Actualización automática cada 2 segundos
- Interfaz simple para iniciar/detener la cámara
- Estado en tiempo real del sistema y del objeto detectado

## Tecnologías

- Next.js / React
- JavaScript
- Teachable Machine (TensorFlow.js)
- FontAwesome para íconos

## Repositorio

https://github.com/kevvj/TMachine

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
4. Abrir en el navegador:
   ```
   http://localhost:30000
   ```
5. Hacer clic en "Iniciar cámara" y mostrar un objeto frente a la cámara para probar la detección.

## Notas

- El modelo reconoce únicamente los objetos con los que fue entrenado
- Recomendado usar buena iluminación para mejorar la precisión

## Mejoras futuras

- Añadir más objetos al modelo
- Optimizar la precisión de detección
- Guardar historial de objetos detectados
- Exportar resultados o imágenes etiquetadas
