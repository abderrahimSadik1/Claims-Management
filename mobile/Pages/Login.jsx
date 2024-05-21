import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../api/AuthContext'; // Ensure the path is correct

const BASE_URL = "http://192.168.164.232:8080";

const Login = ({ navigation }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/login`, formData, {
                headers: { 'Content-Type': 'application/json' }
            });
            const { token, role } = response.data;
            login(token, role);
            navigation.navigate('Claims');
        } catch (error) {
            console.error('Login failed:', error);
            setError('Failed to login. Please check your credentials.');
        }
    };

    const handleRegister = () => {
        navigation.navigate('Register');
    };

    return (
        <ImageBackground source={require('../assets/background.png')} style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.title}>Welcome Back!</Text>
                <Text style={styles.subtitle}>Please enter your details to continue</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        placeholderTextColor="#aaaaaa"
                        value={formData.username}
                        onChangeText={text => handleChange('username', text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#aaaaaa"
                        secureTextEntry={true}
                        value={formData.password}
                        onChangeText={text => handleChange('password', text)}
                    />
                    {error ? <Text style={styles.error}>{error}</Text> : null}
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                        <Text style={styles.registerButtonText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '85%',
        backgroundColor: 'rgba(255, 255, 255, 0.35)', // Adjusted transparency
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    inputContainer: {
        width: '100%',
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: '#6200ee',
        paddingVertical: 15,
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        textAlign: 'center',
    },
    registerButton: {
        backgroundColor: '#03dac6',
        paddingVertical: 15,
        borderRadius: 5,
    },
    registerButtonText: {
        color: '#ffffff',
        fontSize: 18,
        textAlign: 'center',
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
});

export default Login;
