import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomAutocomplete from '../utils/customAutoComplete';
import {Navigation} from '../../rapido/src/navigation';

const Destination = ({navigation, route}: any) => {
  const {location} = route.params || {};
  console.log('Location:', location.latitude);
  console.log('Location:', location.longitude);
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 20,
        }}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Image
            source={require('../../assets/back2.png')}
            style={{width: 15, height: 15}}
          />
        </TouchableOpacity>
        <Text style={styles.header}>Search Destination</Text>
      </View>

      <CustomAutocomplete location={location} />
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
    marginLeft: 80,
  },
});

export default Destination;
