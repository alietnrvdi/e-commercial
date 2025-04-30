import { onAuthStateChanged, signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { auth } from '../store/Firebase';
import { useCookies } from 'react-cookie';

// useAuth for user custom hook 
const useAuth = () => {
    const [cookies, setCookie] = useCookies(['user'])
    const [user, setUser] = useState(null);

    // Current user if login set and add cookie or don't login return null and remove cookie. 
    useEffect(() => {
        const unsubcribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser)
                setCookie('user', JSON.stringify(currentUser));
            } else {
                setUser(null)
                setCookie('user', '', { path: '/', expires: new Date(Date.now() + 608500000) });
            }
        }
        )
        return () => unsubcribe();
    }, []);

    // Log out progression remove cookie and basket
    const logOut = async () => {
        try {
            await signOut(auth);
            setUser(null)
            setCookie('user', '', { path: '/', expires: new Date(Date.now() + 608500000) })
            navigate()
        } catch (error) {
            console.log('An error occurs when the user logs out', error);
        }
    }
    // and export custom hook
    return { user, logOut }

}
export default useAuth