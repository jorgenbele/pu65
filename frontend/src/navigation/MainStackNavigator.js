import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import CollectionsScreen from '../screens/CollectionsScreen'
import CollectionScreen from '../screens/CollectionScreen'

const Stack = createStackNavigator()

function MainStackNavigator () {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Collections'>
        <Stack.Screen name='Collections' component={CollectionsScreen} />
        <Stack.Screen name='Collection' component={CollectionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainStackNavigator
