import twilio from "twilio";

// Types pour le service WhatsApp (compatibles avec les données actuelles)
interface OrderItem {
  product: {
    name: string;
    price: number;
    baseProduct: string;
    category: string;
  };
  quantity: number;
  variantDetails: {
    sizeVariantId: string;
    sizeName: string;
    sizeDescription: string;
    patternId: string;
    patternName: string;
    patternColors: string[];
  };
  total: number;
}

interface CustomerInfo {
  name: string;
  surname: string;
  phone: string;
  email: string;
  address: string;
}

interface OrderData {
  items: OrderItem[];
  orderTotal: number;
  customer: CustomerInfo;
  orderId: string;
}

export class WhatsAppService {
  private client: twilio.Twilio;
  private fromNumber: string;
  private toNumber: string;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886"; // Par défaut sandbox
    this.toNumber = process.env.TWILIO_WHATSAPP_TO || "whatsapp:+212661724956"; // Par défaut ton numéro

    if (!accountSid || !authToken) {
      throw new Error(
        "Les identifiants Twilio ne sont pas configurés. Impossible d'envoyer des messages WhatsApp.",
      );
    }

    this.client = twilio(accountSid, authToken);
  }

  formatOrderMessage(orderData: OrderData): string {
    const { items, orderTotal, customer, orderId } = orderData;

    let message = `🏺 *COMMANDE ${orderId}*\n\n`;

    message += `👤 ${customer.name} ${customer.surname}\n`;
    message += `📞 ${customer.phone}\n`;
    message += `📧 ${customer.email}\n`;
    message += `📍 ${customer.address}\n\n`;

    message += `🛒 *ARTICLES:*\n`;
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name}\n`;
      message += `   ${item.variantDetails.sizeName} • ${item.variantDetails.patternName}\n`;
      message += `   ${item.quantity}x • ${item.total.toFixed(2)} MAD\n`;
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

    return message;
  }

  async sendOrderNotification(
    orderData: OrderData,
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const message = this.formatOrderMessage(orderData);

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: this.toNumber,
      });

      console.log("WhatsApp message envoyé avec succès, SID:", result.sid);

      return {
        success: true,
        message: `Notification de commande envoyée avec succès à ${this.toNumber}`,
      };
    } catch (error) {
      console.error("Erreur lors de l'envoi du message WhatsApp:", error);

      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erreur inconnue lors de l'envoi",
      };
    }
  }
}
