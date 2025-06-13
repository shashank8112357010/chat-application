import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Camera, MapPin, CreditCard as Edit3, Mail } from 'lucide-react-native';
import { EmailService } from '@/components/EmailService';

const { width } = Dimensions.get('window');

interface ProfileData {
  gender: 'male' | 'female' | null;
  chatName: string;
  age: string;
  languages: string;
  city: string;
  hobby: string;
  interest: string;
  email: string;
  phoneNumber: string;
}

export default function ProfileSetupScreen() {
  const [profileData, setProfileData] = useState<ProfileData>({
    gender: null,
    chatName: '',
    age: '',
    languages: '',
    city: '',
    hobby: '',
    interest: '',
    email: '',
    phoneNumber: '',
  });

  const handleComplete = async () => {
    // Validate required fields
    if (!profileData.chatName || !profileData.age || !profileData.email) {
      Alert.alert('Error', 'Please fill in all required fields (Name, Age, Email)');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      // Send welcome email
      const emailSent = await EmailService.sendWelcomeEmail(
        profileData.email,
        profileData.chatName
      );

      if (emailSent) {
        Alert.alert(
          'Welcome to BomPapo!',
          'Your profile has been created successfully. A welcome email has been sent to your email address.',
          [
            {
              text: 'Continue',
              onPress: () => router.push('/(tabs)'),
            },
          ]
        );
      } else {
        // Still proceed even if email fails
        Alert.alert(
          'Profile Created',
          'Your profile has been created successfully. However, we couldn\'t send the welcome email. Please check your email settings.',
          [
            {
              text: 'Continue',
              onPress: () => router.push('/(tabs)'),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error during profile completion:', error);
      Alert.alert(
        'Profile Created',
        'Your profile has been created successfully.',
        [
          {
            text: 'Continue',
            onPress: () => router.push('/(tabs)'),
          },
        ]
      );
    }
  };

  const handleBack = () => {
    router.back();
  };

  const updateProfile = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const testEmailService = async () => {
    if (!profileData.email) {
      Alert.alert('Error', 'Please enter an email address first');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    const success = await EmailService.sendEmail({
      recipients: [profileData.email],
      subject: 'BomPapo Email Test',
      body: 'This is a test email from BomPapo. Your email integration is working correctly!',
    });

    if (success) {
      Alert.alert('Success', 'Test email sent successfully!');
    } else {
      Alert.alert('Error', 'Failed to send test email. Please check your email address.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Setup</Text>
        <TouchableOpacity style={styles.emailTestButton} onPress={testEmailService}>
          <Mail size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.photoSection}>
          <View style={styles.photoContainer}>
            <Camera size={40} color="#E53E3E" />
          </View>
          <View style={styles.photoSlider}>
            <View style={styles.sliderTrack} />
            <View style={styles.sliderHandle} />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Complete Your Profile</Text>
          
          <View style={styles.genderOptions}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                profileData.gender === 'male' && styles.selectedGender,
              ]}
              onPress={() => updateProfile('gender', 'male')}
            >
              <View style={styles.genderIcon} />
              <Text style={styles.genderText}>Male</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.genderButton,
                profileData.gender === 'female' && styles.selectedGender,
              ]}
              onPress={() => updateProfile('gender', 'female')}
            >
              <View style={[styles.genderIcon, styles.femaleIcon]} />
              <Text style={styles.genderText}>Female</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Chat Name *</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.chatName}
              onChangeText={(value) => updateProfile('chatName', value)}
              placeholder="Enter your chat name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address *</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.email}
              onChangeText={(value) => updateProfile('email', value)}
              placeholder="Enter your email address"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.phoneNumber}
              onChangeText={(value) => updateProfile('phoneNumber', value)}
              placeholder="Enter your phone number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Age *</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.age}
              onChangeText={(value) => updateProfile('age', value)}
              placeholder="Enter your age"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Preferred Language(s)</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.languages}
              onChangeText={(value) => updateProfile('languages', value)}
              placeholder="e.g., English, Portuguese"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>City</Text>
            <View style={styles.inputWithIcon}>
              <TextInput
                style={[styles.textInput, { flex: 1 }]}
                value={profileData.city}
                onChangeText={(value) => updateProfile('city', value)}
                placeholder="Enter your city"
                placeholderTextColor="#999"
              />
              <TouchableOpacity style={styles.inputIcon}>
                <Edit3 size={20} color="#E53E3E" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Hobby</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.hobby}
              onChangeText={(value) => updateProfile('hobby', value)}
              placeholder="Enter your hobby"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Chat Interest</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.interest}
              onChangeText={(value) => updateProfile('interest', value)}
              placeholder="Enter your interest"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.infoBox}>
            <Mail size={16} color="#E53E3E" />
            <Text style={styles.infoText}>
              We'll send you a welcome email and important notifications about your BomPapo account.
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
          <Text style={styles.completeText}>Complete Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  emailTestButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  photoSection: {
    backgroundColor: '#E53E3E',
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  photoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  photoSlider: {
    width: width - 80,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 2,
  },
  sliderHandle: {
    position: 'absolute',
    left: 20,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  formSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E53E3E',
    textAlign: 'center',
    marginBottom: 20,
  },
  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  genderButton: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    minWidth: 100,
  },
  selectedGender: {
    backgroundColor: '#FFE5E5',
    borderWidth: 2,
    borderColor: '#E53E3E',
  },
  genderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    marginBottom: 8,
  },
  femaleIcon: {
    backgroundColor: '#E53E3E',
  },
  genderText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#E53E3E',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputIcon: {
    padding: 8,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F8FF',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  completeButton: {
    backgroundColor: '#E53E3E',
    marginHorizontal: 20,
    marginVertical: 30,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});