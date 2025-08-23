// netlify/functions/submit-order.js
const twilio = require("twilio");

exports.handler = async (event) => {
  try {
    const { customer, items, orderTotal } = JSON.parse(event.body);

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_FROM_NUMBER;
    const toNumber = process.env.TWILIO_TO_NUMBER;

    const client = twilio(accountSid, authToken);

    // Format du message WhatsApp
    let message = `🏺 *NOUVELLE COMMANDE*\n\n`;
    message += `👤 ${customer.name} ${customer.surname}\n`;
    message += `📞 ${customer.phone}\n`;
    message += `📍 ${customer.address}\n\n`;

    message += `🛒 *ARTICLES:*\n`;
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.product?.name || "Article"}\n`;
      if (item.variantDetails) {
        message += `   ${item.variantDetails.sizeName || ""} • ${item.variantDetails.patternName || ""}\n`;
      }
      message += `   ${item.quantity}x • ${item.total?.toFixed(2) || 0} MAD\n`;
    });

    message += `\n💰 *TOTAL: ${orderTotal.toFixed(2)} MAD*\n`;
    message += `⏰ Délai: 20-45 jours\n`;
    message += `📦 CTM (frais client)\n\n`;

    message += `📅 ${new Date().toLocaleString("fr-FR", {
      timeZone: "Africa/Casablanca",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })}\n\n`;

    message += `✅ Contacter client pour confirmation`;

    // Envoi via Twilio
    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: toNumber,
    });

    console.log("✅ WhatsApp message sent:", result.sid);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, messageId: result.sid }),
    };
  } catch (error) {
    console.error("❌ Error sending WhatsApp:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
