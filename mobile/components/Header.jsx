import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../api/AuthContext'; // Adjust the path to your context file
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
  const { isAdmin, isAuth, isManager, logout } = useContext(AuthContext);
  const [user, setUser] = React.useState('');
  const navigation = useNavigation();

  React.useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      setUser(storedUser);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Login'); // Navigate to the login screen after logout
  };

  return (
    <View style={styles.navbar}>
      <View style={styles.navbarStart}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.logoContainer}>
          <Image source={require('../assets/images/logo.svg')} style={styles.logo} />
          <Text style={styles.title}>SOZ</Text>
        </TouchableOpacity>
      </View>

      {isAuth ? (
        <>
          <View style={styles.navbarCenter}>
            {isAdmin ? (
              <Text style={styles.welcomeText}>Welcome Admin 👑 <Text style={styles.username}>{user}</Text></Text>
            ) : isManager ? (
              <Text style={styles.welcomeText}>Welcome Manager <Text style={styles.username}>{user}</Text></Text>
            ) : (
              <Text style={styles.welcomeText}>Welcome <Text style={styles.username}>{user}</Text></Text>
            )}
          </View>
          <View style={styles.navbarEnd}>
            <TouchableOpacity style={styles.avatarButton}>
              <Image source={{ uri: 'https://picsum.photos/200' }} style={styles.avatar} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.navbarCenter}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.navLink}><Text>Home</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('About')} style={styles.navLink}><Text>About Us</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Contact')} style={styles.navLink}><Text>Contact Us</Text></TouchableOpacity>
          </View>
          <View style={styles.navbarEnd}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginButton}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerButton}>
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 10,
  },
  navbarStart: {
    flex: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  navbarCenter: {
    flex: 2,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
  },
  username: {
    fontWeight: 'bold',
  },
  navbarEnd: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  avatarButton: {
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  logoutButton: {
    backgroundColor: '#E53E3E',
    padding: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: '#FFFFFF',
  },
  navLink: {
    marginHorizontal: 10,
  },
  loginButton: {
    backgroundColor: '#3182CE',
    padding: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  loginText: {
    color: '#FFFFFF',
  },
  registerButton: {
    backgroundColor: '#38A169',
    padding: 8,
    borderRadius: 8,
  },
  registerText: {
    color: '#FFFFFF',
  },
});

export default Header;
