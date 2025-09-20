import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../services/AuthContext';
import { globalStyles } from '../../styles/globalStyles';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('patient1@example.com');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }
        setError('');
        const result = await login(email, password);
        if (!result.success) {
            setError(result.error);
        }
    };

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Welcome Back!</Text>
            {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}
            <TextInput
                style={globalStyles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={globalStyles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={globalStyles.button} onPress={handleLogin}>
                <Text style={globalStyles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.navigate('Register')}>
                <Text style={{ textAlign: 'center', color: '#007bff' }}>
                    Don't have an account? Register
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;