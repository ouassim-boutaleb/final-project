import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';


function ProtectedAdmin({ children }) {
    const navigate = useNavigate();
    const [authenticated, setAuthenticated] = useState(null);
    
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const user = localStorage.getItem('user');
        const role = JSON.parse(user)?.userType;
        
        
        if (token && role === 'admin') {
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
                
            )}
        </div>
    );
}

export default ProtectedAdmin;