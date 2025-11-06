import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Calendar,
  CheckCircle,
  Plane,
  XCircle,
  LogOut,
  MessageSquare,
  MapPin,
  Clock,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext.tsx";
import Navbar from "../Top/navbar.jsx";
import Footer from "../Top/footer";
import clients from "../api/client.ts";
import Swal from "sweetalert2";

interface Reservation {
  [key: string]: any;
}

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, id: userId } = useAuth();

  const [userInfo, setUserInfo] = useState<any>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0 });

  // Charge les données du dashboard
  const loadDashboardData = async () => {
    console.log("🔍 Token:", !!token);
    console.log("🔍 User ID:", userId);

    if (!token || !userId) {
      console.log("⚠️ Token ou User ID manquant, skip fetch");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("📡 Fetching dashboard data from client API...");

      const userData = await clients(token, userId);

      if (userData) {
        console.log("👤 User data reçues:", userData);
        console.log("👤 Structure complète userData:", JSON.stringify(userData, null, 2));

        setUserInfo(userData);

        // Récupère les réservations
        const userReservations = userData.reservations || [];
        setReservations(userReservations);

        // Stats
        const total = userData.total || userData.total || userReservations.length;
        const active = userData.active || 0;
        setStats({ total, active });

        console.log("✅ Stats:", { total, active });
        console.log("✅ Réservations:", userReservations.length);
      } else {
        console.log("⚠️ Pas de données utilisateur");
        setUserInfo(null);
        setReservations([]);
      }
    } catch (err) {
      console.error("❌ Erreur API dashboard:", err);
      setUserInfo(null);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  // Charge les données au démarrage
  useEffect(() => {
    
    loadDashboardData();
  }, [token, userId]);

  // Recharge les données après une réservation
  useEffect(() => {
    if (location.pathname === "/home") {
      loadDashboardData();
    }
  }, [location.pathname]);

  const handleLogout = () => {
    console.log("🚪 Déconnexion");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const handleGiveReview = (reservation) => {
    console.log("🔍 DEBUG - Réservation brute:", reservation);
    console.log("🔍 DEBUG - Clés disponibles:", Object.keys(reservation));
    
    // Récupère le num_reservation avec fallback sur les clés en minuscules ET majuscules
    const numReservation = 
      reservation?.NUM_RESERVATION || 
      reservation?.num_reservation || 
      reservation?.id ||
      null;
    
    console.log("🎫 num_reservation trouvé:", numReservation);
    console.log("🔑 Type:", typeof numReservation);
  
    if (!numReservation) {
      console.error("❌ ERREUR: Impossible de trouver le numéro de réservation!");
      console.log("🔍 Contenu complet de la réservation:", JSON.stringify(reservation, null, 2));
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Impossible de récupérer le numéro de réservation",
        confirmButtonText: "OK",
      });
      return;
    }
  
    // Normalise la réservation avec TOUS les champs possibles
    const normalizedReservation = {
      ...reservation,
      // Assure que le num_reservation est correctement défini
      num_reservation: numReservation,
      num_chambre: reservation.num_chambre || reservation.NUM_CHAMBRE,
      date_reservation: reservation.date_reservation || reservation.DATE_RESERVATION || new Date().toISOString(),
      debut_sejour: reservation.debut_sejour || reservation.DEBUT_SEJOUR,
      duree_sejour: reservation.duree_sejour || reservation.DUREE_SEJOUR || 0,
      destination: reservation.destination || reservation.DESTINATION || "",
      pays_depart: reservation.pays_depart || reservation.PAYS_DEPART || "",
      compagnie_aerienne_aller: reservation.compagnie_aerienne_aller || reservation.COMPAGNIE_AERIENNE_ALLER || "",
      compagnie_aerienne_retour: reservation.compagnie_aerienne_retour || reservation.COMPAGNIE_AERIENNE_RETOUR || "",
      prix_aller: reservation.prix_aller || reservation.PRIX_ALLER || "0",
      prix_retour: reservation.prix_retour || reservation.PRIX_RETOUR || "0",
      prix_chambre: reservation.prix_chambre || reservation.PRIX_CHAMBRE || "0",
      prix_total: reservation.prix_total || reservation.total || reservation.PRIX_TOTAL || "0",
      hotel: reservation.hotel || {},
    };
  
    console.log("✅ Réservation normalisée:", normalizedReservation);
    console.log("📝 Redirection vers avis pour réservation #:", normalizedReservation.num_reservation);
  
    // Stocke en localStorage comme fallback
    localStorage.setItem("tempReservationData", JSON.stringify(normalizedReservation));
    localStorage.setItem("tempReservationId", String(normalizedReservation.num_reservation));
  
    // Navigue vers l'Avis avec la réservation complète
    navigate("/avis", { state: { reservation: normalizedReservation } });
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle className="text-green-600" size={20} />
    ) : (
      <XCircle className="text-red-600" size={20} />
    );
  };

  const isReservationActive = (debut: string, duree: number) => {
    try {
      const dateDebut = new Date(debut);
      const dateFin = new Date(dateDebut);
      dateFin.setDate(dateDebut.getDate() + duree);
      return dateFin > new Date();
    } catch {
      return false;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr || "N/A";
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="ml-4 text-gray-600">Chargement de votre dashboard...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 pt-20 pb-10">
        {/* HEADER */}
        <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white py-12 px-6 shadow-lg">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="bg-white/20 p-5 rounded-full">
                <User size={48} />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Bienvenue, Voyageur</h1>
                <p className="text-lg text-white/80 mt-1">Gérez vos réservations</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-5 py-3 rounded-full font-semibold transition-all"
            >
              <LogOut size={20} />
              Déconnexion
            </button>
          </div>
        </header>

        {/* STATISTIQUES */}
        <section className="max-w-7xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-600">
                Total Réservations
              </h3>
              <Calendar className="text-blue-600" size={30} />
            </div>
            <p className="text-4xl font-bold text-gray-900">{stats.total}</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-600">
                Réservations Actives
              </h3>
              <CheckCircle className="text-green-600" size={30} />
            </div>
            <p className="text-4xl font-bold text-gray-900">{stats.active}</p>
          </div>
        </section>

        {/* MES RÉSERVATIONS */}
        <section className="max-w-7xl mx-auto mt-16 px-6 pb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Mes Réservations
          </h2>

          {reservations.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              {reservations.map((r, i) => {
                const debut = r.debut_sejour || r.DEBUT_SEJOUR || "";
                const duree = r.duree_sejour || r.DUREE_SEJOUR || 0;
                const destination = r.destination || r.DESTINATION || "Destination";
                const hotelNom = r.hotel?.nom || r.hotel || r.HOTEL || r.hotel_nom || "N/A";
                const numReservation = r.num_reservation || r.NUM_RESERVATION || i + 1;
                const paysDepart = r.pays_depart || r.PAYS_DEPART || "N/A";
                const compAller = r.compagnie_aerienne_aller || r.COMPAGNIE_AERIENNE_ALLER || "N/A";
                const compRetour = r.compagnie_aerienne_retour || r.COMPAGNIE_AERIENNE_RETOUR || "N/A";
                const prixAller = r.prix_aller || r.PRIX_ALLER || "0";
                const prixRetour = r.prix_retour || r.PRIX_RETOUR || "0";
                const prixChambre = r.prix_chambre || r.PRIX_CHAMBRE || "0";
                const prixTotal = r.prix_total || r.total || r.PRIX_TOTAL || "0";
                const nbEtoile = r.hotel?.nb_etoile || r.nb_etoile || 0;

                const isActive = isReservationActive(debut, duree);

                return (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all flex flex-col"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4 mb-6">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="bg-blue-100 p-4 rounded-xl">
                          <Plane className="text-blue-600" size={28} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800">
                            {destination}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin size={14} />
                            De {paysDepart} • Réservation #{numReservation}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(
                          isActive
                        )}`}
                      >
                        {getStatusIcon(isActive)} {isActive ? "Active" : "Terminée"}
                      </span>
                    </div>

                    {/* Contenu principal en grille */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      {/* Vol Aller */}
                      <div className="border-l-4 border-blue-500 pl-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                          ✈️ Vol Aller
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          {compAller}
                        </p>
                        <p className="text-sm text-blue-600 font-bold mt-1">
                          {prixAller}€
                        </p>
                      </div>

                      {/* Vol Retour */}
                      <div className="border-l-4 border-purple-500 pl-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                          ✈️ Vol Retour
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          {compRetour}
                        </p>
                        <p className="text-sm text-purple-600 font-bold mt-1">
                          {prixRetour}€
                        </p>
                      </div>

                      {/* Hôtel */}
                      <div className="border-l-4 border-green-500 pl-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                          🏨 Hôtel
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          {hotelNom}
                        </p>
                        {nbEtoile > 0 && (
                          <p className="text-xs text-gray-600">⭐ {nbEtoile}</p>
                        )}
                        <p className="text-sm text-green-600 font-bold mt-1">
                          {prixChambre}€/nuit
                        </p>
                      </div>
                    </div>

                    {/* Détails du séjour */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                      <div>
                        <span className="text-gray-600">Début du séjour</span>
                        <p className="font-semibold text-gray-800">
                          {formatDate(debut)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Durée</span>
                        <p className="font-semibold text-gray-800 flex items-center gap-1">
                          <Clock size={16} /> {duree} jours
                        </p>
                      </div>
                    </div>

                    {/* Total et Bouton */}
                    <div className="border-t pt-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-3xl font-bold text-gray-900">
                          {prixTotal}€
                        </p>
                      </div>
                      <button
                          onClick={() => handleGiveReview(r)}
                          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all"
                        >
                          <MessageSquare size={18} />
                          Donner un avis
                        </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl text-center shadow-md">
              <Plane className="mx-auto mb-4 text-gray-400" size={64} />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Aucune réservation
              </h3>
              <p className="text-gray-600 mb-6">
                Vous n'avez pas encore de réservation. Commencez votre aventure !
              </p>
              <button
                onClick={() => navigate("/formulaire")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
              >
                Réserver un voyage
              </button>
            </div>
          )}
        </section>

        <Footer />
      </div>
    </>
  );
}

export default Dashboard;