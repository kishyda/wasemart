import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function ChatIdPage() {
    const thing = useLocalSearchParams();
    return (
        <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
            <Text>Chat ID Page</Text>
        </View>
    );
}
