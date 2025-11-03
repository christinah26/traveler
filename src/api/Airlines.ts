import url from "./url";

// Pour obtenir la liste des compagnies aériennes avec leurs pays désservis
export default async function getAirlines(token: string) {
    try {
        const response = await fetch(url + "airlines", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();

        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
}
