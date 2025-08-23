import React, { useState } from "react";

const OrderForm: React.FC = () => {
  const [customer, setCustomer] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    address: "",
  });

  const [items, setItems] = useState<any[]>([]); // tes articles de commande
  const [orderTotal, setOrderTotal] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const customerOrderData = {
      customer,
      items,
      orderTotal,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerOrderData),
      });

      const data = await res.json();
      console.log("✅ Order submitted:", data);
      alert("Commande envoyée avec succès !");
    } catch (error) {
      console.error("❌ Error submitting order:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Prénom"
        value={customer.name}
        onChange={handleChange}
        required
      />
      <input
        name="surname"
        placeholder="Nom"
        value={customer.surname}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={customer.email}
        onChange={handleChange}
        required
      />
      <input
        name="phone"
        placeholder="Téléphone"
        value={customer.phone}
        onChange={handleChange}
        required
      />
      <textarea
        name="address"
        placeholder="Adresse complète"
        value={customer.address}
        onChange={handleChange}
        required
      />
      <button type="submit">Commander</button>
    </form>
  );
};

export default OrderForm;
