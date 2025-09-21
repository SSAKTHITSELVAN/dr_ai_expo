import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useAuth } from '../../services/AuthContext';

// WARNING: Storing API keys in client-side code is a major security risk.
// Anyone can decompile your app and steal this key.
// This should be moved to a secure backend server for a production app.
const GEMINI_API_KEY = "AIzaSyDEzVsTrDG0UnCGusugZjzNKkzSKgKyUJc";

// Initialize the Gemini AI model
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

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

    const handleClear = () => {
        setImage(null);
        setAnalysis(null);
    };

    // Helper function to convert file URI to a Gemini-compatible part
    const fileToGenerativePart = async (uri, mimeType) => {
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
        return {
            inlineData: {
                data: base64,
                mimeType
            },
        };
    }

    const handleAnalyze = async () => {
        if (!image) {
            Alert.alert("No Image", "Please select an image first.");
            return;
        }
        setLoading(true);
        setAnalysis(null); // Clear previous analysis

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

            const prompt = "You are a helpful AI Health Assistant. Analyze this prescription image and provide a clear, easy-to-understand summary for the patient. Do not provide medical advice. Structure the output with the following sections, using markdown for formatting:\n\n**Medicines Prescribed:**\n- [List each medicine with its dosage]\n\n**Instructions:**\n- [Explain how and when to take the medicines]\n\n**Doctor's Notes:**\n- [Summarize any other notes or advice from the doctor]\n\nKeep the language simple and friendly.";

            const imagePart = await fileToGenerativePart(image, "image/jpeg");

            const result = await model.generateContent([prompt, imagePart]);
            const response = await result.response;
            const text = response.text();
            
            setAnalysis(text); // The analysis is now a string from Gemini

        } catch (error) {
            Alert.alert("Analysis Failed", "Could not analyze the prescription with Gemini.");
            console.error("Gemini Analysis Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Prescription Analyzer</Text>
            <Text style={styles.subtitle}>Upload an image of your prescription to get an AI-powered analysis.</Text>

            {image && (
                <View style={styles.imageContainer}>
                    <Image source={{ uri: image }} style={styles.imagePreview} />
                </View>
            )}

            {!image && (
                <View style={styles.imagePlaceholder}>
                    <MaterialCommunityIcons name="file-image-outline" size={60} color="#b0c4de" />
                    <Text style={styles.placeholderText}>Your image will appear here</Text>
                </View>
            )}

            <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.button, { flex: 1, marginRight: image ? 8 : 0 }]} onPress={pickImage}>
                    <MaterialCommunityIcons name="image-plus" size={22} color="#fff" />
                    <Text style={styles.buttonText}>{image ? 'Change Image' : 'Select Image'}</Text>
                </TouchableOpacity>
                {image && (
                    <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={handleClear}>
                        <MaterialCommunityIcons name="delete-outline" size={22} color="#dc3545" />
                        <Text style={[styles.buttonText, { color: '#dc3545' }]}>Clear</Text>
                    </TouchableOpacity>
                )}
            </View>

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
                    <View style={styles.analysisHeader}>
                        <MaterialCommunityIcons name="robot-happy-outline" size={22} color="#0d6efd" />
                        <Text style={styles.analysisTitle}>AI Analysis Results</Text>
                    </View>
                    <View style={styles.separator} />
                    <Text style={styles.analysisContent}>{analysis}</Text>
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
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    clearButton: {
        backgroundColor: '#f8d7da',
        borderWidth: 1,
        borderColor: '#dc3545',
        marginLeft: 8,
        flex: 0.6,
    },
    imagePlaceholder: {
        height: 250,
        width: '100%',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#e9ecef',
        borderStyle: 'dashed',
        marginBottom: 20,
    },
    placeholderText: {
        marginTop: 15,
        color: '#6c757d',
        fontSize: 16,
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
    analysisHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    analysisTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0d6efd',
        marginLeft: 10,
    },
    separator: {
        height: 1,
        backgroundColor: '#e9ecef',
        marginVertical: 12,
    },
    analysisContent: {
        fontSize: 14,
        lineHeight: 20,
        color: '#212529',
        marginTop: 4,
    },
});

export default PrescriptionScanner;