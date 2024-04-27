import Navbar from "./BootstrapNavbar";

const NavbarLayout = ({ children }) => {
    return (
        <>
            <Navbar />
            {children}
    
        </>
    )
}

export default NavbarLayout;