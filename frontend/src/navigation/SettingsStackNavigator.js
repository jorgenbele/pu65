import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import SettingsScreen from '../screens/SettingsScreen'

const Stack = createStackNavigator()
function SettingsStackNavigator () {
  return (
    <Stack.Navigator initialRouteName='Settings'>
      <Stack.Screen name='Settings' component={SettingsScreen} />
    </Stack.Navigator>
  )
}

export default SettingsStackNavigator
