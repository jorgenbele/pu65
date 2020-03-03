import React from 'react'
import {
  StatusBar
} from 'react-native'
import { Provider as PaperProvider } from 'react-native-paper'
import { Provider as StoreProvider } from 'react-redux'

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
//
import SettingsScreen from './src/screens/SettingsScreen'

import CollectionsStackNavigator from './src/navigation/CollectionsStackNavigator'
import WorkspacesStackNavigator from './src/navigation/WorkspacesStackNavigator'

import { authLogin } from './src/api'
import { makeIcon } from './src/utils'
import store from './src/redux/store'
import SECRETS from './src/secrets'

const login = () => {
  store.dispatch(authLogin(SECRETS.USER_NAME, SECRETS.USER_PASSWORD))
}

const BottomTab = createMaterialBottomTabNavigator()

export default function App () {
  login()

  return (
    <StoreProvider store={store}>
      <PaperProvider>
        {
          // FIXME: Not currently working on my phone correctly without hidden=true
        }
        <StatusBar hidden />

        <NavigationContainer>
          <BottomTab.Navigator shifting initialRouteName='Workspaces'>
            <BottomTab.Screen
              name='Collections'
              component={CollectionsStackNavigator}
              options={makeNavigationOptions('Collections', 'list', '#00796b')}
            />
            <BottomTab.Screen
              name='Workspaces'
              component={WorkspacesStackNavigator}
              options={makeNavigationOptions('Workspace', 'apps', '#6200ee')}
            />
            <BottomTab.Screen
              name='Settings'
              component={SettingsScreen}
              options={makeNavigationOptions('Settings', 'settings', '#FFFFFF')}
            />
          </BottomTab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </StoreProvider>
  )
}

const makeNavigationOptions = (label, iconName, color) => {
  return {
    tabBarLabel: label,
    tabBarColor: color,
    tabBarIcon: ({ focused }) => makeIcon(iconName, focused)
  }
}
