import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../api/AuthContext'; // Adjust the path to your context file

const BASE_URL = "http://192.168.164.232:8080";

const UpdateClaim = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [error, setError] = useState('');
  const { params } = useRoute();
  const { id } = params;
  const navigation = useNavigation();
  const { jwt } = useContext(AuthContext);

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        console.log(id);
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`${BASE_URL}/claims/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setFormData({
          title: response.data.title,
          description: response.data.description
        });
      } catch (error) {
        setError('Failed to fetch claim. Please try again.');
        console.error('Error fetching claim:', error);
      }
    };

    fetchClaim();
  }, [id]);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setError('');

    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.put(`${BASE_URL}/claims/update/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Claim updated:', formData);
      Alert.alert('Success', 'Claim updated successfully!', [{ text: 'OK', onPress: () => navigation.navigate('ClaimDetails', { id }) }]);
    } catch (error) {
      setError('Failed to update claim. Please try again.');
      console.error('Error updating claim:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Update Claim</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={formData.title}
          onChangeText={value => handleChange('title', value)}
          autoCapitalize="none"
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          value={formData.description}
          onChangeText={value => handleChange('description', value)}
          multiline
          numberOfLines={4}
          autoCapitalize="none"
        />
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F3F4F6',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    paddingLeft: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top', // for Android
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default UpdateClaim;
