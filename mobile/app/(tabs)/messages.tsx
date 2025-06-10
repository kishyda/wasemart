import React from 'react';
import { FlatList, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

// Sample data types
type User = {
    id: string;
    name: string;
    avatarUrl?: string;
};

type Message = {
    id: string;
    chatId: string;
    senderId: string;
    content: string;
    createdAt: string;
};

type Chat = {
    id: string;
    buyer: string;
    seller: string;
    adId: string;
    createdAt: string;
    buyerUser: User;
    sellerUser: User;
    lastMessage: Message;
};

// Simulated current user
const currentUserId = 'user-1';

// Sample users
const users: Record<string, User> = {
  'user-1': { id: 'user-1', name: 'Alice', avatarUrl: undefined },
  'user-2': { id: 'user-2', name: 'Bob', avatarUrl: undefined },
  'user-3': { id: 'user-3', name: 'Carol', avatarUrl: undefined },
};

// Sample chats
const chats: Chat[] = [
    {
        id: 'chat-1',
        buyer: 'user-1',
        seller: 'user-2',
        adId: 'ad-1',
        createdAt: '2025-05-30T10:10:00Z',
        buyerUser: users['user-1'],
        sellerUser: users['user-2'],
        lastMessage: {
            id: 'msg-1',
            chatId: 'chat-1',
            senderId: 'user-2',
            content: 'Hi, are you still interested?',
            createdAt: '2025-05-31T12:40:00Z',
        },
    },
    {
        id: 'chat-2',
        buyer: 'user-3',
        seller: 'user-1',
        adId: 'ad-2',
        createdAt: '2025-05-29T14:00:00Z',
        buyerUser: users['user-3'],
        sellerUser: users['user-1'],
        lastMessage: {
            id: 'msg-2',
            chatId: 'chat-2',
            senderId: 'user-1',
            content: 'Yes, it is still available!',
            createdAt: '2025-05-31T12:00:00Z',
        },
    },
    {
        id: 'chat-3',
        buyer: 'user-1',
        seller: 'user-3',
        adId: 'ad-3',
        createdAt: '2025-05-28T08:30:00Z',
        buyerUser: users['user-1'],
        sellerUser: users['user-3'],
        lastMessage: {
            id: 'msg-3',
            chatId: 'chat-3',
            senderId: 'user-1',
            content: 'Can I pick up tomorrow?',
            createdAt: '2025-05-30T20:00:00Z',
        },
    },
];

const renderItem = ({ item }: { item: Chat }) => {

    const router = useRouter();
    const otherUser = item.buyer === currentUserId ? item.sellerUser : item.buyerUser;

    const handleChatPress = () => {
        router.push(`/(nontabs)/chat/${item.id}`);
    };

    return (
        <TouchableOpacity style={styles.chatItem} onPress={handleChatPress} >
            <Image source={ otherUser.avatarUrl ? { uri: otherUser.avatarUrl } : require('../../assets/images/icon.png') } style={styles.avatar} />
            <View style={styles.chatInfo}>
                <Text style={styles.userName}>{otherUser.name}</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>
                    {item.lastMessage?.content || "No messages yet"}
                </Text>
            </View>
            <View style={styles.rightSection}>
                <Text style={styles.timestamp}>
                    {item.lastMessage ? new Date(item.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export const ChatListScreen: React.FC = () => {
    return (
        <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
            <FlatList 
                data={chats} 
                keyExtractor={item => item.id} 
                renderItem={renderItem} 
                contentContainerStyle={styles.listContent} 
                ItemSeparatorComponent={() => <View style={styles.separator} />} 
            />
        </View>
    );
};

const styles = StyleSheet.create({
    listContent: {
        backgroundColor: '#fff',
        paddingVertical: 8,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
        backgroundColor: '#eee',
    },
    chatInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#222',
    },
    lastMessage: {
        color: '#666',
        fontSize: 14,
        marginTop: 2,
    },
    rightSection: {
        alignItems: 'flex-end',
        minWidth: 60,
    },
    timestamp: {
        color: '#aaa',
        fontSize: 12,
    },
    separator: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginLeft: 76,
    },
});
