import express from "express";
import fetch from "node-fetch";
const app = express();
app.use(express.json());


const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

async function enviarMensaje(numero, texto) {
  const respuesta = await fetch(
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
        type: "text",
        text: { body: texto },
      }),
    }
  );

  const data = await respuesta.text();
  console.log("Respuesta de WhatsApp:", data);
}

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

app.post("/webhook", async (req, res) => {
  console.log("BODY RECIBIDO:", JSON.stringify(req.body, null, 2));

  const entry = req.body.entry?.[0];
  const message = entry?.changes?.[0]?.value?.messages?.[0];

  if (message) {
    const from = message.from;
    const text = message.text?.body;

    await enviarMensaje(from, "¡Hola! Este es un mensaje automático 😎");
  }

  res.sendStatus(200);
});

app.listen(3000, () => console.log("Bot funcionando en puerto 3000"));