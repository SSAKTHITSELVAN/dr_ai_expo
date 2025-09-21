import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import api from '../../services/api';
import { useAuth } from '../../services/AuthContext';

const PrescriptionScanner = () => {
    const [image, setImage] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const { authState } = useAuth();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setAnalysis(null); // Reset previous analysis
        }
    };

    const handleAnalyze = async () => {
        if (!image) {
            Alert.alert("No Image", "Please select an image first.");
            return;
        }
        setLoading(true);

        const formData = new FormData();
        formData.append('file', {
            uri: image,
            type: 'image/jpeg',
            name: 'prescription.jpg',
        });

        try {
            const response = await api.post(
                `/ai/prescription/analyze?patient_id=${authState.userId}`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            setAnalysis(response.data.analysis);
        } catch (error) {
            Alert.alert("Analysis Failed", "Could not analyze the prescription.");
            console.error(error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Prescription Analyzer</Text>
            <Text style={styles.subtitle}>Upload an image of your prescription to get an AI-powered analysis.</Text>

            <TouchableOpacity style={styles.button} onPress={pickImage}>
                <MaterialCommunityIcons name="image-plus" size={22} color="#fff" />
                <Text style={styles.buttonText}>Select Image</Text>
            </TouchableOpacity>

            {image && (
                <View style={styles.imageContainer}>
                    <Image source={{ uri: image }} style={styles.imagePreview} />
                </View>
            )}

            <TouchableOpacity 
                style={[styles.button, styles.analyzeButton, (!image || loading) && styles.buttonDisabled]} 
                onPress={handleAnalyze}
                disabled={!image || loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <>
                        <MaterialCommunityIcons name="robot-happy-outline" size={22} color="#fff" />
                        <Text style={styles.buttonText}>Analyze with AI</Text>
                    </>
                )}
            </TouchableOpacity>

            {analysis && (
                <View style={styles.analysisCard}>
                    <Text style={styles.analysisTitle}>AI Analysis Results</Text>
                    <View style={styles.separator} />
                    <Text style={styles.analysisSectionHeader}>Summary:</Text>
                    <Text style={styles.analysisContent}>{analysis.summary}</Text>
                    <Text style={styles.analysisSectionHeader}>Doctor's Notes:</Text>
                    <Text style={styles.analysisContent}>{analysis.doctor_notes}</Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#eaf5ff',
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0d6efd',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#6c757d',
        textAlign: 'center',
        marginBottom: 24,
        marginTop: 8,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0d6efd',
        padding: 18,
        borderRadius: 12,
        marginBottom: 20,
    },
    analyzeButton: {
        backgroundColor: '#28a745', // Green for analyze action
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    imagePreview: {
        width: '100%',
        height: 250,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#ced4da',
    },
    analysisCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    analysisTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0d6efd',
    },
    separator: {
        height: 1,
        backgroundColor: '#e9ecef',
        marginVertical: 12,
    },
    analysisSectionHeader: {
        fontWeight: 'bold',
        color: '#495057',
        marginTop: 10,
        fontSize: 16,
    },
    analysisContent: {
        fontSize: 14,
        lineHeight: 20,
        color: '#212529',
        marginTop: 4,
    },
});

export default PrescriptionScanner;