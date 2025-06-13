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

export default function OTPVerificationScreen() {
  const [otp, setOTP] = useState('');

  const handleVerify = () => {
    if (otp.length === 6) {
      router.push('/profile-setup');
    }
  };

  const handleResend = () => {
    // Resend OTP logic
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
            <View style={styles.phoneDisplay}>
              <Text style={styles.flag}>🇲🇿</Text>
              <Text style={styles.phoneNumber}>MZ +258</Text>
              <Text style={styles.phoneNumber}>7896541234</Text>
            </View>

            <View style={styles.otpSection}>
              <Text style={styles.otpLabel}>Enter Verification Code (OTP)</Text>
              
              <TextInput
                style={styles.otpInput}
                value={otp}
                onChangeText={setOTP}
                placeholder="000000"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                keyboardType="number-pad"
                maxLength={6}
                textAlign="center"
              />

              <TouchableOpacity
                style={[
                  styles.verifyButton,
                  otp.length === 6 && styles.verifyButtonActive,
                ]}
                onPress={handleVerify}
                disabled={otp.length !== 6}
              >
                <Text style={styles.verifyText}>VERIFY</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.resendButton} onPress={handleResend}>
                <Text style={styles.resendText}>RESEND</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomInfo}>
              <View style={styles.profileIcon}>
                <View style={styles.profileImage} />
              </View>
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
  phoneDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 60,
    gap: 10,
  },
  flag: {
    fontSize: 20,
  },
  phoneNumber: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  otpSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 60,
  },
  otpLabel: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
    marginBottom: 20,
  },
  otpInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 30,
    width: '60%',
    letterSpacing: 8,
  },
  verifyButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    minWidth: 120,
  },
  verifyButtonActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  verifyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resendButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  resendText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomInfo: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 60,
  },
  profileIcon: {
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});