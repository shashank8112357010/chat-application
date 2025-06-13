import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { MessageCircle, Search, Send, Mail, Phone } from 'lucide-react-native';
import { EmailService } from '@/components/EmailService';
import { NotificationService } from '@/components/NotificationService';
import { IVRService } from '@/components/IVRService';

interface ChatMessage {
  id: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
  isRead: boolean;
}

interface ChatConversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline: boolean;
  phoneNumber?: string;
  email?: string;
  messages: ChatMessage[];
}

export default function ChatScreen() {
  const [conversations, setConversations] = useState<ChatConversation[]>([
    {
      id: '1',
      name: 'Harsh',
      lastMessage: 'Hey! How are you doing?',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      unreadCount: 2,
      isOnline: true,
      phoneNumber: '+258789654123',
      email: 'harsh@example.com',
      messages: [
        {
          id: '1',
          text: 'Hi there!',
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          isOwn: false,
          isRead: true,
        },
        {
          id: '2',
          text: 'Hello! Nice to meet you',
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          isOwn: true,
          isRead: true,
        },
        {
          id: '3',
          text: 'Hey! How are you doing?',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          isOwn: false,
          isRead: false,
        },
      ],
    },
    {
      id: '2',
      name: 'Clo',
      lastMessage: 'Thanks for the call earlier!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 0,
      isOnline: true,
      phoneNumber: '+258789654124',
      email: 'clo@example.com',
      messages: [
        {
          id: '1',
          text: 'Thanks for the call earlier!',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isOwn: false,
          isRead: true,
        },
      ],
    },
    {
      id: '3',
      name: 'Gloria',
      lastMessage: 'Would love to chat more!',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      unreadCount: 1,
      isOnline: false,
      phoneNumber: '+258789654125',
      email: 'gloria@example.com',
      messages: [
        {
          id: '1',
          text: 'Would love to chat more!',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          isOwn: false,
          isRead: false,
        },
      ],
    },
  ]);

  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const conversation = conversations.find(c => c.id === selectedChat);
    if (!conversation) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      timestamp: new Date(),
      isOwn: true,
      isRead: true,
    };

    // Update conversation
    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedChat) {
        return {
          ...conv,
          messages: [...conv.messages, message],
          lastMessage: message.text,
          timestamp: message.timestamp,
        };
      }
      return conv;
    }));

    // Send email notification to the recipient
    if (conversation.email) {
      await NotificationService.sendEmailNotification(
        conversation.email,
        'message',
        {
          senderName: 'Tonyah',
          messagePreview: newMessage.trim(),
        }
      );
    }

    setNewMessage('');
  };

  const handleCall = async (conversation: ChatConversation) => {
    if (!conversation.phoneNumber) {
      Alert.alert('Error', 'Phone number not available');
      return;
    }

    const menuOptions = IVRService.createBomPapoIVRMenu(
      () => {
        // Continue chat
        setSelectedChat(conversation.id);
      },
      () => {
        // Voice call
        IVRService.makeCall({
          phoneNumber: conversation.phoneNumber!,
          displayName: conversation.name,
        });
      },
      () => {
        // Video call
        Alert.alert('Video Call', `Starting video call with ${conversation.name}`);
      },
      () => {
        // Leave message
        Alert.alert('Voice Message', `Voice message sent to ${conversation.name}`);
      }
    );

    await IVRService.initiateIVRCall(
      conversation.phoneNumber,
      'Tonyah',
      menuOptions
    );
  };

  const handleEmailContact = async (conversation: ChatConversation) => {
    if (!conversation.email) {
      Alert.alert('Error', 'Email address not available');
      return;
    }

    const success = await EmailService.sendEmail({
      recipients: [conversation.email],
      subject: `Message from BomPapo - Tonyah`,
      body: `Hi ${conversation.name},\n\nI'd like to connect with you through BomPapo!\n\nBest regards,\nTonyah`,
    });

    if (success) {
      Alert.alert('Email Sent', `Email sent to ${conversation.name}`);
    } else {
      Alert.alert('Error', 'Failed to send email');
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  const selectedConversation = conversations.find(c => c.id === selectedChat);

  if (selectedChat && selectedConversation) {
    return (
      <View style={styles.container}>
        <View style={styles.chatHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedChat(null)}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.chatHeaderInfo}>
            <Text style={styles.chatHeaderName}>{selectedConversation.name}</Text>
            <Text style={styles.chatHeaderStatus}>
              {selectedConversation.isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>

          <View style={styles.chatHeaderActions}>
            <TouchableOpacity 
              style={styles.headerActionButton}
              onPress={() => handleEmailContact(selectedConversation)}
            >
              <Mail size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerActionButton}
              onPress={() => handleCall(selectedConversation)}
            >
              <Phone size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
          {selectedConversation.messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageItem,
                message.isOwn ? styles.ownMessage : styles.otherMessage,
              ]}
            >
              <Text style={[
                styles.messageText,
                message.isOwn ? styles.ownMessageText : styles.otherMessageText,
              ]}>
                {message.text}
              </Text>
              <Text style={[
                styles.messageTime,
                message.isOwn ? styles.ownMessageTime : styles.otherMessageTime,
              ]}>
                {formatTime(message.timestamp)}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.messageInputContainer}>
          <TextInput
            style={styles.messageInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            multiline
          />
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={handleSendMessage}
          >
            <Send size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search conversations..."
          placeholderTextColor="#999"
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredConversations.length === 0 ? (
          <View style={styles.emptyState}>
            <MessageCircle size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No conversations found' : 'No Chats Yet'}
            </Text>
            <Text style={styles.emptyText}>
              {searchQuery 
                ? 'Try searching with a different name'
                : 'Start a conversation with someone from the Discover tab'
              }
            </Text>
          </View>
        ) : (
          <View style={styles.conversationList}>
            {filteredConversations.map((conversation) => (
              <TouchableOpacity
                key={conversation.id}
                style={styles.conversationItem}
                onPress={() => setSelectedChat(conversation.id)}
              >
                <View style={styles.avatarContainer}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {conversation.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  {conversation.isOnline && <View style={styles.onlineIndicator} />}
                </View>

                <View style={styles.conversationInfo}>
                  <View style={styles.conversationHeader}>
                    <Text style={styles.conversationName}>{conversation.name}</Text>
                    <Text style={styles.conversationTime}>
                      {formatTime(conversation.timestamp)}
                    </Text>
                  </View>
                  <Text style={styles.lastMessage} numberOfLines={1}>
                    {conversation.lastMessage}
                  </Text>
                </View>

                <View style={styles.conversationMeta}>
                  {conversation.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadCount}>
                        {conversation.unreadCount}
                      </Text>
                    </View>
                  )}
                  
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleEmailContact(conversation)}
                    >
                      <Mail size={16} color="#E53E3E" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleCall(conversation)}
                    >
                      <Phone size={16} color="#E53E3E" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#E53E3E',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  searchButton: {
    padding: 5,
  },
  searchContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  conversationList: {
    gap: 15,
  },
  conversationItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E53E3E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  conversationTime: {
    fontSize: 12,
    color: '#999',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  conversationMeta: {
    alignItems: 'flex-end',
    gap: 8,
  },
  unreadBadge: {
    backgroundColor: '#E53E3E',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 6,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
  // Chat view styles
  chatHeader: {
    backgroundColor: '#E53E3E',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  backText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatHeaderName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  chatHeaderStatus: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  chatHeaderActions: {
    flexDirection: 'row',
    gap: 10,
  },
  headerActionButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
  },
  messageItem: {
    marginBottom: 15,
    maxWidth: '80%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#E53E3E',
    borderRadius: 18,
    borderBottomRightRadius: 4,
    padding: 12,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
  },
  ownMessageTime: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
  },
  otherMessageTime: {
    color: '#999',
  },
  messageInputContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#E53E3E',
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});