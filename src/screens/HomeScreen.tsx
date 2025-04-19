import {View, StyleSheet, Image, TextInput} from 'react-native';
import React, {use, useEffect, useState, useRef} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {getCurrentLocation} from '../utils/getCurrentLocation';
import GetLocation from 'react-native-get-location';

type LocationType = {
  latitude: number;
  longitude: number;
} | null;

const HomeScreen = () => {
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<LocationType>(null);

  useEffect(() => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        console.log(location);
        setUserLocation({
          latitude: location.latitude,
          longitude: location.longitude,
        });
        if (mapRef) {
          mapRef.current?.animateCamera({
            center: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
            zoom: 30,
          });
        }
      })
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
      });
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsIndoors={true}
        showsTraffic={true}
        showsBuildings={true}
        showsScale={true}
        showsPointsOfInterest={true}
        showsIndoorLevelPicker={true}
        initialRegion={{
          latitude: userLocation?.latitude ?? 40.7128,
          longitude: userLocation?.longitude ?? -74.006,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <Marker
          coordinate={{
            latitude: userLocation?.latitude ?? 40.7128,
            longitude: userLocation?.longitude ?? -74.006,
          }}
        />
      </MapView>

      {/* Top Search Bar */}
      <View style={styles.row}>
        {' '}
        <View style={styles.menu_container}>
          <Image
            style={styles.menu}
            source={require('../../assets/menu2.png')}
          />
        </View>
        <View style={styles.inputWrapper}>
          <View style={styles.location} />
          <TextInput
            value={''}
            // onChangeText={setLocation}
            placeholder="Current location"
            style={styles.textInput}
          />
        </View>
      </View>

      {/* Bottom curved overlay */}
      <View style={styles.bottomSheet}>
        <View style={styles.innerBox}>
          <View style={styles.searchBar}>
            <Image
              style={{width: 15, height: 15, marginLeft: 5}}
              source={require('../../assets/search.png')}
            />
            <TextInput placeholder="Where are you going?" />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menu: {
    width: 23,
    height: 23,
  },
  row: {
    position: 'absolute',
    top: 65,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menu_container: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 14,
  },
  location: {
    height: 18,
    width: 18,
    borderColor: 'green',
    borderWidth: 1.5,
    borderRadius: 50,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'white',
    // overflow: 'hidden', // optional
  },
  innerBox: {
    backgroundColor: '#EEEEEE',
    height: 250,
    borderRadius: 20,
    marginBottom: 10,
  },
  searchBar: {
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 20,
    margin: 3,
    flexDirection: 'row',
    gap: 10,

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 2,

    // Shadow for Android
    elevation: 5,
  },
});

export default HomeScreen;
