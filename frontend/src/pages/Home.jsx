import React from 'react';
import SignInPage from './Signin'; // Correct capitalization
import Homepage from '../modules/Home/components/Homepage'; 
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase'; // Ensure this is the correct import

export default function Home() {
    const [user] = useAuthState(auth); // Get the current user state

    return (
        <>
            {user ? ( // If user exists, render HomePage
                <Homepage />
            ) : ( // Otherwise, render SignInPage
                <SignInPage />
            )}
        </>
    );
}
