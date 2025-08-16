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

    // ✅ Valeurs correctes pour Twilio Sandbox
    this.fromNumber = process.env.TWILIO_FROM_NUMBER || "whatsapp:+14155238886";
    this.toNumber =
      process.env.TWILIO_TO_NUMBER || "whatsapp:+212661724956"; // 👉 remplace par ton numéro WhatsApp validé

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

    // Total et informations importantes
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

    message += `✅ *Action requise:* Contacter le client pour confirmation de la commande`;

    // Log pour debug
    console.log(`📏 Message WhatsApp: ${message.length} caractères`);
    if (message.length > 1600) {
      console.warn("⚠️ Message dépasse la limite WhatsApp de 1600 caractères");
    }

    return message;
  }

  async sendOrderNotification(
    orderData: OrderData
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const message = this.formatOrderMessage(orderData);

      if (!this.isConfigured || !this.client) {
        // Mode simulation pour développement
        console.log("📱 WhatsApp Message (MODE SIMULATION):");
        console.log("📤 Destinataire:", this.toNumber);
        console.log("📝 Message:");
        console.log("─".repeat(50));
        console.log(message);
        console.log("─".repeat(50));

        return {
          success: true,
          message: "✅ Notification simulée (consultez les logs serveur)",
        };
      }

      // Vérifier la longueur du message
      if (message.length > 1600) {
        console.warn("⚠️ Message trop long, troncature possible par WhatsApp");
      }

      // 🔎 Log avant envoi pour debug
      console.log("DEBUG WhatsApp SEND:", {
        from: this.fromNumber,
        to: this.toNumber,
      });

      if (!this.toNumber) {
        throw new Error("❌ Aucun destinataire défini pour WhatsApp (to est vide)");
      }

      console.log("📤 Envoi du message WhatsApp...");

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: this.toNumber,
      });

      console.log("✅ Message WhatsApp envoyé avec succès!");
      console.log("📧 SID:", result.sid);
      console.log("📱 Statut:", result.status);

      return {
        success: true,
        message: `✅ Notification envoyée via WhatsApp (${this.toNumber})`,
      };
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi WhatsApp:", error);

      // Logs d'erreur détaillés pour debug
      if (error instanceof Error) {
        console.error("📝 Message d'erreur:", error.message);
        console.error("🔍 Stack trace:", error.stack);
      }

      return {
        success: false,
        error:
          error instanceof Error
            ? `Erreur WhatsApp: ${error.message}`
            : "Erreur inconnue lors de l'envoi WhatsApp",
      };
    }
  }

  // Méthode utilitaire pour vérifier la configuration
  isReady(): boolean {
    return this.isConfigured && this.client !== null;
  }

  // Méthode pour obtenir les informations de configuration
  getConfigInfo(): {
    isConfigured: boolean;
    fromNumber: string;
    toNumber: string;
  } {
    return {
      isConfigured: this.isConfigured,
      fromNumber: this.fromNumber,
      toNumber: this.toNumber,
    };
  }
}
