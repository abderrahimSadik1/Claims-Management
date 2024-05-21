import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

BASE_URL = "http://192.168.164.232:8080";

const Settings = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [jwt, setJwt] = useState('');

  useEffect(() => {
    // Fetch JWT from AsyncStorage
    const getJwt = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt');
        setJwt(token);
      } catch (error) {
        console.error('Failed to get JWT from AsyncStorage:', error);
      }
    };

    getJwt();
  }, []);

  useEffect(() => {
    // Fetch users data from your backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/all`, {
          headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };

    if (jwt) {
      fetchUsers();
    }
  }, [jwt]);

  const handleRoleChange = async (id, value) => {
    try {
      await axios.put(`${BASE_URL}/users/${id}`, {
        role: value
      }, {
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });

      // Update users after role change
      const updatedUsers = users.map(user => {
        if (user.id === id) {
          return { ...user, role: value };
        }
        return user;
      });
      setUsers(updatedUsers);
      console.log('Role updated successfully');
    } catch (error) {
      console.error('Failed to update role', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });

      // Remove the deleted user from the list
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
      console.log('User deleted successfully');
    } catch (error) {
      console.error('Failed to delete user', error);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderUserItem = ({ item }) => (
    <View style={styles.userContainer}>
      <Text style={styles.userName}>{item.firstName} {item.lastName}</Text>
      <Text style={styles.userInfo}>{item.username}</Text>
      <Text style={styles.userInfo}>{item.email}</Text>
      <View style={styles.roleContainer}>
        <Text style={styles.label}>Role:</Text>
        <TextInput
          value={item.role}
          style={styles.roleInput}
          onChangeText={value => handleRoleChange(item.id, value)}
        />
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by username"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  userContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userInfo: {
    marginBottom: 5,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    marginRight: 5,
  },
  roleInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
  },
});

export default Settings;
