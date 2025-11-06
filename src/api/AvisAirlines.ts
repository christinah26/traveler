import url from "./url";

// Pour obtenir l' avis des compagnies aériennes
export default async function AvisAirlines(token: string, id: number) {
    try {
        const response = await fetch(url + "airlines/rating", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "69420",
            },
            body: JSON.stringify({ id }),
        });
        const data = await response.json();

        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
}
