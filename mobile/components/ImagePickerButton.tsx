import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons'; // You might need to install @expo/vector-icons

interface ImagePickerButtonProps {
    images: string[]; // Array of image URIs
    onImagesChange: (newImages: string[]) => void;
    maxImages?: number;
}

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 60) / 6; // 3 images per row, with some padding

export const ImagePickerButton: React.FC<ImagePickerButtonProps> = ({ images, onImagesChange, maxImages = 5 }) => {
    const pickImage = async () => {
        // Request media library permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Please grant media library permissions to select photos.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true, // Allow multiple selections
            selectionLimit: maxImages - images.length, // Limit to remaining slots
            quality: 0.7, // Reduce quality for faster uploads
        });

        if (!result.canceled) {
            const newUris = result.assets.map(asset => asset.uri);
            onImagesChange([...images, ...newUris]);
        }
    };

    const removeImage = (uriToRemove: string) => {
        onImagesChange(images.filter(uri => uri !== uriToRemove));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Pictures (Max {maxImages})</Text>
            <View style={styles.imageGrid}>
                <FlatList
                    data={images}
                    scrollEnabled={false}
                    horizontal={false}
                    numColumns={5}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <View style={styles.imageWrapper}>
                            <Image source={{ uri: item }} style={styles.image} />
                            <TouchableOpacity
                                onPress={() => removeImage(item)}
                                style={styles.removeButton}
                            >
                                <MaterialIcons name="close" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    )}
                    ListEmptyComponent={() => (
                        <Text style={styles.noImagesText}>No images selected.</Text>
                    )}
                />
                {images.length < maxImages && (
                    <TouchableOpacity onPress={pickImage} style={styles.addButton}>
                        <MaterialIcons name="add-a-photo" size={30} color="#666" />
                        <Text style={styles.addButtonText}>Add Photo</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'flex-start',
    },
    imageWrapper: {
        position: 'relative',
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#e0e0e0',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    removeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 15,
        padding: 3,
    },
    addButton: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderStyle: 'dashed',
    },
    addButtonText: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    noImagesText: {
        fontStyle: 'italic',
        color: '#888',
        marginTop: 5,
        marginLeft: 10,
    },
});
