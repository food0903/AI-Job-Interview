import React from 'react';
import GoogleButton from 'react-google-button';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SignInPage = ({ onSignIn }) => {
  const navigate = useNavigate(); // Create navigate instance
  const [user, loading, error] = useAuthState(auth); // Authentication state

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider); // Google sign-in popup
      console.log('Google sign-in successful');
      onSignIn(); // Trigger the sign-in callback
      navigate('/'); // Redirect to HomePage
    } catch (error) {
      console.error('Google sign-in failed:', error.message); // Error handling
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <div className="text-center mb-4">
          <img src="CompanyLogo.png" alt="Logo" className="mx-auto" />
          <h2 className="text-2xl font-bold">Sign In</h2>
          <p className="text-gray-500">Remember everything important.</p>
        </div>
        <div className="flex flex-col items-center">
          {!user && !loading ? (
            <GoogleButton onClick={handleGoogleSignIn} className="mb-4" /> // Google sign-in button
          ) : (
            <p className="text-green-500">You're already signed in!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
