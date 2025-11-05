import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Calendar,
  CheckCircle,
  Plane,
  XCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext.tsx";
import Navbar from "../Top/navbar.jsx";
import Footer from "../Top/footer";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
} from "recharts";
import getBookings from "../api/Bookings.ts";

interface Reservation {
  categorie: string;
  pays_depart: string;
  destination: string;
  hotel: string;
  compagnie_aerienne_aller: string;
  prix_aller: string;
  compagnie_aerienne_retour?: string;
  prix_retour?: string;
  categorie_chambre: string;
  prix_chambre: string;
  debut_sejour: string;
  duree_sejour: number;
  total: string;
}

function Dashboard() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [userInfo, setUserInfo] = useState<any>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalReservations: 0, reservationsActives: 0 });
  const [chartData, setChartData] = useState<any[]>([]);

  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("👤 User:", user);
    setUserInfo(user);
  }, []);

 
  useEffect(() => {
    const fetchBookings = async () => {
      console.log("🔍 Token:", token);
      
      //  SI PAS DE TOKEN, on arrête le loading et on affiche "pas de réservations"
      if (!token) {
        console.log("⚠️ Pas de token, skip fetch");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("📡 Fetching bookings...");
        const data = await getBookings(token, "", "");
        console.log("📦 Bookings reçus:", data);

        if (data?.reservations && Array.isArray(data.reservations)) {
          const userReservations = data.reservations;
          setReservations(userReservations);

          // Stats
          const total = userReservations.length;
          const actives = userReservations.filter(r => {
            const dateFin = new Date(r.debut_sejour);
            dateFin.setDate(dateFin.getDate() + r.duree_sejour);
            return dateFin > new Date();
          }).length;

          setStats({ totalReservations: total, reservationsActives: actives });

          // Graphique
          const yearCount: { [key: string]: number } = {};
          userReservations.forEach(r => {
            const year = new Date(r.debut_sejour).getFullYear().toString();
            yearCount[year] = (yearCount[year] || 0) + 1;
          });

          const chart = Object.entries(yearCount).map(([année, reservation]) => ({
            année,
            reservation,
          }));
          setChartData(chart.sort((a, b) => a.année.localeCompare(b.année)));
          
          console.log("✅ Stats:", { total, actives });
        } else {
          console.log("⚠️ Pas de réservations dans la réponse");
          setReservations([]);
        }
      } catch (err) {
        console.error("❌ Erreur API bookings:", err);
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  const handleLogout = () => {
    console.log("🚪 Déconnexion");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
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
                <h1 className="text-4xl font-bold">
                  Bienvenue, {userInfo?.prenom || userInfo?.nom || "Voyageur"}
                </h1>
                <p className="text-lg text-white/80 mt-1">
                  {userInfo?.email || ""}
                </p>
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
            <p className="text-4xl font-bold text-gray-900">{stats.totalReservations}</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-600">
                Réservations Actives
              </h3>
              <CheckCircle className="text-green-600" size={30} />
            </div>
            <p className="text-4xl font-bold text-gray-900">{stats.reservationsActives}</p>
          </div>
        </section>

        {/* GRAPHIQUES */}
        <section className="max-w-7xl mx-auto mt-12 px-6">
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all">
            <h3 className="text-xl font-bold mb-6 text-gray-800">
              Réservations par année
            </h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="année" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="reservation" fill="#3b82f6" name="Réservations" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-10">
                Aucune donnée pour le graphique
              </p>
            )}
          </div>
        </section>

        {/* DERNIÈRES RÉSERVATIONS */}
        <section className="max-w-7xl mx-auto mt-16 px-6 pb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Mes Réservations
          </h2>

          {reservations.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reservations.slice(0, 6).map((r, i) => {
                const dateDebut = new Date(r.debut_sejour);
                const dateFin = new Date(dateDebut);
                dateFin.setDate(dateDebut.getDate() + r.duree_sejour);
                const isActive = dateFin > new Date();

                return (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all"
                  >
                    <div className="flex justify-between items-center flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-4 rounded-xl">
                          <Plane className="text-blue-600" size={28} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {r.destination}
                          </h3>
                          <p className="text-gray-600">
                            {dateDebut.toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {r.total} $
                        </p>
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                            isActive
                          )}`}
                        >
                          {getStatusIcon(isActive)} {isActive ? "Active" : "Terminée"}
                        </span>
                      </div>
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
