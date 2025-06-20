import BackendUrl from '@/constants/BackendUrl';
import React, { useEffect } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, View, Dimensions } from 'react-native';
const screenWidth = Dimensions.get('window').width;

// Sample data for the cards. In a real application, this data would likely come from an API or a database.
const products = [
    {
        id: '1',
        title: 'Vintage Record Player',
        category: 'Electronics',
        price: '$120.00',
        imageUrl: 'https://placehold.co/200x200/FF5733/FFFFFF?text=Record+Player', // Placeholder image URL
    },
    {
        id: '2',
        title: 'Home Goods',
        category: 'Home & Kitchen',
        price: '$25.00',
        imageUrl: 'https://placehold.co/200x200/33FF57/000000?text=Ceramic+Mug', // Placeholder image URL
    },
    {
        id: '3',
        title: 'Leather Wallet',
        category: 'Fashion',
        price: '$50.00',
        imageUrl: 'https://placehold.co/200x200/3357FF/FFFFFF?text=Leather+Wallet', // Placeholder image URL
    },
    {
        id: '4',
        title: 'Gourmet Coffee Beans (250g)',
        category: 'Food & Beverages',
        price: '$18.50',
        imageUrl: 'https://placehold.co/200x200/FF33A1/FFFFFF?text=Coffee+Beans', // Placeholder image URL
    },
    {
        id: '5',
        title: 'Designer Sunglasses',
        category: 'Fashion',
        price: '$95.00',
        imageUrl: 'https://placehold.co/200x200/A133FF/FFFFFF?text=Sunglasses', // Placeholder image URL
    },
    {
        id: '6',
        title: 'Portable Bluetooth Speaker',
        category: 'Electronics',
        price: '$75.00',
        imageUrl: 'https://placehold.co/200x200/33FFA1/000000?text=Bluetooth+Speaker', // Placeholder image URL
    },
];

const Card = ({ title, price, imageUrl }: { title: string, price: string, imageUrl: string }) => (
    <View style={styles.card}>
        {/* Here, make sure to change to a flatlist to view all the images uploaded */}
        <Image
            source={{ uri: "https://picsum.photos/200/300" }}
            style={styles.cardImage}
            // Fallback for broken image URLs or network issues
            onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
        />
        <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardPrice}>{price}</Text>
        </View>
    </View>
);

export default function Bazaar({ query, category }: { query?: string, category?: string }) {
    const [products, setProducts] = useState();
    useEffect(() => {
        fetch(BackendUrl + '/ads', {}).then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then((data) => {
        })
    }, []);
    return (
        <FlatList
            data={products}
            renderItem={({ item }) =>
                ((!query || item.title.toLowerCase().includes(query.toLowerCase()))
                    && (!category || category == "All Categories" || item.category.toLowerCase().includes(category.toLowerCase()))) ? (
                    <Card
                        title={item.title}
                        price={item.price}
                        imageUrl={item.imageUrl}
                    />
                ) : null
            }
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            columnWrapperStyle={styles.row}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
        paddingTop: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#333',
    },
    listContent: {
        paddingHorizontal: 8,
        paddingBottom: 70,
    },
    row: {
        flex: 1,
        justifyContent: 'space-around',
        marginBottom: 8,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        margin: 8,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        width: (screenWidth / 2) - 24,
    },
    cardImage: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    cardContent: {
        padding: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        color: '#333',
    },
    cardPrice: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#007bff',
    },
});

