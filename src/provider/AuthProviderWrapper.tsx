import { Outlet } from "react-router-dom";
import AuthProvider from "./AuthProvider";

export default function AuthProviderWrapper({
    props,
}: {
    props: {
        token: string | null;
        setToken: React.Dispatch<React.SetStateAction<string | null>>;
        refreshToken: () => Promise<string | null>;
        id: number | null;
        setId: React.Dispatch<React.SetStateAction<number | null>>;
    };
}) {
    return (
        <AuthProvider
            props={{
                id: props.id,
                refreshToken: props.refreshToken,
                setId: props.setId,
                setToken: props.setToken,
                token: props.token,
            }}
        >
            <Outlet />
        </AuthProvider>
    );
}
