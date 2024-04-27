import NavbarLayout from '../components/NavbarLayout';
import SignInPage from './Signin';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth'; // Ensure you're importing this
import HomePage from '../components/HomePage';

export default function Home() {
    const [user] = useAuthState(auth);

    return (
        <NavbarLayout>
            {user ? <HomePage /> : <SignInPage />}  {/* If user is authenticated, show HomePage, otherwise SignInPage */}
        </NavbarLayout>
    );
}
