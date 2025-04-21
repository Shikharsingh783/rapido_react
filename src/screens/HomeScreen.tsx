import {
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import React, {use, useEffect, useState, useRef} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {getCurrentLocation} from '../utils/getCurrentLocation';
import GetLocation from 'react-native-get-location';
import axios from 'axios';
import {Polyline} from 'react-native-maps';

type LocationType = {
  latitude: number;
  longitude: number;
} | null;

const HomeScreen = ({route, navigation}: any) => {
  const {selectedAddress, latitude, longitude, distance} = route.params || {};
  console.log('Selected Address:', selectedAddress);
  console.log('Latitude:', latitude);
  console.log('Longitude:', longitude);
  console.log('Distance:', distance);
  const mapRef = useRef<MapView>(null);
  const [address, setAddress] = useState('');
  const [userLocation, setUserLocation] = useState<LocationType>(null);

  // useEffect(() => {}, []);

  useEffect(() => {
    const getCurrentLocation = async () => {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      })
        .then(async location => {
          console.log(location);
          setUserLocation({
            latitude: location.latitude,
            longitude: location.longitude,
          });
          if (mapRef) {
            mapRef.current?.animateToRegion({
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0022,
              longitudeDelta: 0.0022,
            });
          }

          const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${location.latitude}&lon=${location.longitude}&apiKey=64594ba6f0694213aa44db37224476c6`;
          console.log('Geoapify URL:', url);
          const {data} = await axios.get(url);
          console.log(data);
          const addressLine2 = data?.features?.[0]?.properties?.address_line2;

          if (addressLine2) {
            setAddress(addressLine2);
          }
          console.log('Address:', addressLine2);
        })
        .catch(error => {
          const {code, message} = error;
          console.warn(code, message);
        });
    };
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      const coordinates = [
        {latitude: userLocation?.latitude, longitude: userLocation?.longitude},
        {
          latitude: latitude,
          longitude: longitude,
        },
      ];

      mapRef.current?.fitToCoordinates(coordinates, {
        edgePadding: {top: 200, right: 50, bottom: 50, left: 50},
        animated: true,
      });
    }
  }, [latitude, longitude, userLocation]);

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
        {latitude && longitude && (
          <Marker
            coordinate={{
              latitude: latitude,
              longitude: longitude,
            }}
            pinColor="green"
          />
        )}
        {latitude && longitude && (
          <Polyline
            coordinates={[
              {
                latitude: userLocation?.latitude ?? 40.7128,
                longitude: userLocation?.longitude ?? -74.006,
              },
              {latitude: latitude, longitude: longitude},
            ]}
            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
            strokeColors={['black']}
            strokeWidth={2}
          />
        )}
      </MapView>

      {/* Top Search Bar */}
      <View style={styles.row}>
        <View style={styles.menu_container}>
          <Image
            style={styles.menu}
            source={require('../../assets/menu2.png')}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Image
            style={styles.menu}
            source={require('../../assets/current_animation_4.gif')}
          />
          <TextInput
            editable={false}
            value={address}
            // onChangeText={setLocation}
            placeholder="Current location"
            style={styles.textInput}
          />
        </View>
      </View>

      {/* Bottom curved overlay */}
      <View style={styles.bottomSheet}>
        <View style={styles.innerBox}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Destination', {
                location: userLocation,
              })
            }>
            <View style={styles.searchBar}>
              <Image
                style={{width: 15, height: 15, marginLeft: 5}}
                source={require('../../assets/search.png')}
              />
              <TextInput
                value={selectedAddress}
                editable={false}
                placeholder="Where are you going?"
                style={{marginRight: 28}}
              />
            </View>
          </TouchableOpacity>
          {longitude && latitude && (
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                marginTop: 10,
                justifyContent: 'space-between',
                paddingHorizontal: 10,
              }}>
              <RideOption
                title="Bike"
                image={require('../../assets/bike2.png')}
                ratePerKm={2}
                baseFair={10}
                distance={distance / 1000}
              />
              <RideOption
                title="Car"
                image={require('../../assets/car2.png')}
                ratePerKm={5}
                baseFair={20}
                distance={distance / 1000}
              />
              <RideOption
                title="Auto"
                image={require('../../assets/auto2.png')}
                ratePerKm={3}
                baseFair={15}
                distance={distance / 1000}
              />
            </View>
          )}
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

const RideOption = ({title, image, ratePerKm, baseFair, distance}: any) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: '#fff',
        paddingTop: 10,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        paddingHorizontal: 18,
        marginTop: 10,
        height: 160,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}>
      <Image
        source={image}
        style={{
          height: 70,
          width: 70,
        }}
      />
      <View style={{alignItems: 'center'}}>
        <Text style={{fontWeight: '600', fontSize: 15}}>{title}</Text>
      </View>
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: '#27ae60',
          marginTop: 6,
        }}>
        ₹{(baseFair + ratePerKm * distance).toFixed(0)}
      </Text>
      <Text style={{fontSize: 12, color: '#888', marginTop: 10}}>
        ₹{ratePerKm} per km
      </Text>
    </TouchableOpacity>
  );
};
