import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, } from 'react-native';
import { ImagePickerButton } from '@/components/ImagePickerButton'; // Adjust path as needed
import Picker from '@/components/Picker';
import BackendUrl from '@/constants/BackendUrl';

// Define the shape of your form data, matching the Ad struct fields
interface ListingFormData {
    title: string;
    price: string; // Keep as string initially for TextInput
    category: string;
    description: string;
    pictures: string[]; // Array of image URIs
}

const categories = ['Electronics', 'Vehicles', 'Home & Garden', 'Fashion', 'Sports & Outdoors', 'Books', 'Services', 'Other'];

export default function CreateListingPage() {
    const [picked, setPicked] = useState<string | number>(categories[0]); // Default to first category
    const [showPicker, setShowPicker] = useState(false);
    const [formData, setFormData] = useState<ListingFormData>({
        title: '',
        price: '',
        category: categories[0], // Default to first category
        description: '',
        pictures: [],
    });

    const handleChange = (field: keyof ListingFormData, value: string | string[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {

        if (!formData.title.trim()) {
            Alert.alert('Validation Error', 'Title is required.');
            return;
        }
        if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
            Alert.alert('Validation Error', 'Valid price is required.');
            return;
        }
        if (!formData.description.trim()) {
            Alert.alert('Validation Error', 'Description is required.');
            return;
        }
        if (formData.pictures.length === 0) {
            Alert.alert('Validation Error', 'At least one picture is required.');
            return;
        }

        const formdata = new FormData();

        formdata.append('title', formData.title.trim());
        formdata.append('price', formData.price.trim());
        formdata.append('category', formData.category);
        formdata.append('description', formData.description.trim());
        formData.pictures.forEach((uri, index) => {
            formdata.append(`pictures[${index}]`, {
                uri,
                type: 'image/jpeg', // Adjust based on your image type
                name: `image_${index}.jpg`, // Name for the file
            } as any);
        });

        console.log('Form Data JSON:', JSON.stringify(formdata));

        const request = await fetch(`${BackendUrl}/ads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                // 'Authorization': `Bearer ${yourAuthToken}` // If authentication is needed
            },
            body: formdata,
        })
        Alert.alert('Listing Submitted!', 'Check your console for the data.');

    };
    const [selectedLanguage, setSelectedLanguage] = useState();

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20} // Adjust as needed
        >
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.container}>
                    <Text style={styles.header}>Create New Listing</Text>

                    {/* Title Input */}
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., Vintage Leather Jacket"
                        value={formData.title}
                        onChangeText={(text) => handleChange('title', text)}
                        maxLength={100} // Matches your Go struct
                    />

                    {/* Price Input */}
                    <Text style={styles.label}>Price</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., 50.00"
                        keyboardType="numeric" // Only numbers and decimal pad
                        value={formData.price}
                        onChangeText={(text) => {
                            // Allow only numbers and one decimal point
                            const cleanedText = text.replace(/[^0-9.]/g, '');
                            const parts = cleanedText.split('.');
                            if (parts.length > 2) {
                                // More than one decimal point, keep only the first part and the first decimal
                                handleChange('price', parts[0] + '.' + parts.slice(1).join(''));
                            } else {
                                handleChange('price', cleanedText);
                            }
                        }}
                    />

                    {/* Category Picker */}
                    <Text style={styles.label}>Category</Text>
                    <TouchableOpacity style={styles.pickerContainer} onPress={() => { setShowPicker(!showPicker) }}>
                        {showPicker ? (
                            <Picker options={categories} picked={picked} setPicked={setPicked} />
                        ) : (
                            <View style={styles.picker}>
                                <Text>{formData.category}</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Description Input */}
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Describe your item in detail..."
                        multiline
                        numberOfLines={5}
                        value={formData.description}
                        onChangeText={(text) => handleChange('description', text)}
                        maxLength={1000} // Matches your Go struct
                    />

                    {/* Image Picker Section */}
                    <ImagePickerButton
                        images={formData.pictures}
                        onImagesChange={(newImages) => handleChange('pictures', newImages)}
                        maxImages={5} // Set your desired max number of images
                    />

                    {/* Submit Button */}
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Create Listing</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingBottom: 20, // Add some padding at the bottom for keyboard
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#333',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
        color: '#333',
    },
    pickerContainer: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 20,
        overflow: 'hidden', // Ensures the picker's border-radius is respected
    },
    picker: {
        height: 50,
        width: '100%',
        color: '#333',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textArea: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
        textAlignVertical: 'top', // For Android to align text at the top
        minHeight: 100, // Make it look like a text area
        color: '#333',
    },
    submitButton: {
        backgroundColor: '#007AFF', // A common blue for action buttons
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
