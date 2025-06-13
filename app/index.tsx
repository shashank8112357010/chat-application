import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface LanguageOption {
  code: string;
  label: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'pt', label: 'Portuguese', flag: '🇲🇿' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
];

export default function WelcomeScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('pt');

  const handleGetStarted = () => {
    router.push('/phone-verification');
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
          <View style={styles.header}>
            <Text style={styles.welcomeTitle}>Welcome to BomPapo</Text>
            <Text style={styles.version}>BP1.88</Text>
          </View>

          <View style={styles.languageSection}>
            <Text style={styles.languageTitle}>Select Language</Text>
            <View style={styles.languageOptions}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageButton,
                    selectedLanguage === lang.code && styles.selectedLanguage,
                  ]}
                  onPress={() => setSelectedLanguage(lang.code)}
                >
                  <Text style={styles.flag}>{lang.flag}</Text>
                  <Text style={styles.languageText}>{lang.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <View style={styles.logoIcon} />
              </View>
            </View>

            <Text style={styles.discoverTitle}>Discover</Text>
            <Text style={styles.securityText}>
              This service is totally secure and your mobile{'\n'}
              number will never be shared with anyone
            </Text>

            <View style={styles.pagination}>
              <View style={[styles.dot, styles.activeDot]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>

            <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
              <Text style={styles.getStartedText}>GET STARTED</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  version: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  languageSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  languageTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: 'white',
    marginBottom: 20,
  },
  languageOptions: {
    flexDirection: 'row',
    gap: 15,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 140,
    justifyContent: 'center',
  },
  selectedLanguage: {
    backgroundColor: 'white',
    transform: [{ scale: 1.05 }],
  },
  flag: {
    fontSize: 20,
    marginRight: 8,
  },
  languageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E53E3E',
  },
  discoverTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  securityText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  pagination: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeDot: {
    backgroundColor: 'white',
  },
  getStartedButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  getStartedText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});