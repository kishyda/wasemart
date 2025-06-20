import React, { useState, useRef, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons'; // Using Feather icons for the send button
import { Stack } from 'expo-router';

// Get screen dimensions for responsive styling
const { width, height } = Dimensions.get('window');

// Sample data for the chat messages
const initialMessages = [
    { id: '1', text: 'Hey there!', sender: 'user', timestamp: '10:00 AM' },
    { id: '2', text: 'Hi! How are you doing?', sender: 'sendee', timestamp: '10:01 AM' },
    { id: '3', text: "I'm good, thanks! Just chilling.", sender: 'user', timestamp: '10:03 AM' }, // Fixed: Escaped apostrophe
    { id: '4', text: 'Nice! What are you up to later?', sender: 'sendee', timestamp: '10:05 AM' },
    { id: '5', text: 'Thinking of grabbing some coffee.', sender: 'user', timestamp: '10:06 AM' },
    { id: '6', text: 'Sounds good! Maybe I can join?', sender: 'sendee', timestamp: '10:07 AM' },
    { id: '7', text: 'Sure! Let\'s meet at 3 PM?', sender: 'user', timestamp: '10:08 AM' }, // Fixed: Escaped apostrophe
    { id: '8', text: 'Perfect!', sender: 'sendee', timestamp: '10:09 AM' },
];

// Sample sendee (recipient) information
const sendeeInfo = {
    name: 'Alice',
    status: 'Online',
    avatar: 'https://placehold.co/50x50/A133FF/FFFFFF?text=A', // Placeholder for avatar
};

// Message Bubble Component
const MessageBubble = ({ message }: any) => (
    <View
        style={[
            styles.messageBubble,
            message.sender === 'user' ? styles.userMessage : styles.sendeeMessage,
        ]}
    >
        <Text
            style={[
                styles.messageText,
                message.sender === 'user' ? styles.userMessageText : styles.sendeeMessageText,
            ]}
        >
            {message.text}
        </Text>
        <Text
            style={[
                styles.messageTimestamp,
                message.sender === 'user' ? styles.userMessageTimestamp : styles.sendeeMessageTimestamp,
            ]}
        >
            {message.timestamp}
        </Text>
    </View>
);

export default function App() {
    const [messages, setMessages] = useState(initialMessages);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    // Scroll to the end of the FlatList when new messages are added
    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current?.scrollToEnd({ animated: true });
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (inputText.trim()) {
            const newMessage = {
                id: String(messages.length + 1),
                text: inputText.trim(),
                sender: 'user',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages([...messages, newMessage]);
            setInputText('');
            // Simulate a response after a short delay
            setTimeout(() => {
                const responseMessage = {
                    id: String(messages.length + 2),
                    text: `Got your message about "${inputText.trim()}"!`,
                    sender: 'sendee',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };
                setMessages((prevMessages) => [...prevMessages, responseMessage]);
            }, 1000);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Top Section: Sendee Info */}
            {/* <View style={styles.headerContainer}> */}
            {/*     <Feather name="arrow-left" size={24} color="#333" style={styles.backIcon} /> */}
            {/*     <View style={styles.sendeeAvatarContainer}> */}
            {/*         <Image /> */}
            {/*         <View style={[styles.statusIndicator, sendeeInfo.status === 'Online' ? styles.online : styles.offline]} /> */}
            {/*     </View> */}
            {/*     <View style={styles.sendeeInfo}> */}
            {/*         <Text style={styles.sendeeName}>{sendeeInfo.name}</Text> */}
            {/*         <Text style={styles.sendeeStatus}>{sendeeInfo.status}</Text> */}
            {/*     </View> */}
            {/*     <Feather name="more-vertical" size={24} color="#333" style={styles.moreIcon} /> */}
            {/* </View> */}
            <Stack.Screen options={{ title: sendeeInfo.name }}/>

            {/* Middle Section: Chat Messages */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={({ item }) => <MessageBubble message={item} />}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messagesContainer}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })} // Keep scrolled to bottom
            />

            {/* Bottom Section: Input Field */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20} // Adjust based on your header/tab bar
                style={styles.inputContainer}
            >
                <TextInput
                    style={styles.textInput}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type your message..."
                    placeholderTextColor="#888"
                    multiline={true} // Allow multiple lines of text
                    onBlur={() => { /* This is a common pattern to manage keyboard dismissal if needed */ }}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                    <Feather name="send" size={24} color="#fff" />
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5', // Light background for the chat page
    },
    // Header Styles
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    backIcon: {
        marginRight: 15,
    },
    sendeeAvatarContainer: {
        position: 'relative',
        marginRight: 10,
    },
    sendeeAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ccc', // Placeholder background
    },
    statusIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#fff',
    },
    online: {
        backgroundColor: '#4CAF50', // Green for online
    },
    offline: {
        backgroundColor: '#FFC107', // Yellow for offline
    },
    sendeeInfo: {
        flex: 1, // Takes up remaining space
    },
    sendeeName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    sendeeStatus: {
        fontSize: 14,
        color: '#666',
    },
    moreIcon: {
        marginLeft: 15,
    },

    // Messages Container Styles
    messagesContainer: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    messageBubble: {
        maxWidth: '80%',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginBottom: 8,
        elevation: 1, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1.5,
    },
    userMessage: {
        alignSelf: 'flex-end', // Align to right for user messages
        backgroundColor: '#007bff', // Blue background for user
        borderBottomRightRadius: 5, // Slightly less rounded on the bottom right
    },
    sendeeMessage: {
        alignSelf: 'flex-start', // Align to left for sendee messages
        backgroundColor: '#fff', // White background for sendee
        borderBottomLeftRadius: 5, // Slightly less rounded on the bottom left
    },
    messageText: {
        fontSize: 16,
    },
    userMessageText: {
        color: '#fff', // White text for user messages
    },
    sendeeMessageText: {
        color: '#333', // Dark text for sendee messages
    },
    messageTimestamp: {
        fontSize: 10,
        marginTop: 4,
    },
    userMessageTimestamp: {
        color: 'rgba(255,255,255,0.7)', // Lighter white timestamp for user
        textAlign: 'right',
    },
    sendeeMessageTimestamp: {
        color: '#999', // Gray timestamp for sendee
        textAlign: 'left',
    },

    // Input Container Styles
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    textInput: {
        flex: 1,
        minHeight: 40,
        maxHeight: 120, // Prevent input from growing too large
        backgroundColor: '#f8f8f8',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: Platform.OS === 'ios' ? 10 : 8, // Adjust vertical padding for platforms
        fontSize: 16,
        marginRight: 10,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    sendButton: {
        backgroundColor: '#007bff', // Blue send button
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
});
