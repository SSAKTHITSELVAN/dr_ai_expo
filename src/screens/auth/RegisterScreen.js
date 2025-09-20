import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    Alert, 
    ScrollView, 
    StyleSheet, 
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useAuth } from '../../services/AuthContext';

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [userType, setUserType] = useState('patient');
    const [location, setLocation] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const validate = () => {
        const newErrors = {};
        const emailRegex = /\S+@\S+\.\S+/;
        const phoneRegex = /^\d{10}$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Min 8 chars, 1 letter, 1 number

        if (!name.trim()) newErrors.name = 'Full Name is required.';
        if (!emailRegex.test(email)) newErrors.email = 'Please enter a valid email address.';
        if (!phoneRegex.test(phone)) newErrors.phone = 'Please enter a valid 10-digit phone number.';
        if (!passwordRegex.test(password)) newErrors.password = 'Password must be at least 8 characters long and include a number.';
        if (userType === 'doctor' && !specialization.trim()) newErrors.specialization = 'Specialization is required for doctors.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validate()) {
            return;
        }
        setLoading(true);
        const userData = { email, phone, password, name, user_type: userType, location, specialization };
        try {
            const result = await register(userData);
            if (result.success) {
                Alert.alert("Success", "Registration successful! Please log in.");
                navigation.navigate('Login');
            } else {
                setErrors({ api: result.error });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join our community</Text>
                {errors.api ? <Text style={styles.errorText}>{errors.api}</Text> : null}

                <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} placeholderTextColor="#888" />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#888"/>
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                <TextInput style={styles.input} placeholder="10-digit Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" maxLength={10} placeholderTextColor="#888"/>
                {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

                <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor="#888"/>
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                <TextInput style={styles.input} placeholder="Location (e.g., Coimbatore)" value={location} onChangeText={setLocation} placeholderTextColor="#888"/>

                <Text style={styles.label}>Register as:</Text>
                <View style={styles.userTypeContainer}>
                    {['patient', 'doctor', 'pharmacy'].map(type => (
                        <TouchableOpacity 
                            key={type} 
                            style={[styles.userTypeButton, userType === type && styles.userTypeButtonActive]} 
                            onPress={() => setUserType(type)}
                        >
                            <Text style={[styles.userTypeButtonText, userType === type && styles.userTypeButtonTextActive]}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                
                {userType === 'doctor' && (
                    <>
                        <TextInput style={styles.input} placeholder="Specialization" value={specialization} onChangeText={setSpecialization} placeholderTextColor="#888"/>
                        {errors.specialization && <Text style={styles.errorText}>{errors.specialization}</Text>}
                    </>
                )}

                <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleRegister} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginContainer} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginText}>
                        Already have an account? <Text style={styles.loginLink}>Login</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#eaf5ff',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0d6efd',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#6c757d',
        textAlign: 'center',
        marginBottom: 20,
    },
    errorText: {
        color: '#dc3545',
        marginBottom: 10,
        fontSize: 12,
        textAlign: 'left',
        marginLeft: 5,
    },
    input: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ced4da',
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#0d6efd',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: '#6ea8ff',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    loginContainer: {
        marginTop: 25,
    },
    loginText: {
        textAlign: 'center',
        color: '#6c757d',
        fontSize: 14,
    },
    loginLink: {
        color: '#0d6efd',
        fontWeight: 'bold',
    },
    label: {
        fontSize: 16,
        color: '#6c757d',
        marginTop: 15,
        marginBottom: 10,
    },
    userTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    userTypeButton: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#0d6efd',
        alignItems: 'center',
        marginHorizontal: 4,
    },
    userTypeButtonActive: {
        backgroundColor: '#0d6efd',
    },
    userTypeButtonText: {
        color: '#0d6efd',
        fontWeight: '600',
    },
    userTypeButtonTextActive: {
        color: '#fff',
    },
});

export default RegisterScreen;