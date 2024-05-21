import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

BASE_URL = "http://192.168.164.232:8080";

const AddClaim = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [jwt, setJwt] = useState('');

  useEffect(() => {
    const getJwt = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          setJwt(token);
        }
      } catch (error) {
        console.error('Failed to retrieve JWT:', error);
      }
    };

    getJwt();
  }, []);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setError('');

    try {
      const response = await axios.post(`${BASE_URL}/claims/add`, formData, {
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Claim added:', response.data);
      // Clear form after successful submission
      setFormData({ title: '', description: '' });
      Alert.alert('Success', 'Claim added successfully');
    } catch (error) {
      setError('Failed to add claim. Please try again.');
      console.error('Error adding claim:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Claim</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={formData.title}
          onChangeText={(value) => handleChange('title', value)}
          placeholder="Enter title"
          required
        />
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textarea}
          value={formData.description}
          onChangeText={(value) => handleChange('description', value)}
          placeholder="Enter description"
          multiline
          numberOfLines={4}
          required
        />
        <Button title="Submit" onPress={handleSubmit} color="#6B21A8" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1F2937',
  },
  error: {
    color: 'red',
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
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  label: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  textarea: {
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
});

export default AddClaim;
