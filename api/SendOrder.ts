import type { VercelRequest, VercelResponse } from "@vercel/node";
import twilio from "twilio";

interface OrderData {
  orderId: string;
  total: number;
  customer: {
    name: string;
    surname: string;
    phone: string;
    email: string;
  };
  items: {
    name: string;
    quantity: number;
    variantName: string;
    variantPrice: number;
  }[];
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const orderData: OrderData = req.body;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;
  const toNumber = process.env.TWILIO_TO_NUMBER;

  if (!accountSid || !authToken || !fromNumber || !toNumber) {
    return res.status(500).json({ error: "Twilio non configuré" });
  }

  const client = twilio(accountSid, authToken);

  let message = `🏺 Nouvelle commande: ${orderData.orderId}\n`;
  message += `Client: ${orderData.customer.surname} ${orderData.customer.name}\n`;
  message += `Téléphone: ${orderData.customer.phone}\n`;
  message += `Total: ${orderData.total.toFixed(2)} MAD\n`;
  message += `Articles:\n`;
  orderData.items.forEach((item, i) => {
    message += `${i + 1}. ${item.name} - ${item.variantName} x${item.quantity} - ${item.variantPrice.toFixed(2)} MAD\n`;
  });

  try {
    const sent = await client.messages.create({
      body: message,
      from: fromNumber,
      to: toNumber,
    });
    return res.status(200).json({ success: true, sid: sent.sid });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
