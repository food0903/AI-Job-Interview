import React from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import GoogleButton from 'react-google-button';


function BootstrapNavbar() {
  const [user] = useAuthState(auth);

  const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Ai interview with chun chan</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {!user ? (
              <GoogleButton onClick={handleSignInWithGoogle}/>
            ) : (
              <>
                <NavDropdown title={`Hello, ${user.displayName}`} id="basic-nav-dropdown">
                  <NavDropdown.Item onClick={handleSignOut}>Sign Out</NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BootstrapNavbar;
