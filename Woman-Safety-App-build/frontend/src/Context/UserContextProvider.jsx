import { useEffect, useState } from "react";
import { AuthContext, AuthProvider } from "./AuthContext";
import { Config } from "../../API/Config";
import api from "../../API/CustomApi";

const UserContextProvider = ({ children }) => {
    const [auth, setAuth] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState("");

    const getUserInfo = async (email) => {
        try {
            const response = await api.get(`${Config.GETDATAUrl}`, {
                params: { email },
            });

            if (response.data) {
                localStorage.setItem("UserInfo", JSON.stringify(response.data));
                setUser(response.data);
            }
        } catch (error) {
            console.error("Error in getting Data", error);
        }
    };


    const checkAuth = async () => {
        try {
            const response = await api.get(Config.CHECKAuthUrl);

            if (response.data.authenticated) {
                const email = response.data.user.email;
                setUserEmail(email);

                await getUserInfo(email);
                setAuth(true);
            } else {
                await logout()
            }
        } catch (error) {
            console.error("Authentication check failed:", error);
            setAuth(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const logout = async () => {
        try {
            const response = await api.post(Config.LogoutUrl);

            if (response) {
                localStorage.clear();
                setAuth(false);
                setUser(null);

                console.log("Logged out successfully.");
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <AuthProvider value={{ auth, setAuth, user, setUser, logout, loading, checkAuth }}>
            {children}
        </AuthProvider>
    );
};

export default UserContextProvider;
