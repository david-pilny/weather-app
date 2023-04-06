import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import DateTime from 'luxon';

type ItemData = {
  id: string;
  title: string;
};

let DATA: ItemData[] = [];

type ItemProps = {
  item: ItemData;
  backgroundColor: string;
  textColor: string;
};

const Item = ({item, backgroundColor, textColor}: ItemProps) => (
  <TouchableOpacity style={[styles.item, {backgroundColor}]}>
    <Text style={[styles.title, {color: textColor}]}>{item.title}</Text>
  </TouchableOpacity>
);

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  console.log(data);

  useEffect(() => {
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=50.14&longitude=14.11&current_weather=true&hourly=temperature_2m,windspeed_10m',
    )
      .then(response => response.json())
      .then(json => setData(json.current_weather))
      .then(
        Object.keys(data).forEach(key => {
          let title = data[key];
          if (key === 'temperature') {
            title += ' °C';
          }
          if (key === 'windspeed') {
            title += ' km/h';
          }
          if (key === 'winddirection') {
            title += ' °';
          }
          DATA.push({id: key, title: title});
        }),
      )
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const renderItem = ({item}: {item: ItemData}) => {
    const backgroundColor = '#82aaff';
    const color = 'white';

    return (
      <Item item={item} backgroundColor={backgroundColor} textColor={color} />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 50,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  title: {
    fontSize: 32,
  },
});

export default App;
