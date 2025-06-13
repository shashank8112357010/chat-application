import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { Phone, PhoneCall, PhoneIncoming, PhoneOutgoing, Clock, Mail } from 'lucide-react-native';
import { IVRService, CallOptions } from '@/components/IVRService';
import { EmailService } from '@/components/EmailService';
import { NotificationService } from '@/components/NotificationService';

interface CallRecord {
  id: string;
  name: string;
  phoneNumber: string;
  type: 'incoming' | 'outgoing' | 'missed';
  duration: string;
  timestamp: Date;
  isIVR?: boolean;
}

export default function CallScreen() {
  const [callHistory, setCallHistory] = useState<CallRecord[]>([
    {
      id: '1',
      name: 'Harsh',
      phoneNumber: '+258789654123',
      type: 'outgoing',
      duration: '5:23',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isIVR: true,
    },
    {
      id: '2',
      name: 'Clo',
      phoneNumber: '+258789654124',
      type: 'incoming',
      duration: '12:45',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: '3',
      name: 'Gloria',
      phoneNumber: '+258789654125',
      type: 'missed',
      duration: '0:00',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  ]);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCallAvailable, setIsCallAvailable] = useState(false);

  useEffect(() => {
    checkCallAvailability();
  }, []);

  const checkCallAvailability = async () => {
    const available = await IVRService.isCallAvailable();
    setIsCallAvailable(available);
  };

  const handleDirectCall = async (callOptions: CallOptions) => {
    const success = await IVRService.makeCall(callOptions);
    if (success) {
      // Add to call history
      const newCall: CallRecord = {
        id: Date.now().toString(),
        name: callOptions.displayName || 'Unknown',
        phoneNumber: callOptions.phoneNumber,
        type: 'outgoing',
        duration: '0:00',
        timestamp: new Date(),
      };
      setCallHistory(prev => [newCall, ...prev]);
    } else {
      Alert.alert('Call Failed', 'Unable to make the call. Please try again.');
    }
  };

  const handleIVRCall = async (targetNumber: string, targetName: string) => {
    const menuOptions = IVRService.createBomPapoIVRMenu(
      () => {
        // Start chat
        Alert.alert('Chat Started', `Starting chat with ${targetName}`);
      },
      () => {
        // Voice call
        handleDirectCall({ phoneNumber: targetNumber, displayName: targetName });
      },
      () => {
        // Video call
        Alert.alert('Video Call', `Starting video call with ${targetName}`);
      },
      () => {
        // Leave message
        handleLeaveMessage(targetNumber, targetName);
      }
    );

    const success = await IVRService.initiateIVRCall(targetNumber, 'Tonyah', menuOptions);
    if (success) {
      const newCall: CallRecord = {
        id: Date.now().toString(),
        name: targetName,
        phoneNumber: targetNumber,
        type: 'outgoing',
        duration: '0:00',
        timestamp: new Date(),
        isIVR: true,
      };
      setCallHistory(prev => [newCall, ...prev]);
    }
  };

  const handleLeaveMessage = async (phoneNumber: string, name: string) => {
    // Send email notification about voice message
    const success = await NotificationService.sendEmailNotification(
      'user@example.com', // Replace with actual user email
      'call',
      {
        callerName: 'Tonyah',
        callTime: new Date().toLocaleString(),
        duration: 'Voice message left',
      }
    );

    if (success) {
      Alert.alert('Message Sent', `Voice message notification sent to ${name}`);
    }
  };

  const handleQuickCall = () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }

    const formattedNumber = IVRService.formatPhoneNumber(phoneNumber);
    handleDirectCall({ phoneNumber: phoneNumber, displayName: formattedNumber });
  };

  const getCallIcon = (type: string, isIVR?: boolean) => {
    const iconProps = { size: 20, color: getCallIconColor(type) };
    
    if (isIVR) {
      return <PhoneCall {...iconProps} />;
    }
    
    switch (type) {
      case 'incoming':
        return <PhoneIncoming {...iconProps} />;
      case 'outgoing':
        return <PhoneOutgoing {...iconProps} />;
      case 'missed':
        return <Phone {...iconProps} />;
      default:
        return <Phone {...iconProps} />;
    }
  };

  const getCallIconColor = (type: string) => {
    switch (type) {
      case 'incoming':
        return '#4CAF50';
      case 'outgoing':
        return '#2196F3';
      case 'missed':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calls</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => Alert.alert('Email', 'Email integration active')}
          >
            <Mail size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <PhoneCall size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Call Section */}
        <View style={styles.quickCallSection}>
          <Text style={styles.sectionTitle}>Quick Call</Text>
          <View style={styles.quickCallContainer}>
            <TextInput
              style={styles.phoneInput}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter phone number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
            <TouchableOpacity 
              style={[styles.callButton, !isCallAvailable && styles.callButtonDisabled]}
              onPress={handleQuickCall}
              disabled={!isCallAvailable}
            >
              <Phone size={20} color="white" />
            </TouchableOpacity>
          </View>
          {!isCallAvailable && (
            <Text style={styles.warningText}>
              Calling not available on this platform
            </Text>
          )}
        </View>

        {/* Call History */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Recent Calls</Text>
          
          {callHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <Phone size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>No Calls Yet</Text>
              <Text style={styles.emptyText}>
                Your call history will appear here once you start making calls
              </Text>
            </View>
          ) : (
            <View style={styles.callList}>
              {callHistory.map((call) => (
                <TouchableOpacity 
                  key={call.id} 
                  style={styles.callItem}
                  onPress={() => handleIVRCall(call.phoneNumber, call.name)}
                >
                  <View style={styles.callIconContainer}>
                    {getCallIcon(call.type, call.isIVR)}
                  </View>
                  
                  <View style={styles.callInfo}>
                    <Text style={styles.callName}>{call.name}</Text>
                    <View style={styles.callDetails}>
                      <Text style={styles.callNumber}>
                        {IVRService.formatPhoneNumber(call.phoneNumber)}
                      </Text>
                      {call.isIVR && (
                        <Text style={styles.ivrBadge}>IVR</Text>
                      )}
                    </View>
                  </View>
                  
                  <View style={styles.callMeta}>
                    <View style={styles.durationContainer}>
                      <Clock size={12} color="#666" />
                      <Text style={styles.callDuration}>{call.duration}</Text>
                    </View>
                    <Text style={styles.callTime}>
                      {formatTimeAgo(call.timestamp)}
                    </Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.callBackButton}
                    onPress={() => handleDirectCall({ 
                      phoneNumber: call.phoneNumber, 
                      displayName: call.name 
                    })}
                  >
                    <Phone size={18} color="#E53E3E" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* IVR Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>IVR Features</Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <PhoneCall size={16} color="#E53E3E" />
              <Text style={styles.featureText}>Interactive Voice Response</Text>
            </View>
            <View style={styles.featureItem}>
              <Mail size={16} color="#E53E3E" />
              <Text style={styles.featureText}>Email Notifications</Text>
            </View>
            <View style={styles.featureItem}>
              <Phone size={16} color="#E53E3E" />
              <Text style={styles.featureText}>Call Recording & History</Text>
            </View>
          </View>
        </View>
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
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  quickCallSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  quickCallContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  callButton: {
    backgroundColor: '#E53E3E',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButtonDisabled: {
    backgroundColor: '#ccc',
  },
  warningText: {
    fontSize: 12,
    color: '#F44336',
    marginTop: 5,
    textAlign: 'center',
  },
  historySection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  callList: {
    gap: 15,
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  callIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  callInfo: {
    flex: 1,
  },
  callName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  callDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  callNumber: {
    fontSize: 14,
    color: '#666',
  },
  ivrBadge: {
    fontSize: 10,
    color: '#E53E3E',
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: '600',
  },
  callMeta: {
    alignItems: 'flex-end',
    marginRight: 10,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  callDuration: {
    fontSize: 12,
    color: '#666',
  },
  callTime: {
    fontSize: 12,
    color: '#999',
  },
  callBackButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
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
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
  },
});