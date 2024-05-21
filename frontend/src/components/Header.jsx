import { useContext } from 'react';
import { AuthContext } from './../api/AuthContext';
import logo from './../assets/images/C.svg';
import Cookies from 'js-cookie';

function Header() {
  const { isAdmin ,isAuth,isManager, logout } = useContext(AuthContext);
  const user = Cookies.get('user');
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
      <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
      <img src={logo} className="h-8" alt="Flowbite Logo" />
      <span className="self-center text-2xl font-extrabold whitespace-nowrap">Claims</span>
  </a>
      </div>

      {isAuth ? (
        <>
            <div>
      {isAdmin ? (
        <div className="navbar-center">
          <p>Welcome Admin<span role="img" aria-label="King">👑</span> <strong>{user}</strong> </p>
        </div>
      ) : isManager ? (
        <div className="navbar-center">
          <p>Welcome Manager<span role="img" aria-label="Manager">💼</span> <strong>{user}</strong></p>
        </div>
      ) : isAuth ? (
        <div className="navbar-center">
          <p>Welcome<span role="img" aria-label="User">👤</span> <strong>{user}</strong></p>
        </div>
      ) : <p></p>}
</div> 
          <div className="navbar-end">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src="https://picsum.photos/200"  />
                </div>
              </div>
              <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li><a href="/" onClick={(e) => {
                    e.preventDefault();
                    logout();
                }}>Logout</a></li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <>
         <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
      </div>
      <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
      <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact Us</a></li>
      </ul>
    </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal p-0">
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>
          <div className="navbar-end">
          
            <a className="btn btn-outline mr-3" href="/login">Login</a>
            <a className="btn btn-primary" href="/register">Register</a>
          </div>
        </>
      )}
    </div>
  );
}

export default Header;
