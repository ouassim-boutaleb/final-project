import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';


function ProtectedRoute({ children }) {
    const navigate = useNavigate();
    const [authenticated, setAuthenticated] = useState(null);
    
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const user = localStorage.getItem('user');
        const role = JSON.parse(user)?.userType;
        
        
        if (token && role === 'warehouse') {
            setAuthenticated(true);
        } else {
            setAuthenticated(false);
            navigate('/login'); 
        }
    }, []);
    return (
        <div>
            {authenticated ? (
               children
            ) : (
                null
                // <div className="flex flex-col items-center justify-center h-screen">
                //     <h1 className="text-2xl font-bold">Access Denied</h1>
                //     <p className="mt-4">You need to log in to access this page.</p>
                // </div>
            )}
        </div>
    );
}

export default ProtectedRoute;