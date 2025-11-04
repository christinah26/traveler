import { useEffect } from "react";
import { NavbarContext } from "../contexts/NavbarContext";

const NavbarProvider = ({
    children,
    isAuthenticated,
}: {
    children: React.ReactNode;
    isAuthenticated: boolean;
}) => {
    return (
        <NavbarContext.Provider value={{ isAuthenticated }}>
            {children}
        </NavbarContext.Provider>
    );
};

export default NavbarProvider;
