import twilio from "twilio";

// Types pour le service WhatsApp (côté vendeur)
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
  private client: twilio.Twilio | null = null;
  private fromNumber: string;
  private toNumber: string;
  private isConfigured: boolean = false;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    this.fromNumber =
      process.env.TWILIO_FROM_NUMBER ||
      process.env.TWILIO_WHATSAPP_FROM ||
      "whatsapp:+14155238886";
    this.toNumber =
      process.env.TWILIO_TO_NUMBER ||
      process.env.TWILIO_WHATSAPP_TO ||
      "whatsapp:+212661724956";

    if (!accountSid || !authToken) {
      console.warn(
        "🔧 Twilio credentials not found. WhatsApp notifications seront simulées."
      );
      return;
    }

    try {
      this.client = twilio(accountSid, authToken);
      this.isConfigured = true;
      console.log("✅ Twilio WhatsApp service configuré avec succès");
      console.log(`📱 Messages envoyés de ${this.fromNumber} vers ${this.toNumber}`);
    } catch (error) {
      console.error("❌ Erreur lors de l'initialisation Twilio:", error);
    }
  }

  formatOrderMessage(orderData: OrderData): string {
    const { items, orderTotal, customer, orderId } = orderData;

    let message = `🏺 *NOUVELLE COMMANDE*\n`;
    message += `📋 Commande: *${orderId}*\n\n`;

    // Informations client
    message += `👤 *CLIENT:*\n`;
    message += `${customer.surname} ${customer.name}\n`;
    message += `📞 ${customer.phone}\n`;
    message += `📧 ${customer.email}\n`;
    message += `📍 ${customer.address}\n\n`;

    // Articles commandés
    message += `🛒 *ARTICLES:*\n`;
    items.forEach((item, index) => {
      const colors = item.variantDetails.patternColors.join(", ");
      message += `${index + 1}. *${item.product.name}*\n`;
      message += `   📏 ${item.variantDetails.sizeName}\n`;
      message += `   🎨 ${item.variantDetails.patternName}\n`;
      if (colors) message += `   🌈 ${colors}\n`;
      message += `   📦 ${item.quantity}x - ${item.total.toFixed(2)} MAD\n\n`;
    });

    // Total
    message += `💰 *TOTAL: ${orderTotal.toFixed(2)} MAD*\n\n`;
    message += `⏰ *Délai:* 20-45 jours ouvrables\n`;
    message += `📦 *Livraison:* CTM (frais client)\n`;
    message += `📅 *Reçu le:* ${new Date().toLocaleString("fr-FR", {
      timeZone: "Africa/Casablanca",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}\n\n`;

    message += `✅ *Action requise:* Contacter le client pour confirmation`;

    return message;
  }

  async sendOrderNotification(orderData: OrderData): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const message = this.formatOrderMessage(orderData);

      if (!this.isConfigured || !this.client) {
        console.log("📱 WhatsApp Message (MODE SIMULATION):");
        console.log("📤 Destinataire:", this.toNumber);
        console.log("📝 Message:", message);
        return { success: true, message: "✅ Notification simulée" };
      }

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: this.toNumber,
      });

      console.log("✅ Message WhatsApp envoyé avec succès!", result.sid);

      return { success: true, message: `✅ Notification envoyée via WhatsApp` };
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi WhatsApp:", error);
      return { success: false, error: error instanceof Error ? error.message : "Erreur inconnue" };
    }
  }

  isReady(): boolean {
    return this.isConfigured && this.client !== null;
  }

  getConfigInfo(): { isConfigured: boolean; fromNumber: string; toNumber: string } {
    return {
      isConfigured: this.isConfigured,
      fromNumber: this.fromNumber,
      toNumber: this.toNumber,
    };
  }
}
