// netlify/functions/submit-order.js
const twilio = require("twilio");

// Générer un ID de commande unique
const generateOrderId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `BPK-${timestamp}-${random}`.toUpperCase();
};

// Validation basique des données
const validateOrderData = (data) => {
  if (!data.customer || !data.items || !Array.isArray(data.items)) {
    throw new Error("Données de commande invalides");
  }
  
  if (!data.customer.name || !data.customer.surname || !data.customer.phone) {
    throw new Error("Informations client incomplètes");
  }
  
  if (data.items.length === 0) {
    throw new Error("Aucun article dans la commande");
  }
  
  return true;
};

// Formater le message WhatsApp selon l'API existante
const formatOrderMessage = (orderData) => {
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
    const colors = item.variantDetails?.patternColors?.join(', ') || '';
    message += `${index + 1}. *${item.product.name}*\n`;
    message += `   📏 ${item.variantDetails?.sizeName || 'Taille standard'}\n`;
    message += `   🎨 ${item.variantDetails?.patternName || 'Motif standard'}\n`;
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

  return message;
};

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: 'Method not allowed' 
      })
    };
  }

  try {
    const orderData = JSON.parse(event.body || "{}");
    
    console.log("📦 Received order submission with variants:", orderData);
    
    // Validation basique
    validateOrderData(orderData);
    
    // Vérifier le calcul du total
    const calculatedTotal = orderData.items.reduce((sum, item) => sum + item.total, 0);
    
    if (Math.abs(calculatedTotal - orderData.orderTotal) > 0.01) {
      console.error("❌ Total mismatch:", {
        calculated: calculatedTotal,
        provided: orderData.orderTotal,
      });
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Erreur de calcul du total",
        })
      };
    }
    
    // Générer un ID de commande unique
    const orderId = generateOrderId();
    
    // Préparer les données enrichies pour WhatsApp
    const enrichedOrderData = {
      ...orderData,
      orderId,
    };
    
    // Initialiser Twilio
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    
    // Formater et envoyer le message WhatsApp
    const message = formatOrderMessage(enrichedOrderData);
    
    console.log("📱 Sending WhatsApp notification to vendor...");
    
    await client.messages.create({
      from: process.env.TWILIO_FROM_NUMBER,
      to: process.env.TWILIO_TO_NUMBER,
      body: message
    });
    
    console.log("✅ Order processed successfully");
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Commande reçue avec succès ! Vous serez contacté bientôt.",
        orderId,
        whatsAppStatus: "Notification envoyée au vendeur",
        emailStatus: "Email service disabled"
      })
    };
    
  } catch (error) {
    console.error("❌ Error processing order:", error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message || "Erreur serveur lors du traitement de la commande",
      })
    };
  }
};
