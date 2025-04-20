import React, {useState} from 'react';
import {TextInput, FlatList, Text, TouchableOpacity, View} from 'react-native';
import axios from 'axios';

interface GeoapifyPlace {
  properties: {
    formatted: string;
    place_id: string;
    [key: string]: any; // optional: allows other dynamic props
  };
}

const CustomAutocomplete = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoapifyPlace[]>([]);

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
      setSuggestions(res.data.features); // Update suggestions
    } catch (err) {
      console.error('Error fetching places:', err);
    }
  };

  const handleSelect = (item: GeoapifyPlace) => {
    console.log('Selected place:', item.properties.formatted);
    setSuggestions([]); // Clear suggestions after selecting a place
    setQuery(item.properties.formatted); // Update the query with the selected place
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
