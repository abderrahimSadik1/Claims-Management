import React, { useContext } from 'react';
import { View } from 'react-native';
import { AuthContext } from '../api/AuthContext'; 
import Hero from '../components/Hero';
import Claim from '../components/Claims';
import Settings from './Settings';
import Dashboard from './Dashboard';

const Home = () => {
  const { isAuth, isAdmin } = useContext(AuthContext); 

  return (
    <View>
      {isAdmin ? <><Dashboard /><Settings /></> : isAuth ? <Claim /> : <Hero />}
    </View>
  );
}

export default Home;
