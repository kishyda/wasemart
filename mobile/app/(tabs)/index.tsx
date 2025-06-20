import { useRef, useState } from "react";
import { View, Platform, StyleSheet, Text, FlatList, TouchableOpacity, Dimensions, Image } from "react-native";
import { SearchBar } from "@rneui/themed";
import { Link } from "expo-router";
import Bazaar from "@/components/ui/Bazaar";
import Categories from "@/components/ui/Categories";
import BackendUrl from "@/constants/BackendUrl";

export default function HomeScreen() {
    const [search, setSearch] = useState("");
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("");
    const searchBarRef = useRef(null);
    let timeoutRef = useRef<number>(0);

    const updateSearch = (search: string) => {
        clearTimeout(timeoutRef.current);
        setSearch(search);
        timeoutRef.current = setTimeout(() => {
            setQuery(search.trim().toLowerCase());
        }, 500)
    };

    return (
        <View style={{ flex: 1 }}>
            {Platform.OS === "ios" ? (
                <SearchBar
                    platform="ios"
                    placeholder="Type Here..."
                    onChangeText={updateSearch}
                    value={search}
                    clearIcon
                    searchIcon={{ name: "search", size: 24 }}
                    showCancel={true}
                    ref={searchBarRef}
                />
            ) : (
                <SearchBar
                    platform="android"
                    placeholder="Type Here..."
                    onChangeText={updateSearch}
                    value={search}
                    ref={searchBarRef}
                />
            )}
            <Categories categories={["All Categories", "Electronics", "somethingelse"]}setCategory={setCategory}/>
            <Bazaar query={query} category={category}/>
        </View>
    );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
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
        position: "absolute",
    },
    suggestionDropdown: {
        position: "absolute",
        top: 60, // Stays at 68 from the top
        left: 0,
        right: 0, // Stretch to both edges horizontally
        bottom: 0, // Take up all available space below 'top'
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#aaa",
        borderRadius: 8,
        elevation: 8,
        zIndex: 100,
        // maxHeight: 200, // Remove this to allow full height
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 10,
    },
    suggestionTouchable: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        borderRadius: 0, // Not rounded
    },
    suggestionText: {
        fontSize: 16,
    },
});
