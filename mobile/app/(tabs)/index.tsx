import { useRef, useState } from 'react';
import { View, Platform, StyleSheet, Text, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { SearchBar } from '@rneui/themed';
import { Link } from 'expo-router';

const sampleData = [
  "Apple1",
  "Apple2",
  "Apple3",
  "Apple4",
  "Apple5",
  "Apple6",
  "Apple7",
  "Apple8",
  "Apple9",
  "Banana",
  "Cherry",
  "Date",
  "Grape",
  "Orange",
  "Peach",
  "Strawberry",
  "Watermelon",
];

export default function HomeScreen() {
    const [search, setSearch] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchBarRef = useRef(null);

    const updateSearch = (search: string) => {
        setSearch(search);
        setShowSuggestions(search.length > 0);
    };

    const filteredData = sampleData.filter(item =>
        item.toLowerCase().startsWith(search.toLowerCase())
    );

    function handleSelect(item: string) {
        setSearch(item);
        setShowSuggestions(false);
    }

  return (
      <View style={{ flex: 1 }}>
          {Platform.OS === 'ios' ? (
              <SearchBar platform="ios" placeholder="Type Here..." onChangeText={updateSearch} value={search} clearIcon showCancel={true} ref={searchBarRef} onFocus={() => setShowSuggestions(search.length > 0)} onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} />
          ) : (
              <SearchBar platform="android" placeholder="Type Here..." onChangeText={updateSearch} value={search} ref={searchBarRef} onFocus={() => setShowSuggestions(search.length > 0)} onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} />
          )}

          {/* Suggestions dropdown absolutely positioned */}
          {showSuggestions && filteredData.length > 0 && (
              <View style={styles.suggestionDropdown}>
                  <FlatList keyboardShouldPersistTaps="handled" data={filteredData} keyExtractor={item => item} renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => handleSelect(item)} style={styles.suggestionTouchable} >
                          <Text style={styles.suggestionText}>{item}</Text>
                      </TouchableOpacity>
                  )}
              />
              </View>
          )}

          <Text style={styles.titleContainer}>Brukdjah</Text>
          <Link href="/login" style={styles.titleContainer}>login</Link>
      </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 24,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
    suggestionDropdown: {
        position: 'absolute',
        top: 60, // Stays at 68 from the top
        left: 0,
        right: 0, // Stretch to both edges horizontally
        bottom: 0, // Take up all available space below 'top'
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 8,
        elevation: 8,
        zIndex: 100,
        // maxHeight: 200, // Remove this to allow full height
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 10,
    },
    suggestionTouchable: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        borderRadius: 0, // Not rounded
    },
    suggestionText: {
        fontSize: 16,
    },
});
