import {Navigate} from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';		
import api from '../api/api';
import {ACCESS_TOKEN, REFRESH_TOKEN} from '../constants';
import { useState, useEffect } from 'react';

const ProtectedRoute = ({children}) => {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false));
    }, []);
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const response = await api.post('/accounts/refresh/', {refresh: refreshToken});
            if (response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            };
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        };

    };

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        };
        const decordedToken = jwtDecode(token);
        const tokenExpiration = decordedToken.exp * 1000;

        if (Date.now() >= tokenExpiration) {
            await refreshToken();
        } else {
            setIsAuthorized(true);
        };

    };


    if (isAuthorized === null) {
        return <div>Loading...</div>;
    };

    return isAuthorized ? children : <Navigate to="/login" />;


};

export default ProtectedRoute;