// import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from "../assets/traveler-nobg.png";
import Field from "../components/champ";
import Date from "../components/date";
import Retour from "../components/retour";
import { Hotel, Mail, MapPin, Phone, Plane, Send, UserPen, X, Coins, Bed, Calendar } from "lucide-react";
import Swal from "sweetalert2";
import "../components/popup";
import pays from '../utils/pays';

interface FormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  destination: string;
  budget: string;
  hotel: string;
  compagnie: string;
  room: string;
  date: string;
  dateDebut?: string;
  dateFin?: string;
  pays: {
    CODE: string;
    NOM: string;
  };
}

function Formulaire() {
  const navigate = useNavigate();

  //  données du localStorage en récupération
  const storedData = JSON.parse(localStorage.getItem("formData") || "{}");

  const [formData, setFormData] = useState<FormData>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    destination: storedData.destination || '',
    budget: storedData.budget || '',
    hotel: storedData.hotel || '',
    compagnie: storedData.compagnie || '',
    room: 'standard',
    date: '',
    pays: {
      CODE: "AD",
      NOM: "Andorre",
    },
  });

  // Mise à jour du localStorage quand les données changent
  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify({
      destination: formData.destination,
      budget: formData.budget,
      hotel: formData.hotel,
      compagnie: formData.compagnie
    }));
  }, [formData.destination, formData.budget, formData.hotel, formData.compagnie]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleHotelSelect = () => {
    if (!formData.destination || !formData.budget) {
      Swal.fire({
        position: "top",
        icon: "warning",
        iconColor: "#ffff",
        text: "Veuillez d'abord choisir une destination et un budget.",
        confirmButtonText: "OK",
        customClass: {
          popup: "custom-popup",
          confirmButton: "custom-confirm-button"
        }
      });
      return;
    }
    navigate("/pages/hotels");
  };

  const handleCompagnieSelect = () => {
    if (!formData.destination || !formData.budget) {
      Swal.fire({
        position: "top",
        icon: "warning",
        iconColor: "#ffff",
        text: "Veuillez d'abord choisir une destination et un budget.",
        confirmButtonText: "OK",
        customClass: {
          popup: "custom-popup",
          confirmButton: "custom-confirm-button"
        }
      });
      return;
    }
    navigate("/pages/compagnies");
  };

  const resetHotel = () => {
    setFormData(prev => ({ ...prev, hotel: '' }));
  };

  const resetCompagnie = () => {
    setFormData(prev => ({ ...prev, compagnie: '' }));
  };

  const handleSubmit = () => {
    if (!formData.nom || !formData.prenom || !formData.email || !formData.telephone ||
      !formData.destination || !formData.budget || !formData.hotel || !formData.compagnie ||
      !formData.room ) {
      return (
        Swal.fire({
          position: "top",
          icon: "warning",
          iconColor: "#ffff",
          text: "Veuillez remplir tous les champs obligatoires",
          confirmButtonText: "OK",
          customClass: {
            popup: "custom-popup",
            confirmButton: "custom-confirm-button"
          }
        })
      );
    }
    Swal.fire({
      text: "Votre demande de réservation a été envoyée avec succès !",
      icon: "success",
      iconColor: "#ffff",
      confirmButtonText: "OK",
      allowEscapeKey: false,
      allowOutsideClick: false,
      customClass: {
        popup: "custom-popup",
        confirmButton: "custom-confirm-button",
      }
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("formData");
        navigate("/");
      }
    });
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
            {/* Nom et Prénom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Nom" icon={UserPen} id="nom" name="nom" value={formData.nom} onChange={handleChange} placeholder="Votre nom" />
              <Field label="Prénom" icon={UserPen} id="prenom" name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Votre prénom" />
            </div>

            {/* Email et Téléphone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="E-Mail" icon={Mail} id="email" name="email" value={formData.email} onChange={handleChange} placeholder="exemple@gmail.com" />
              <Field label="Téléphone" icon={Phone} id="telephone" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="+261 XX XXX XX" />
            </div>

            {/* Destination et Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* <Field label="Destination" icon={MapPin} id="destination" name="destination" value={formData.destination} onChange={handleChange} placeholder="Destination choisie" /> */}
              <div>
                <label htmlFor="room" className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1"/>Destination *</label>
                <select
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  value={formData.pays?.CODE}
                  onChange={(e) => {
                      setFormData({
                          ...formData,
                          pays: {
                              CODE: pays.find(
                                  (c) => c.CODE === e.target.value
                              )!.CODE,
                              NOM: pays.find(
                                  (c) => c.CODE === e.target.value
                              )!.NOM,
                          },
                      });
                  }}
                >
                  {pays.map((p) => (
                      <option key={p.CODE} value={p.CODE}>
                          {p.NOM}
                      </option>
                  ))}
                </select>
              </div>
              
              <Field label="Budget (€)" icon={Coins} id="budget" name="budget" type="number" value={formData.budget} onChange={handleChange} placeholder="Votre budget" />
            </div>

            {/* Hôtel et Compagnie */}
            {formData.budget && (
              <div className="space-y-4">
                {/* Hôtel */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Hotel className="inline w-4 h-4 mr-1"/>
                    Hôtel choisi *</label>
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
                      {/* <Hotel size={20} /> */}
                      Choisir un hôtel
                    </button>
                  )}
                </div>

                {/* Compagnie aérienne */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Plane className="inline w-4 h-4 mr-1"/>
                    Compagnie aérienne choisie *</label>
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
                      {/* <Plane size={20} /> */}
                      Choisir une compagnie aérienne
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Type de chambre */}
            <div>
              <label htmlFor="room" className="block text-sm font-semibold text-gray-700 mb-2">
                <Bed className="inline w-4 h-4 mr-1"/>
                Type de chambre *</label>
              <select
                name="room"
                id="room"
                value={formData.room}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              >
                <option value="standard">Standard</option>
                <option value="superieur">Supérieur</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
                <option value="présidentielle">Présidentielle</option>
                <option value="simple">Simple</option>
                <option value="double">Double</option>
                <option value="triple">Triple</option>
                <option value="familiale">Familiale</option>
              </select>
            </div>

            {/* Dates */}
            {/* <Date dateDebut={formData.dateDebut} dateFin={formData.dateFin} onChange={handleChange} /> */}
            <Field label="Durée du séjour" icon={Calendar} id="date" name="date" type="number" value={formData.date} onChange={handleChange} placeholder="Jours de séjour" />

            {/* Boutons */}
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

        <p className="text-center text-white text-sm mt-6">* Tous les champs sont obligatoires</p>
      </div>
    </div>
  );
}

export default Formulaire;