import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function PhoneVerificationScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleContinue = () => {
    if (phoneNumber.length >= 9) {
      router.push('/otp-verification');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.pexels.com/photos/1772973/pexels-photo-1772973.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      }}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(229, 62, 62, 0.9)', 'rgba(229, 62, 62, 0.7)']}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.content}>
            <Text style={styles.title}>Welcome to BomPapo</Text>

            <View style={styles.phoneSection}>
              <View style={styles.countryCode}>
                <Text style={styles.flag}>🇲🇿</Text>
                <Text style={styles.codeText}>MZ +258</Text>
              </View>

              <TextInput
                style={styles.phoneInput}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="7896541234"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                keyboardType="phone-pad"
                maxLength={9}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.continueButton,
                phoneNumber.length >= 9 && styles.continueButtonActive,
              ]}
              onPress={handleContinue}
              disabled={phoneNumber.length < 9}
            >
              <Text style={styles.continueText}>CONTINUE</Text>
            </TouchableOpacity>

            <View style={styles.termsSection}>
              <Text style={styles.termsText}>
                If you click continue means you saw and agree with{'\n'}
                <Text style={styles.termsLink}>Terms & conditions.</Text>
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 100,
  },
  phoneSection: {
    width: '100%',
    marginBottom: 60,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  flag: {
    fontSize: 20,
    marginRight: 10,
  },
  codeText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  phoneInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    fontSize: 18,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 8,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 40,
  },
  continueButtonActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  continueText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsSection: {
    alignItems: 'center',
  },
  termsText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: '#87CEEB',
    textDecorationLine: 'underline',
  },
});