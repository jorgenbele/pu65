import React from 'react';
import { View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
      </View>
    );
  }
}

//import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
//
//export default createMaterialBottomTabNavigator({
//  Album: { screen: Album },
//  Library: { screen: Library },
//  History: { screen: History },
//  Cart: { screen: Cart },
//}, {
//  initialRouteName: 'Album',
//  activeColor: '#F44336',
//});