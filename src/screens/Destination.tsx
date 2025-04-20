import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomAutocomplete from '../utils/customAutoComplete';

const Destination = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Search Location</Text>
      <CustomAutocomplete />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
});

export default Destination;
