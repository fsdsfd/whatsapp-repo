import express from "express";
const app = express();
app.use(express.json());
import fetch from "node-fetch";

async function enviarMensaje(numero, texto) {
  await fetch(
    `https://graph.facebook.com/v19.0/${process.env.WA_PHONE_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WA_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: numero,
        text: { body: texto },
      }),
    }
  );
}

const TOKEN = "TU_TOKEN_DE_ACCESO";
const VERIFY_TOKEN = process.env.token;
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
    const from = message.from;
    const text = message.text?.body;

    enviarMensaje(from, "¡Hola! Este es un mensaje automático 😎");
  }

  res.sendStatus(200);
});

app.listen(3000, () => console.log("Bot funcionando en puerto 3000"));
