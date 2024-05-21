import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

BASE_URL = "http://192.168.164.232:8080";

const Dashboard = () => {
  const [claimStats, setClaimStats] = useState({
    today: { submitted: 0, approved: 0, rejected: 0, pending: 0 },
    thisMonth: { submitted: 0, approved: 0, rejected: 0, pending: 0 },
    allTime: { submitted: 0, approved: 0, rejected: 0, pending: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaimStats = async () => {
      try {
        const jwt = await AsyncStorage.getItem('jwt');
        const response = await axios.get(`${BASE_URL}/claims/manager/all`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/json',
          },
        });
        const claims = response.data;

        const today = new Date();
        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

        const stats = {
          today: { submitted: 0, approved: 0, rejected: 0, pending: 0 },
          thisMonth: { submitted: 0, approved: 0, rejected: 0, pending: 0 },
          allTime: { submitted: 0, approved: 0, rejected: 0, pending: 0 },
        };

        claims.forEach((claim) => {
          const claimDate = new Date(claim.createdAt);

          // Check if claim was submitted today
          if (claimDate.toDateString() === today.toDateString()) {
            stats.today.submitted++;
            if (claim.status === 'APPROVED') stats.today.approved++;
            else if (claim.status === 'REJECTED') stats.today.rejected++;
            else if (claim.status === 'SENT') stats.today.pending++;
          }

          // Check if claim was submitted this month
          if (claimDate >= thisMonthStart) {
            stats.thisMonth.submitted++;
            if (claim.status === 'APPROVED') stats.thisMonth.approved++;
            else if (claim.status === 'REJECTED') stats.thisMonth.rejected++;
            else if (claim.status === 'SENT') stats.thisMonth.pending++;
          }

          // Count for all time
          stats.allTime.submitted++;
          if (claim.status === 'APPROVED') stats.allTime.approved++;
          else if (claim.status === 'REJECTED') stats.allTime.rejected++;
          else if (claim.status === 'SENT') stats.allTime.pending++;
        });

        setClaimStats(stats);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch claim stats', error);
        setLoading(false);
      }
    };

    fetchClaimStats();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Claims Overview</Text>
      {Object.entries(claimStats).map(([period, stats]) => (
        <View key={period} style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Claims ({period})</Text>
            <Text style={styles.cardText}>Approved: {stats.approved}</Text>
            <Text style={styles.cardText}>Rejected: {stats.rejected}</Text>
            <Text style={styles.cardText}>Pending: {stats.pending}</Text>
          </View>
          <View style={styles.cardIcon}>
            <Text style={styles.cardIconText}>{stats.submitted}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  cardIcon: {
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIconText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
  },
});

export default Dashboard;
