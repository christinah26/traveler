import url from "./url";

export async function login(admin: { email: string; password: string }) {
    const response = await fetch(url + "auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(admin),
    });

    if (!response.ok) throw new Error("Login failed");

    const data = await response.json();
    localStorage.setItem("refreshToken", data.refreshToken);
    return {
        token: data.accessToken,
        status: response.status,
        id: data.id,
    };
}

export async function signup(client: {
    nom: string;
    prenom: string;
    email: string;
    password: string;
    code: string;
}) {
    const response = await fetch(url + "auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify(client),
    });

    if (!response.ok) throw new Error("Signup failed");

    const data = await response.json();
    localStorage.setItem("refreshToken", data.refreshToken);
    return {
        token: data.accessToken,
        status: response.status,
        id: data.id,
    };
}

export default async function logout(token: string | null, id_admin: number) {
    if (!token) return;
    const response = await fetch(url + "auth/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_admin }),
    });

    if (response.status === 200) localStorage.removeItem("refreshToken");

    return response.status;
}
