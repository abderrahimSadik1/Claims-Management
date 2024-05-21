import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../api/AuthContext'; // Adjust the path to your context file

BASE_URL = "http://192.168.164.232:8080";

const ClaimDetail = () => {
  const [claim, setClaim] = useState(null);
  const [rejection, setRejection] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const { id } = useRoute().params; // Assuming you pass the id as a route parameter
  const [jwt, setJwt] = useState('');
  const navigation = useNavigation();
  const options = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const { isManager } = useContext(AuthContext);

  useEffect(() => {
    const getJwt = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setJwt(token);
    };

    const fetchClaimAndRejection = async () => {
      try {
        await getJwt();
        // Fetch claim data
        const claimResponse = await axios.get(`${BASE_URL}/claims/${id}`, {
          headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
          }
        });

        // Fetch rejection data only if claim status is 'REJECTED'
        if (claimResponse.data.status === 'REJECTED') {
          const rejectionResponse = await axios.get(`${BASE_URL}/rejections/${id}`, {
            headers: {
              'Authorization': `Bearer ${jwt}`,
              'Content-Type': 'application/json'
            }
          });

          // Set rejection data
          setRejection(rejectionResponse.data);
        }

        // Set claim data
        setClaim(claimResponse.data);
      } catch (error) {
      }
    };

    fetchClaimAndRejection();
  }, [id, jwt]);

  const handleApprove = async () => {
    try {
      claim.status = 'APPROVED';
      await axios.put(`${BASE_URL}/claims/update/${id}`, {
        title: claim.title,
        description: claim.description,
        status: claim.status
      }, {
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });
      setClaim((prevClaim) => ({ ...prevClaim, status: 'APPROVED' }));
      navigation.navigate('Claims'); // Assuming 'Home' is your main screen
    } catch (error) {
      console.error('Failed to approve claim:', error);
    }
  };

  const handleReject = async () => {
    try {
      // Create rejection with claim title and description
      await axios.post(`${BASE_URL}/rejections/${id}`, {
        title: claim.title,  // Use claim title
        description: rejectionReason // Use rejection reason as description
      }, {
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });
      // Update claim status to REJECTED
      claim.status = 'REJECTED';
      await axios.put(`${BASE_URL}/claims/update/${id}`, {
        title: claim.title,
        description: claim.description,
        status: claim.status
      }, {
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });
      setClaim((prevClaim) => ({ ...prevClaim, status: 'REJECTED' }));
      setShowRejectModal(false);
      setRejectionReason('');
      navigation.navigate('Claims'); // Assuming 'Home' is your main screen
    } catch (error) {
      console.error('Failed to reject claim:', error);
    }
  };

  if (!claim) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/claims/delete/${id}`, {
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });
      navigation.navigate('Claims'); // Assuming 'Claims' is your main screen
    } catch (error) {
      console.error('Failed to delete claim:', error);
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{claim.title}</Text>
        <View style={styles.statusContainer}>
          <Text style={[styles.status, claim.status === 'APPROVED' ? styles.approved : claim.status === 'SENT' ? styles.sent : styles.rejected]}>
            {claim.status}
          </Text>
        </View>
        <Text style={styles.date}>{new Date(claim.createdAt).toLocaleString('en-US', options)}</Text>
        <Text style={styles.user}>By {claim.user.firstName} {claim.user.lastName}</Text>
        <Text style={styles.description}>{claim.description}</Text>
        {(isManager && claim.status === 'SENT') && (
          <View style={styles.buttonContainer}>
            <Button title="Approve" onPress={handleApprove} color="#34D399" />
            <Button title="Reject" onPress={() => setShowRejectModal(true)} color="#EF4444" />
          </View>
        )}
        {(!isManager && claim.status === 'SENT') && (
          <View style={styles.buttonContainer}>
            <Button title="Update" onPress={() => navigation.navigate('UpdateClaim', { id: claim.idClaim })} color="#6D28D9" />
            <Button title="Delete" onPress={handleDelete} color="#EF4444" />
          </View>
        )}
      </View>

      <Modal visible={showRejectModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Reject Claim</Text>
            <TextInput
              style={styles.textarea}
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChangeText={setRejectionReason}
              multiline
              numberOfLines={4}
            />
            <View style={styles.modalButtonContainer}>
              <Button title="Submit Rejection" onPress={handleReject} color="#EF4444" />
              <Button title="Cancel" onPress={() => setShowRejectModal(false)} color="#9CA3AF" />
            </View>
          </View>
        </View>
      </Modal>

      {claim.status === 'REJECTED' && rejection && (
        <View style={[styles.card, styles.rejectionCard]}>
          <Text style={styles.title}>Rejected Because:</Text>
          <Text style={styles.description}>{rejection.description}</Text>
          <Text style={styles.date}>{new Date(rejection.rejectedAt).toLocaleString('en-US', options)}</Text>
          <Text style={styles.manager}>Manager: {rejection.manager.firstName} {rejection.manager.lastName}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F3F4F6',
    flexGrow: 1,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  statusContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  approved: {
    color: '#065F46',
    backgroundColor: '#D1FAE5',
  },
  sent: {
    color: '#1E3A8A',
    backgroundColor: '#DBEAFE',
  },
  rejected: {
    color: '#991B1B',
    backgroundColor: '#FECACA',
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  user: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  textarea: {
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rejectionCard: {
    backgroundColor: '#FECACA',
  },
  manager: {
    fontSize: 16,
    color: '#991B1B',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ClaimDetail;
