import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = (role) => {
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.role === role) {
            setIsAuthorized(true);
        } else {
            navigate('/login');
        }
    }, [role, navigate]);

    return isAuthorized;
};

export default useAuth;
