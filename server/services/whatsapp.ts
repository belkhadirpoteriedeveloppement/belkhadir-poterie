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
  private client: twilio.Twilio | null = null;
  private fromNumber: string;
  private toNumber: string;
  private isConfigured: boolean = false;

  constructor() {
    // Initialize Twilio client with environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_FROM_NUMBER || "whatsapp:+14155238886";
    this.toNumber = process.env.TWILIO_TO_NUMBER || "whatsapp:+212675202336";

    if (!accountSid || !authToken) {
      console.warn(
        "🔧 Twilio credentials not found. WhatsApp notifications will be simulated.",
        "\n📝 Pour activer Twilio, configurez :",
        "\n   - TWILIO_ACCOUNT_SID",
        "\n   - TWILIO_AUTH_TOKEN",
        "\n   - TWILIO_FROM_NUMBER (optionnel)",
        "\n   - TWILIO_TO_NUMBER (optionnel)"
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

    // Debug: Log customer data
    console.log("🔍 Debug customer data:", customer);

    let message = `🏺 *COMMANDE ${orderId}*\n\n`;

    // Customer information (shortened)
    message += `👤 ${customer.name} ${customer.surname}\n`;
    message += `📞 ${customer.phone}\n`;
    message += `📧 ${customer.email}\n`;
    message += `📍 ${customer.address}\n\n`;

    // Products (simplified)
    message += `🛒 *ARTICLES:*\n`;
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name}\n`;
      message += `   ${item.variantDetails.sizeName} • ${item.variantDetails.patternName}\n`;
      message += `   ${item.quantity}x • ${item.total.toFixed(2)} MAD\n`;
    });

    // Total and essentials
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

    // Debug: Log message length and content
    console.log(`📏 WhatsApp message length: ${message.length} characters (limit: 1600)`);
    console.log("📝 WhatsApp message content:");
    console.log(message);

    return message;
  }

  async sendOrderNotification(
    orderData: OrderData,
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      if (!this.client) {
        // Simulate sending for development
        const message = this.formatOrderMessage(orderData);
        console.log("📱 WhatsApp Message (SIMULATION):");
        console.log("To:", this.toNumber);
        console.log("Message:");
        console.log(message);

        return {
          success: true,
          message:
            "Order notification simulated successfully (check server logs)",
        };
      }

      const message = this.formatOrderMessage(orderData);

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: this.toNumber,
      });

      console.log("WhatsApp message sent successfully:", result.sid);

      return {
        success: true,
        message: `Order notification sent successfully to ${this.toNumber}`,
      };
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);

      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}
