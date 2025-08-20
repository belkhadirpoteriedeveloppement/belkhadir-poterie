interface OrderItem {
  name: string;
  quantity: number;
  variantName: string;
  variantPrice: number;
}

interface OrderData {
  orderId: string;
  total: number;
  customer: {
    name: string;
    surname: string;
    phone: string;
    email: string;
  };
  items: OrderItem[];
}

export async function sendOrderWhatsApp(orderData: OrderData) {
  try {
    const res = await fetch("/api/sendOrder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erreur inconnue");
    console.log("✅ WhatsApp envoyé, SID:", data.sid);
    return data;
  } catch (error: any) {
    console.error("❌ Erreur en envoyant WhatsApp:", error.message);
    throw error;
  }
}
