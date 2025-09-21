import React from 'react';
import { View, Text, TouchableOpacity, Linking, Alert, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DoctorCard = ({ doctor }) => {
    const handleContact = (number) => {
        if (number) {
            const formattedNumber = number.startsWith('+') ? number : `+${number}`;
            Linking.openURL(`whatsapp://send?phone=${formattedNumber}`).catch(() => {
                Alert.alert("Error", "Could not open WhatsApp. Please make sure it is installed.");
            });
        } else {
            Alert.alert("No Contact", "Doctor's contact number is not available.");
        }
    };
    
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{doctor.name}</Text>
            <Text style={styles.cardSubtitle}>{doctor.specialization}</Text>
            <View style={styles.separator} />
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Experience:</Text>
                <Text style={styles.detailValue}>{doctor.experience} years</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Location:</Text>
                <Text style={styles.detailValue}>{doctor.location}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Fee:</Text>
                <Text style={styles.detailValue}>INR {doctor.consultation_fee}</Text>
            </View>
            <TouchableOpacity 
                style={styles.button}
                onPress={() => handleContact(doctor.whatsapp)}
            >
                <MaterialCommunityIcons name="whatsapp" size={20} color="#fff" />
                <Text style={styles.buttonText}>Contact on WhatsApp</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0d6efd',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#6c757d',
        marginBottom: 12,
    },
    separator: {
        height: 1,
        backgroundColor: '#e9ecef',
        marginVertical: 8,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    detailLabel: {
        fontSize: 15,
        color: '#495057',
    },
    detailValue: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#212529',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        backgroundColor: '#25D366', // WhatsApp green
        padding: 12,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
    },
});

export default DoctorCard;