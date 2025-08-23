import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, Palette } from "lucide-react";
import { Layout } from "../components/Layout";
import { OrderForm } from "../components/OrderForm";
import { CartCustomization } from "../components/CartCustomization";
import { useCart } from "../contexts/CartContext";
import { getPatternById } from "../data/products";
import { sendOrderWhatsApp } from "@/services/whatsappClient"; // ✅ ajout

export default function Cart() {
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [wantCustomization, setWantCustomization] = useState(false);

  if (state.items.length === 0) {
    return (
      <Layout>
        <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-amber-900 mb-8">
              🛒 Votre Panier
            </h1>
            <div className="text-center py-16">
              <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Votre panier est vide
              </h2>
              <p className="text-gray-600 mb-8">
                Découvrez nos magnifiques poteries artisanales avec variantes de
                tailles et motifs traditionnels !
              </p>
              <Link
                to="/creations"
                className="inline-block bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 px-8 rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                🎨 Découvrir nos créations
              </Link>
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">

          {/* Order Form Modal */}
          {showOrderForm && (
            <OrderForm
              cartItems={state.items}
              total={state.total}
              onClose={() => setShowOrderForm(false)}
              onSubmit={async (customer) => {
                try {
                  const orderData = {
                    orderId: Date.now().toString(),
                    total: state.total,
                    customer,
                    items: state.items.map((item) => ({
                      name: item.product.name,
                      quantity: item.quantity,
                      variantName: item.variantName,
                      variantPrice: item.variantPrice,
                    })),
                  };

                  await sendOrderWhatsApp(orderData);
                  alert("✅ Commande envoyée par WhatsApp !");
                  clearCart();
                  setShowOrderForm(false);
                } catch (err) {
                  alert("❌ Erreur lors de l’envoi de la commande.");
                }
              }}
            />
          )}

          {/* Personnalisation */}
          <div className="mt-6">
            <label htmlFor="wantCustomization" className="text-amber-900 font-semibold flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              🎨 Je souhaite personnaliser mes produits
            </label>
            {wantCustomization && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white rounded-lg p-4 border border-amber-300 mt-4"
              >
                <p className="text-amber-800 mb-4">
                  Personnalisez chacun de vos produits : couleurs, motifs, tailles, et demandes spéciales.
                  Nos artisans adapteront chaque pièce selon vos souhaits !
                </p>
                <button
                  onClick={() => setShowCustomization(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg flex items-center justify-center"
                >
                  <Palette className="w-5 h-5 mr-2" />
                  🎨 Commencer la personnalisation
                </button>
              </motion.div>
            )}
          </div>

          {/* Cart Summary */}
          <div className="bg-gray-50 px-6 py-4 mt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-amber-700">
                {state.total.toFixed(2)} MAD
              </span>
            </div>

            <div className="flex space-x-4">
              <Link
                to="/creations"
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-center"
              >
                ← Continuer les achats
              </Link>
              <button
                onClick={() => setShowOrderForm(true)}
                className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 px-6 rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                🎨 Passer la commande
              </button>
            </div>
          </div>

          {/* Legal Notice */}
          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-800 text-center">
              <strong>🎨 Variantes Personnalisées:</strong> Chaque pièce sera
              fabriquée selon vos spécifications exactes • <strong>📍</strong>{" "}
              Livraison uniquement au Maroc • Délai: 20-45 jours • Paiement
              intégral requis
            </p>
          </div>
        </div>

        {/* Customization Modal */}
        <AnimatePresence>
          {showCustomization && (
            <CartCustomization
              cartItems={state.items}
              onClose={() => setShowCustomization(false)}
            />
          )}
        </AnimatePresence>
      </main>
    </Layout>
  );
}
