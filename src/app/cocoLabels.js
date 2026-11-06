// Nombres en español de las 80 clases de COCO.
const COCO_ES = {
  person: "persona", bicycle: "bicicleta", car: "carro", motorcycle: "moto", airplane: "avión",
  bus: "bus", train: "tren", truck: "camión", boat: "barco", "traffic light": "semáforo",
  "fire hydrant": "hidrante", "stop sign": "señal de pare", "parking meter": "parquímetro", bench: "banca",
  bird: "pájaro", cat: "gato", dog: "perro", horse: "caballo", sheep: "oveja", cow: "vaca",
  elephant: "elefante", bear: "oso", zebra: "cebra", giraffe: "jirafa", backpack: "mochila",
  umbrella: "sombrilla", handbag: "bolso", tie: "corbata", suitcase: "maleta", frisbee: "frisbee",
  skis: "esquís", snowboard: "snowboard", "sports ball": "balón", kite: "cometa",
  "baseball bat": "bate", "baseball glove": "guante de béisbol", skateboard: "patineta",
  surfboard: "tabla de surf", "tennis racket": "raqueta", bottle: "botella", "wine glass": "copa",
  cup: "taza", fork: "tenedor", knife: "cuchillo", spoon: "cuchara", bowl: "tazón", banana: "banano",
  apple: "manzana", sandwich: "sándwich", orange: "naranja", broccoli: "brócoli", carrot: "zanahoria",
  "hot dog": "perro caliente", pizza: "pizza", donut: "dona", cake: "torta", chair: "silla",
  couch: "sofá", "potted plant": "planta", bed: "cama", "dining table": "mesa", toilet: "inodoro",
  tv: "televisor", laptop: "portátil", mouse: "mouse", remote: "control remoto", keyboard: "teclado",
  "cell phone": "celular", microwave: "microondas", oven: "horno", toaster: "tostadora", sink: "lavaplatos",
  refrigerator: "nevera", book: "libro", clock: "reloj", vase: "florero", scissors: "tijeras",
  "teddy bear": "peluche", "hair drier": "secador", toothbrush: "cepillo de dientes",
}

export const cocoLabel = (name) => COCO_ES[name] ?? name
