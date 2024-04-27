
import React from "react";

const Navbar = () => {


  return (
    <nav className="bg-blue-300 px-10 py-4 flex justify-center items-center">
      <Link to = '/'>
      <div className="text-left font-bold text-4xl flex-grow">Test</div>
      </Link>
      <div className="ml-auto flex items-center">
        <Button
          to="/login"
          className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded mr-12"
        >
          Sign in with google
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;