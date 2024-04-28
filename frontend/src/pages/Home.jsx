import React from 'react';
import NavbarLayout from '../components/NavbarLayout';
import SignInPage from './Signin'; // Correct capitalization
import HomePage from '../components/HomePage'; // Correct capitalization
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase'; // Ensure this is the correct import

export default function Home() {
    const [user] = useAuthState(auth); // Get the current user state

    return (
        <NavbarLayout>
            {user ? ( 
                <HomePage />
            ) : ( 
                <SignInPage />
            )}
        </NavbarLayout>
    );
}
