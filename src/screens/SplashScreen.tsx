import {View, StyleSheet, Image} from 'react-native';
import React, {useEffect} from 'react';

const SplashCreen = ({navigation}: any) => {
  useEffect(() => {
    setTimeout(() => {
      // navigate to Home Screen
      navigation.replace('Home');
    }, 2500);
  });
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
