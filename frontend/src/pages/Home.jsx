import NavbarLayout from '../components/NavbarLayout';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth'; // Ensure you're importing this
import HomePage from '../components/HomePage';
import SignInPage from './Signin';

export default function Home() {
    const [user] = useAuthState(auth);

    return (
        <NavbarLayout>
            {user ? <HomePage /> : <SignInPage />}  {/* If user is authenticated, show HomePage, otherwise SignInPage */}
        </NavbarLayout>
    );
}
