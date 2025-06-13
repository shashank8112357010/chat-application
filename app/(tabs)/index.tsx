import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Menu, Bell, Search, Filter } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 3;

interface User {
  id: string;
  name: string;
  age: number;
  location: string;
  isOnline: boolean;
}

const users: User[] = [
  { id: '1', name: 'Harsh', age: 24, location: 'Delhi', isOnline: true },
  { id: '2', name: 'Clo', age: 30, location: 'Maputo', isOnline: true },
  { id: '3', name: 'bompe', age: 45, location: 'Maputo', isOnline: true },
  { id: '4', name: 'Gloria', age: 37, location: 'Maputo', isOnline: true },
  { id: '5', name: 'Dey', age: 32, location: 'Maputo', isOnline: true },
  { id: '6', name: 'sariace', age: 19, location: 'Maputo', isOnline: true },
  { id: '7', name: 'Alice', age: 34, location: 'Maputo', isOnline: true },
  { id: '8', name: 'Meru', age: 57, location: 'Maputo', isOnline: true },
  { id: '9', name: 'Muacite', age: 29, location: 'Moçamb.', isOnline: true },
  { id: '10', name: 'Ana Pat', age: 22, location: 'Lichinga', isOnline: true },
  { id: '11', name: 'Lenny', age: 31, location: 'Matola', isOnline: true },
  { id: '12', name: 'finoca', age: 21, location: 'Maputo', isOnline: true },
];

export default function DiscoverScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Menu size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>Tonyah</Text>
          <View style={styles.onlineStatus}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
          <Text style={styles.creditText}>Current Credit: 00:05:00</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Bell size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Search size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.userGrid}>
          {users.map((user) => (
            <TouchableOpacity key={user.id} style={styles.userCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.cardName}>{user.name}</Text>
              <View style={styles.cardInfo}>
                <View style={styles.ageIndicator}>
                  <View style={styles.onlineIndicator} />
                  <Text style={styles.ageText}>{user.age}</Text>
                </View>
                <Text style={styles.locationText}>{user.location}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.filterButton}>
        <Filter size={24} color="white" />
      </TouchableOpacity>
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
    paddingTop: 80,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    padding: 5,
  },
  userInfo: {
    flex: 1,
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 5,
  },
  onlineText: {
    fontSize: 14,
    color: 'white',
  },
  creditText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
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
    padding: 15,
  },
  userGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  userCard: {
    width: cardWidth,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E53E3E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardInfo: {
    alignItems: 'center',
  },
  ageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  onlineIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 4,
  },
  ageText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  locationText: {
    fontSize: 11,
    color: '#999',
  },
  filterButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E53E3E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});
