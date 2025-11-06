import url from "./url";

export default async function clients(token: string, id_client: number) {
  try {
    const response = await fetch(url + "client", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
      },
      body: JSON.stringify({
        id_client,
      }),
    });
    
    const data = await response.json();

    console.log("📦 Réponse API client complète:", data);
    console.log("🔍 Premier objet réservation:", data?.reservations?.[0]);
    console.log("🔑 Clés du premier objet:", Object.keys(data?.reservations?.[0] || {}));
    
    // Affiche CHAQUE réservation avec ses clés
    data?.reservations?.forEach((reservation, index) => {
      console.log(`\n📋 Réservation #${index}:`, {
        num_reservation: reservation.num_reservation || reservation.NUM_RESERVATION,
        destination: reservation.destination || reservation.DESTINATION,
        hotel: reservation.hotel || reservation.HOTEL,
        total: reservation.total || reservation.PRIX_TOTAL,
      });
    });

    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}