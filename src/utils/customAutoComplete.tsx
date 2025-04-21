import React, {useState} from 'react';
import {
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import axios from 'axios';
// import {Navigation} from '../../rapido/src/navigation';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../routes/types';
import {getDistance} from 'geolib';
import * as geolib from 'geolib';

interface GeoapifyPlace {
  properties: {
    formatted: string;
    place_id: string;
    [key: string]: any; // optional: allows other dynamic props
  };
}

const CustomAutocomplete = ({location}: any) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoapifyPlace[]>([]);

  const handlePlaceClick = (lat: number, lon: number) => {
    const calculatedDistance = geolib.getPreciseDistance(
      {latitude: location?.latitude ?? 0, longitude: location?.longitude ?? 0},
      {latitude: lat, longitude: lon},
    );
    console.log('Distance:', calculatedDistance, 'meters');
    return calculatedDistance;
  };

  const fetchPlaces = async (text: string) => {
    setQuery(text);
    if (text.length < 2) {
      // Clear suggestions when input is less than 2 or cleared
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(
        'https://api.geoapify.com/v1/geocode/autocomplete', // Use endpoint without hardcoded text
        {
          params: {
            text,
            apiKey: '64594ba6f0694213aa44db37224476c6', // Replace with your actual API key
            limit: 5,
          },
        },
      );
      console.log('Fetched places:', res);
      setSuggestions(res.data.features); // Update suggestions
    } catch (err) {
      console.error('Error fetching places:', err);
    }
  };

  const handleSelect = (item: GeoapifyPlace) => {
    const {formatted, lat, lon} = item.properties;
    const calculatedDistance = handlePlaceClick(lat, lon);

    if (calculatedDistance > 1000000) {
      Alert.alert(
        'Distance Alert',
        `The selected place is ${(calculatedDistance / 1000).toFixed(
          2,
        )} km away from your current location. We currently do not support such distances. Please try again with a distance less than 100 km.`,
      );
    } else {
      navigation.navigate('Home', {
        selectedAddress: formatted,
        latitude: lat,
        longitude: lon,
        distance: calculatedDistance,
      });
    }

    setSuggestions([]);
    setQuery(formatted);
  };

  return (
    <View>
      <TextInput
        placeholder="Search for a place"
        value={query}
        onChangeText={fetchPlaces} // Fetch places when text changes
        style={{borderWidth: 1, padding: 10}}
      />
      <FlatList
        data={suggestions}
        keyExtractor={item => item.properties.place_id}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleSelect(item)}>
            <Text style={{padding: 10}}>{item.properties.formatted}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default CustomAutocomplete;
