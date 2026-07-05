import { useContext, useEffect } from 'react';

import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Loader from './Home/Loader';

const ProtectedRoute = ({ children }) => {
    const { auth, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!loading && !auth) {
            navigate('/login');
        }
    }, [auth, loading, navigate]);

    if (loading) return <Loader />;
    
    return auth ? children : null;
};

export default ProtectedRoute;