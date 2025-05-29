import { Collapsible } from "@/components/Collapsible";
import { HapticTab } from "@/components/HapticTab";
import { ThemedText } from "@/components/ThemedText";
import { Stack, Link } from "expo-router";
import { View, Text, Button } from "react-native";

export default function Testing() {
    return (
        <>
            <Stack/>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ThemedText>Bruh</ThemedText>
                <Link href="/testing/modal" asChild>
                    <Button title="Open Modal Stack" />
                </Link>
                <ThemedText>THIS IS TEXT THAT SHOULD BE SHOWING</ThemedText>
            </View>
        </>
    );
}
