import express from "express";
const app = express();
app.use(express.json());

const TOKEN = "TU_TOKEN_DE_ACCESO"; 
const VERIFY_TOKEN = "midtoken123";  // el que vos quieras

// Verificación del webhook
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Recibir mensajes
app.post("/webhook", (req, res) => {
  console.log(JSON.stringify(req.body, null, 2));

  const entry = req.body.entry?.[0];
  const message = entry?.changes?.[0]?.value?.messages?.[0];

  if (message) {
    const from = message.from;  // número del usuario
    const text = message.text?.body;

    console.log(`Mensaje recibido de ${from}: ${text}`);
  }

  res.sendStatus(200);
});

app.listen(3000, () => console.log("Bot funcionando en puerto 3000"));
