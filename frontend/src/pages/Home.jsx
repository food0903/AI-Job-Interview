<<<<<<< HEAD
import NavbarLayout from '../components/NavbarLayout';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth'; // Ensure you're importing this
import HomePage from '../components/HomePage';
import SignInPage from './Signin';
=======
import NavbarLayout from '../components/NavbarLayout'
import SignInPage from './Signin'
>>>>>>> c7ce7b44d4a180729079eceb9f3108b9a9aa8017

export default function Home() {
    const [user] = useAuthState(auth);

    return (
        <NavbarLayout>
<<<<<<< HEAD
            {user ? <HomePage /> : <SignInPage />}  {/* If user is authenticated, show HomePage, otherwise SignInPage */}
        </NavbarLayout>
    );
}
=======
            <SignInPage/>
            <p>asdasd</p>
        </NavbarLayout>
        
    )
}
>>>>>>> c7ce7b44d4a180729079eceb9f3108b9a9aa8017
