import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>Copyright © 2024 - All rights reserved by SOZ</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#F3F4F6',
    padding: 10,
    alignItems: 'center',
  },
  text: {
    color: '#666',
    fontSize: 14,
  },
});

export default Footer;
