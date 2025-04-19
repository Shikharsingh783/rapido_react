import {View, StyleSheet, Image} from 'react-native';
import React from 'react';

const SplashCreen = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        resizeMode="contain"
        source={{
          uri: 'https://logowik.com/content/uploads/images/rapido-bike-taxi8263.jpg',
        }}
      />
    </View>
  );
};

export default SplashCreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 400,
    height: 400,
  },
});
