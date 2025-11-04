import url from "./url";

// Pour obtenir la liste des hôtels
export default async function getHotels(token: string, pays: string) {
    try {
        const response = await fetch(url + "hotels", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "69420",
            },
            body: JSON.stringify({ pays }),
        });
        const data = await response.json();

        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
}
