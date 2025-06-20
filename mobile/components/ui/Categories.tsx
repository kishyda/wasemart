import { useState, Dispatch, SetStateAction } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';

// Get the full screen width to help with responsive sizing if needed
const screenWidth = Dimensions.get('window').width;

// Individual Category Item Component
// This component displays a single category and handles its selection state.
const CategoryItem = ({ category, isSelected, onSelectCategory }: any) => (
    <TouchableOpacity
        style={[
            styles.categoryButton,
            isSelected ? styles.categoryButtonSelected : {}, // Apply selected style if true
        ]}
        onPress={() => onSelectCategory(category)} // Pass the category ID on press
    >
        <Text
            style={[
                styles.categoryButtonText,
                isSelected ? styles.categoryButtonTextSelected : {}, // Apply selected text style
            ]}
        >
            {category}
        </Text>
    </TouchableOpacity>
);

// Main Category Selector Component
// This component renders the horizontal FlatList of categories.
export default function Categories({ categories, setCategory }: { categories: string[], setCategory: Dispatch<SetStateAction<string>> }) {
    // State to keep track of the currently selected category
    const [selectedCategoryId, setSelectedCategoryId] = useState('cat1'); // 'All Products' is selected by default

    // Function to handle category selection
    const handleSelectCategory = (category: string) => {
        console.log(`Category selected: ${category}`);
        setSelectedCategoryId(category); // Update the state with the new selected category ID
        setCategory(category); // Update the parent component's category state
        // In a real application, you would typically trigger data fetching here
        // based on the selected category (e.g., filter product list).
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={categories} // The data array for the list
                renderItem={({ item }) => (
                    <CategoryItem
                        category={item}
                        isSelected={item === selectedCategoryId} // Check if the current item is selected
                        onSelectCategory={handleSelectCategory} // Pass the selection handler
                    />
                )}
                keyExtractor={(item) => item} // Unique key for each item
                horizontal={true} // Enable horizontal scrolling
                showsHorizontalScrollIndicator={false} // Hide the scroll indicator
                contentContainerStyle={styles.flatListContent} // Style for the content inside FlatList
            />
            {/* Display selected category for demonstration */}
            {/* <View style={styles.selectionDisplay}> */}
            {/*   <Text style={styles.selectionText}> */}
            {/*     Currently selected: {categories.find(cat => cat.id === selectedCategoryId)?.name} */}
            {/*   </Text> */}
            {/* </View> */}
        </SafeAreaView>
    );
}

// Stylesheet for the components
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f8f8f8', // Light grey background
        paddingTop: 20,
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#333',
    },
    flatListContent: {
        paddingHorizontal: 10, // Padding at the beginning and end of the horizontal list
        paddingBottom: 10, // Padding below the list
    },
    categoryButton: {
        backgroundColor: '#e0e0e0', // Default button background
        borderRadius: 25, // Rounded pill shape
        paddingVertical: 10,
        paddingHorizontal: 18,
        marginHorizontal: 6, // Space between category buttons
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 100, // Minimum width for each button
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 2, // Android shadow
    },
    categoryButtonSelected: {
        backgroundColor: '#007bff', // Blue background when selected
    },
    categoryButtonText: {
        color: '#555', // Default text color
        fontSize: 16,
        fontWeight: '500',
    },
    categoryButtonTextSelected: {
        color: '#fff', // White text color when selected
        fontWeight: '600',
    },
    selectionDisplay: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 4,
    },
    selectionText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#444',
    },
});

