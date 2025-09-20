import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../../services/api';
import { useAuth } from '../../services/AuthContext';
import { globalStyles } from '../../styles/globalStyles';
import LoadingSpinner from '../../components/LoadingSpinner';

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
        <ScrollView style={globalStyles.container}>
            <Text style={globalStyles.title}>Prescription Analyzer</Text>
            <TouchableOpacity style={globalStyles.button} onPress={pickImage}>
                <Text style={globalStyles.buttonText}>Select Prescription Image</Text>
            </TouchableOpacity>

            {image && (
                <Image source={{ uri: image }} style={{ width: 300, height: 200, alignSelf: 'center', marginVertical: 20 }} />
            )}

            <TouchableOpacity 
                style={[globalStyles.button, {backgroundColor: '#28a745', marginTop: 10, opacity: image ? 1 : 0.5 }]} 
                onPress={handleAnalyze}
                disabled={!image}
            >
                <Text style={globalStyles.buttonText}>Analyze with AI</Text>
            </TouchableOpacity>

            {loading && <LoadingSpinner />}

            {analysis && (
                <View style={[globalStyles.card, {marginTop: 20}]}>
                    <Text style={globalStyles.cardTitle}>AI Analysis Results</Text>
                    <Text style={{fontWeight: 'bold'}}>Summary:</Text>
                    <Text>{analysis.summary}</Text>
                    <Text style={{fontWeight: 'bold', marginTop: 10}}>Doctor's Notes:</Text>
                    <Text>{analysis.doctor_notes}</Text>
                </View>
            )}
        </ScrollView>
    );
};

export default PrescriptionScanner;