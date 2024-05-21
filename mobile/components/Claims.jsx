import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../api/AuthContext'; // Adjust the path to your context file

BASE_URL = "http://192.168.164.232:8080";

const ClaimList = () => {
  const [claims, setClaims] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortByNewest, setSortByNewest] = useState(true);
  const [filterStatus, setFilterStatus] = useState(null);
  const [jwt, setJwt] = useState('');
  const navigation = useNavigation();
  const { isManager, logout } = useContext(AuthContext);
  const options = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };

  useEffect(() => {
    const getJwt = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setJwt(token);
    };

    const fetchClaims = async () => {
      try {
        await getJwt();
        const url = isManager ? `${BASE_URL}/claims/manager/all` : `${BASE_URL}/claims/all`;
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
          }
        });
        setClaims(response.data);
      } catch (error) {
        console.error('Error fetching claims:', error);
      }
    };

    fetchClaims();
  }, [jwt, isManager]);

  const filteredClaims = claims.filter(claim =>
    claim.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAndSortedClaims = [...filteredClaims]
    .filter(claim => filterStatus ? claim.status === filterStatus : true)
    .sort((a, b) => {
      if (sortByNewest) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

  const handleDetailsClick = (claimId) => {
    navigation.navigate('ClaimDetails', { id: claimId });
  };

  const toggleSortOrder = () => {
    setSortByNewest(prevState => !prevState);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    logout();
    navigation.navigate('Login');
  };

  const renderClaimItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleDetailsClick(item.idClaim)}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description.length > 50 ? `${item.description.substring(0, 50)}...` : item.description}</Text>
      {isManager && (
        <Text style={styles.user}>{item.user.firstName} {item.user.lastName}</Text>
      )}
      <Text style={styles.status(item.status)}>{item.status}</Text>
      <Text style={styles.date}>{new Date(item.createdAt).toLocaleString('en-US', options)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Claims</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity style={styles.sortButton} onPress={toggleSortOrder}>
          <Text style={styles.sortButtonText}>{sortByNewest ? "Sort by Oldest" : "Sort by Newest"}</Text>
        </TouchableOpacity>
        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterButton} onPress={() => handleFilterChange(null)}>
            <Text style={styles.filterButtonText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} onPress={() => handleFilterChange('SENT')}>
            <Text style={styles.filterButtonText}>Sent</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} onPress={() => handleFilterChange('APPROVED')}>
            <Text style={styles.filterButtonText}>Approved</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} onPress={() => handleFilterChange('REJECTED')}>
            <Text style={styles.filterButtonText}>Rejected</Text>
          </TouchableOpacity>
        </View>
        {!isManager && (
          <TouchableOpacity style={styles.newClaimButton} onPress={() => navigation.navigate('AddClaim')}>
            <Text style={styles.newClaimButtonText}>New Claim</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredAndSortedClaims}
        renderItem={renderClaimItem}
        keyExtractor={item => item.idClaim.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  searchInput: {
    backgroundColor: '#E5E7EB',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    fontSize: 16,
    color: '#333',
  },
  sortButton: {
    backgroundColor: '#4A90E2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  sortButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  filterButton: {
    backgroundColor: '#4A90E2',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  filterButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
  newClaimButton: {
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  newClaimButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#DC3545',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  logoutButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  user: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 8,
  },
  status: (status) => ({
    fontSize: 14,
    fontWeight: 'bold',
    padding: 4,
    borderRadius: 8,
    color: status === 'APPROVED' ? '#065F46' : status === 'SENT' ? '#1E3A8A' : '#991B1B',
    backgroundColor: status === 'APPROVED' ? '#D1FAE5' : status === 'SENT' ? '#DBEAFE' : '#FECACA',
    marginBottom: 8,
  }),
  date: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
});

export default ClaimList;
