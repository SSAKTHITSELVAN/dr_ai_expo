import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../services/AuthContext';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Patient Screens
import PatientDashboard from '../screens/patient/PatientDashboard';
import DoctorsListScreen from '../screens/patient/DoctorsListScreen';
import PrescriptionScanner from '../screens/patient/PrescriptionScanner';
import InsuranceScreen from '../screens/patient/InsuranceScreen';
import GovernmentSchemesScreen from '../screens/patient/GovernmentSchemesScreen';

// Pharmacy Screens
import MedicinesListScreen from '../screens/pharmacy/MedicinesListScreen';
import MedicineDetailScreen from '../screens/pharmacy/MedicineDetailScreen';

// Doctor Screens
import DoctorDashboard from '../screens/doctor/DoctorDashboard';

// Components
import LoadingSpinner from '../components/LoadingSpinner';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const PharmacyStack = () => (
    <Stack.Navigator>
        <Stack.Screen name="MedicinesList" component={MedicinesListScreen} options={{ title: 'Pharmacy Stock' }}/>
        <Stack.Screen name="MedicineDetail" component={MedicineDetailScreen} options={{ title: 'Medicine Details' }}/>
    </Stack.Navigator>
);

const PatientTabs = () => (
    <Tab.Navigator>
        <Tab.Screen name="Dashboard" component={PatientDashboard} />
        <Tab.Screen name="Find Doctors" component={DoctorsListScreen} />
        <Tab.Screen name="Scan Rx" component={PrescriptionScanner} />
        <Tab.Screen name="Insurance" component={InsuranceScreen} />
        <Tab.Screen name="Schemes" component={GovernmentSchemesScreen} />
    </Tab.Navigator>
);

const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
);

const AppNavigator = () => {
    const { authState } = useAuth();

    if (authState.isLoading) {
        return <LoadingSpinner />;
    }

    if (!authState.isAuthenticated) {
        return <AuthStack />;
    }

    if (authState.userType === 'patient') {
        return <PatientTabs />;
    }

    if (authState.userType === 'doctor') {
        return <DoctorDashboard />;
    }

    if (authState.userType === 'pharmacy') {
        return <PharmacyStack />;
    }
    
    // Fallback to login if userType is unknown
    return <AuthStack />;
};

export default AppNavigator;