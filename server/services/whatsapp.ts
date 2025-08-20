// WhatsAppService.ts
import twilio from "twilio";

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
  private fromNumber: string = "whatsapp:+14155238886";
  private toNumber: string = "whatsapp:+16266354931";

  constructor() {
    const accountSid = "AC46c15cc5db07935af2e72fa697f8c335";
    const authToken = "b6e105e3ed7e8e3b2023e9d9a4ba438c";

    this.client = twilio(accountSid, authToken);
    console.log("✅ Twilio WhatsApp service prêt");
    console.log(`📱 Envoi des messages vers ${this.toNumber}`);
  }

  formatOrderMessage(orderData: OrderData): string {
    const { items, orderTotal, customer, orderId } = orderData;

    let message = `🏺 *NOUVELLE COMMANDE*\n`;
    message += `📋 Commande: *${orderId}*\n\n`;
    message += `👤 *CLIENT:*\n${customer.surname} ${customer.name}\n📞 ${customer.phone}\n📧 ${customer.email}\n📍 ${customer.address}\n\n`;
    message += `🛒 *ARTICLES:*\n`;

    items.forEach((item, index) => {
      const colors = item.variantDetails.patternColors.join(", ");
      message += `${index + 1}. *${item.product.name}*\n`;
      message += `   📏 ${item.variantDetails.sizeName}\n`;
      message += `   🎨 ${item.variantDetails.patternName}\n`;
      if (colors) message += `   🌈 ${colors}\n`;
      message += `   📦 ${item.quantity}x - ${item.total.toFixed(2)} MAD\n\n`;
    });

    message += `💰 *TOTAL: ${orderTotal.toFixed(2)} MAD*\n\n`;
    message += `⏰ *Délai:* 20-45 jours ouvrables\n📦 *Livraison:* CTM (frais client)\n📅 *Reçu le:* ${new Date().toLocaleString("fr-FR", {timeZone: "Africa/Casablanca", day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit"})}\n\n`;
    message += `✅ *Action requise:* Contacter le client pour confirmation de la commande`;

    return message;
  }

  async sendOrderNotification(orderData: OrderData): Promise<boolean> {
    try {
      const message = this.formatOrderMessage(orderData);

      if (!this.toNumber) {
        console.error("❌ Destinataire WhatsApp non défini");
        return false;
      }

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: this.toNumber,
      });

      console.log("✅ Message envoyé via WhatsApp");
      console.log("📧 SID:", result.sid);
      console.log("📱 Statut:", result.status);

      return true;
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi WhatsApp:", error);
      return false;
    }
  }
}

// Export singleton
export const whatsappService = new WhatsAppService();      day: "2-digit",
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
