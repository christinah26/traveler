import url from "./url";

// Pour créer une réservation
export default async function createBookings(
    token: string,
    num_vol: number,
    num_vol_retourner: number,
    num_chambre: number,
    id_client: number,
    code: string // "IND" ou "GRP"
) {
    try {
        const response = await fetch(url + "bookings/add", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "69420",
            },
            body: JSON.stringify({
                num_vol,
                num_vol_retourner,
                num_chambre,
                id_client,
                code,
            }),
        });
        const data = await response.json();

        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
}
