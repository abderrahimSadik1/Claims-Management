import { useContext } from 'react';
import { AuthContext } from '../api/AuthContext'; 
import Hero from '../components/Hero'
import Claim from '../components/Claims';
import Settings from './Settings';
import Dashboard from './Dashboard';

function Home() {
  const { isAuth, isAdmin } = useContext(AuthContext); 

  return (
    <div>
      {isAdmin ?<><Dashboard /><Settings/></>: isAuth ? <Claim /> : <Hero />}
    </div>

  );
}

export default Home;
