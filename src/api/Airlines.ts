import url from "./url";

// Pour obtenir la liste des compagnies aériennes avec leurs pays désservis
export default async function getAirlines(token: string) {
    try {
        const response = await fetch(
            "https://unfraternal-unrescuable-sienna.ngrok-free.dev/" +
                "airlines",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "69420",
                },
            }
        );
        const data = await response.json();

        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
}
