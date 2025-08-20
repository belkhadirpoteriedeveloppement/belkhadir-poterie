import { useState } from "react";

export function OrderForm({ cartItems, total, onClose, onSubmit }) {
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(customer); // ✅ appel du Cart
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-amber-900 mb-4">
          📝 Finaliser votre commande
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nom complet"
            value={customer.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-lg"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Téléphone"
            value={customer.phone}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-lg"
          />
          <textarea
            name="address"
            placeholder="Adresse de livraison"
            value={customer.address}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-lg"
          />

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
            >
              ✅ Confirmer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
