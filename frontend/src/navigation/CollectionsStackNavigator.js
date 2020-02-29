import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import CollectionsScreen from '../screens/CollectionsScreen'
import CollectionScreen from '../screens/CollectionScreen'

const Stack = createStackNavigator()

function MainStackNavigator () {
  return (
    <Stack.Navigator initialRouteName='Collections'>
      <Stack.Screen name='Collections' component={CollectionsScreen} />
      <Stack.Screen name='Collection' component={CollectionScreen} />
    </Stack.Navigator>
  )
}

export default MainStackNavigator
