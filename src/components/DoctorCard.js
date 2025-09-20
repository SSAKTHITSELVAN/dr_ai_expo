import React from 'react';
import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

const DoctorCard = ({ doctor }) => {
    const handleContact = (number) => {
        if (number) {
            Linking.openURL(`whatsapp://send?phone=${number}`).catch(() => {
                Alert.alert("Error", "Could not open WhatsApp. Please make sure it is installed.");
            });
        } else {
            Alert.alert("No Contact", "Doctor's contact number is not available.");
        }
    };

    return (
        <View style={globalStyles.card}>
            <Text style={globalStyles.cardTitle}>{doctor.name}</Text>
            <Text style={globalStyles.cardSubtitle}>{doctor.specialization}</Text>
            <Text>Experience: {doctor.experience} years</Text>
            <Text>Location: {doctor.location}</Text>
            <Text>Fee: ₹{doctor.consultation_fee}</Text>
            <TouchableOpacity 
                style={[globalStyles.button, { marginTop: 10, backgroundColor: '#25D366'}]}
                onPress={() => handleContact(doctor.whatsapp)}
            >
                <Text style={globalStyles.buttonText}>Contact on WhatsApp</Text>
            </TouchableOpacity>
        </View>
    );
};

export default DoctorCard;