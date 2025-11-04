import url from "./url";

export default async function TokenAPI(refreshToken: string) {
    try {
        const response = await fetch(url + "auth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "69420",
            },
            body: JSON.stringify({ refreshToken }),
        });
        if (!response.ok) return null;

        const data = await response.json();
        return {
            accessToken: data.accessToken,
            id: data.id,
        };
    } catch (err) {
        console.error(err);
        return null;
    }
}
