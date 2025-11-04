import url from "./url";

export default async function rating(
    token: string,
    userRating: {
        num_reservation: number;
        note_hotel: number;
        avis_hotel: string;
        note_compagnie_aerienne_aller: number;
        avis_compagnie_aerienne_aller: string;
        note_compagnie_aerienne_retour: number;
        avis_compagnie_aerienne_retour: string;
    }
) {
    try {
        const response = await fetch(url + "bookings/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "ngrok-skip-browser-warning": "69420",
            },
            body: JSON.stringify(userRating),
        });
        if (!response.ok) return null;
        const data = await response.json();

        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
}
