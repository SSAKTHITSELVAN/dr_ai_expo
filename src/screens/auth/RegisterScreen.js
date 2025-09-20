import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
// Note: For a real app, use a picker library. For simplicity, we use TextInput.
import { useAuth } from '../../services/AuthContext';
import { globalStyles } from '../../styles/globalStyles';

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [userType, setUserType] = useState('patient'); // 'patient', 'doctor', or 'pharmacy'
    const [location, setLocation] = useState('');
    const [specialization, setSpecialization] = useState(''); // For doctors
    const [error, setError] = useState('');
    const { register } = useAuth();

    const handleRegister = async () => {
        if (!email || !password || !name || !userType || !phone) {
            setError('Please fill all required fields.');
            return;
        }
        setError('');
        const userData = { email, phone, password, name, user_type: userType, location, specialization };
        const result = await register(userData);
        if (result.success) {
            Alert.alert("Success", "Registration successful! Please log in.");
            navigation.navigate('Login');
        } else {
            setError(result.error);
        }
    };

    return (
        <ScrollView contentContainerStyle={globalStyles.container}>
            <Text style={globalStyles.title}>Create Account</Text>
            {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}
            <TextInput style={globalStyles.input} placeholder="Full Name" value={name} onChangeText={setName} />
            <TextInput style={globalStyles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"/>
            <TextInput style={globalStyles.input} placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad"/>
            <TextInput style={globalStyles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <TextInput style={globalStyles.input} placeholder="Location (e.g., Coimbatore)" value={location} onChangeText={setLocation} />
            <Text style={{marginBottom: 10}}>Register as: (patient, doctor, pharmacy)</Text>
            <TextInput style={globalStyles.input} placeholder="User Type" value={userType} onChangeText={setUserType} autoCapitalize="none" />
            
            {userType === 'doctor' && (
                 <TextInput style={globalStyles.input} placeholder="Specialization" value={specialization} onChangeText={setSpecialization} />
            )}

            <TouchableOpacity style={globalStyles.button} onPress={handleRegister}>
                <Text style={globalStyles.buttonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.navigate('Login')}>
                <Text style={{ textAlign: 'center', color: '#007bff' }}>
                    Already have an account? Login
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default RegisterScreen;