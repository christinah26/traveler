import React, { useState } from "react";
import { Send } from 'lucide-react';
import Swal from 'sweetalert2';

function Contact() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    message: ''
  });

  const toggleForm = () => {
    setShowForm((prev) => !prev);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.nom || !formData.email || !formData.message) {
      return Swal.fire({
        position: "top",
        icon: "warning",
        iconColor: "#ffff",
        text: "Veuillez remplir tous les champs du formulaire.",
        confirmButtonText: "OK",
        customClass: {
          popup: "custom-popup",
          confirmButton: "custom-confirm-button"
        }
      });
    }

    console.log("Message envoyé:", formData);
    
    Swal.fire({
      text: "Votre message a été envoyé avec succès !",
      icon: "success",
      iconColor: "#ffff",
      confirmButtonText: "OK",
      customClass: {
        popup: "custom-popup",
        confirmButton: "custom-confirm-button",
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Réinitialiser le formulaire
        setFormData({
          nom: '',
          email: '',
          message: ''
        });
        setShowForm(false);
      }
    });
  };

  return (
    <div className="bg-gradient-to-b from-green-50 to-green-100 p-8 md:p-20 text-center" id="contact">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl md:text-4xl font-bold text-blue-900 mb-4">
          Une question ? Nous sommes là pour vous aider !
        </h2>

        <button
          onClick={toggleForm}
          className="text-2xl md:text-2xl font-bold mb-6 text-blue-900 hover:text-cyan-600 transition-colors duration-300 underline decoration-2 underline-offset-4"
          aria-label="Afficher le formulaire de contact"
          aria-expanded={showForm}
          id="contact-toggle"
        >
          {showForm ? "Masquer le formulaire" : "Contactez-nous"}
        </button>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-2xl p-8 mt-6 max-w-lg mx-auto transform transition-all duration-300"
            id="contact-form"
          >
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2 text-left">
                Nom complet *
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Entrez votre nom"
                id="contact-name"
                required
                className="w-full p-4 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all duration-300"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2 text-left">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="exemple@email.com"
                id="contact-email"
                required
                className="w-full p-4 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all duration-300"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2 text-left">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                id="contact-message"
                placeholder="Écrivez votre message ici..."
                rows="5"
                required
                className="w-full p-4 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all duration-300 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Send className="w-5 h-5" /> Envoyer le message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Contact;