import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/traveler-nobg.png";
import Field from "../components/champ";
import Retour from "../components/retour";
import { Hotel, MapPin, Plane, Send, X, Calendar } from "lucide-react";
import pays from "../utils/pays";
import createBooking from "../api/AddBooking";
import { useAuth } from "../contexts/AuthContext"; 

interface FormData {
  destination: string;
  hotel: string;
  compagnie: string;
  date: string;
  pays: {
    CODE: string;
    NOM: string;
  };
}

export default function Formulaire() {
  

  const navigate = useNavigate();
  const { token  } = useAuth(); 

  const storedData = JSON.parse(localStorage.getItem("formData") || "{}");
  const [formData, setFormData] = useState<FormData>({
    destination: storedData.destination || "",
    hotel: storedData.hotel || "",
    compagnie: storedData.compagnie || "",
    date: "",
    pays: { CODE: "AD", NOM: "Andorre" },
  });

  useEffect(() => {
    localStorage.setItem(
      "formData",
      JSON.stringify({
        destination: formData.destination,
        hotel: formData.hotel,
        compagnie: formData.compagnie,
      })
    );
  }, [formData.destination, formData.hotel, formData.compagnie]);

  const resetHotel = () => setFormData((prev) => ({ ...prev, hotel: "" }));
  const resetCompagnie = () => setFormData((prev) => ({ ...prev, compagnie: "" }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHotelSelect = () => navigate("/pages/hotels");
  const handleCompagnieSelect = () => navigate("/pages/compagnies");

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    console.log(" Token:", token);
    console.log("User:", user);

    if (!token || !user?.id) {
      console.log("Non connecté. Redirection vers login...");
      navigate("/login");
      return;
    }

    if (!formData.destination || !formData.hotel || !formData.compagnie || !formData.date) {
      console.log("Champs obligatoires manquants !");
      return;
    }

    const selectedHotel = JSON.parse(localStorage.getItem("selectedHotel") || "{}");
    const selectedFlight = JSON.parse(localStorage.getItem("selectedFlight") || "{}");

    console.log(" Hotel:", selectedHotel);
    console.log("Vol:", selectedFlight);

    if (!selectedHotel?.num_chambre || !selectedFlight?.num_vol) {
      console.log("Réservation incomplète");
      return;
    }

    const num_vol = selectedFlight.num_vol;
    const num_vol_retourner = selectedFlight.num_vol_retourner || 0;
    const num_chambre = selectedHotel.num_chambre;
    const id_client = user.id;
    const code = "IND";

    try {
      console.log("Envoi réservation...", { num_vol, num_vol_retourner, num_chambre, id_client, code });
      
      const response = await createBooking(
        token, 
        num_vol,
        num_vol_retourner,
        num_chambre,
        id_client,
        code
      );

      console.log("Réponse:", response);

      if (response && response.success) {
        console.log("Réservation créée avec succès !");
        localStorage.removeItem("formData");
        localStorage.removeItem("selectedHotel");
        localStorage.removeItem("selectedFlight");
        navigate("/home");
      } else {
        console.log("Erreur lors de la réservation:", response?.message);
      }
    } catch (error) {
      console.error("Erreur lors de la réservation:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-200 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-50 bg-white rounded-full shadow-lg mb-4">
            <img src={Logo} alt="Logo" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Réservez votre voyage</h1>
          <p className="text-blue-50 text-lg">Remplissez le formulaire pour démarrer votre aventure</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="destination" className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Destination *
                </label>
                <select
                  name="destination"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  value={formData.pays?.CODE}
                  onChange={(e) => {
                    const selected = pays.find((c) => c.CODE === e.target.value);
                    if (selected) {
                      setFormData((prev) => ({
                        ...prev,
                        pays: { CODE: selected.CODE, NOM: selected.NOM },
                      }));
                    }
                  }}
                >
                  {pays.map((p) => (
                    <option key={p.CODE} value={p.CODE}>
                      {p.NOM}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Hotel className="inline w-4 h-4 mr-1" />
                    Hôtel choisi *
                  </label>
                  {formData.hotel ? (
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={formData.hotel}
                        readOnly
                        className="flex-grow px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50"
                      />
                      <button
                        onClick={resetHotel}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        type="button"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleHotelSelect}
                      type="button"
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Choisir un hôtel
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Plane className="inline w-4 h-4 mr-1" />
                    Compagnie aérienne choisie *
                  </label>
                  {formData.compagnie ? (
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={formData.compagnie}
                        readOnly
                        className="flex-grow px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50"
                      />
                      <button
                        onClick={resetCompagnie}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        type="button"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleCompagnieSelect}
                      type="button"
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Choisir une compagnie
                    </button>
                  )}
                </div>
              </div>
            </div>

            <Field
              label="Durée du séjour"
              icon={Calendar}
              id="date"
              name="date"
              type="number"
              value={formData.date}
              onChange={handleChange}
              placeholder="Jours de séjour"
            />

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Retour />
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
              >
                <Send className="w-5 h-5" /> Envoyer
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-white text-sm mt-6">
          * Tous les champs sont obligatoires
        </p>
      </div>
    </div>
  );
}