import url from "./url";

// Pour obtenir la liste des résrvations
export default async function getBookings(
    token: string,
    pays_depart: string,
    pays_arrivee: string
) {
    try {
        const response = await fetch(url + "bookings", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                pays_depart,
                pays_arrivee,
            }),
        });
        const data = await response.json();

        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
}
