import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../../services/AuthContext';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('patient1@example.com');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const result = await login(email, password);
            if (!result.success) {
                setError(result.error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#888"
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#888"
                />
            </View>
            <TouchableOpacity 
                style={[styles.button, loading && styles.buttonDisabled]} 
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Login</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.registerContainer} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerText}>
                    Don't have an account? <Text style={styles.registerLink}>Register</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#eaf5ff', // Light blue background
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0d6efd', // Primary blue
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#6c757d', // Gray text
        textAlign: 'center',
        marginBottom: 30,
    },
    errorText: {
        color: '#dc3545', // Red for errors
        textAlign: 'center',
        marginBottom: 10,
    },
    inputContainer: {
        marginBottom: 15,
    },
    input: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ced4da',
    },
    button: {
        backgroundColor: '#0d6efd', // Primary blue
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: '#6ea8ff', // Lighter blue when disabled
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    registerContainer: {
        marginTop: 25,
    },
    registerText: {
        textAlign: 'center',
        color: '#6c757d',
        fontSize: 14,
    },
    registerLink: {
        color: '#0d6efd',
        fontWeight: 'bold',
    }
});

export default LoginScreen;