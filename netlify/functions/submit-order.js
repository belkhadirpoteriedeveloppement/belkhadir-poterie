// netlify/functions/submit-order.js
const twilio = require("twilio");

exports.handler = async (event) => {
  try {
    const { customer, items, total } = JSON.parse(event.body || "{}");
    
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    
    const body = `Nouvelle commande 🏺\n` +
      `Client: ${customer?.name} (${customer?.phone})\n` +
      `Produits: ${items?.map(i => `${i.qty}x ${i.name} ${i.variant || ""}`).join(", ")}\n` +
      `Total: ${total}`;
    
    await client.messages.create({
      from: process.env.TWILIO_FROM_NUMBER, // ex: "whatsapp:+14155238886" (sandbox)
      to: process.env.TWILIO_TO_NUMBER, // ex: "whatsapp:+2126XXXXXXXX"
      body
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: e.message })
    };
  }
};
