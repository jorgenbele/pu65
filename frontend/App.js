import React from 'react'
import {
  StatusBar
} from 'react-native'
import { Provider as PaperProvider } from 'react-native-paper'
import { Provider as StoreProvider } from 'react-redux'

import { NavigationContainer } from '@react-navigation/native'
<<<<<<< HEAD
=======
//
// import SettingsScreen from './src/screens/SettingsScreen'
>>>>>>> fieat(App): made createUserForm visible in app

import MainNavigator from './src/navigation/MainNavigator'

import { authLogin } from './src/api'
import store from './src/redux/store'
import SECRETS from './src/secrets'
import UserCreateForm from './src/components/UserCreateForm'
const login = () => {
  store.dispatch(authLogin(SECRETS.USER_NAME, SECRETS.USER_PASSWORD))
}

export default function App () {
  if (SECRETS.LOGIN_BY_DEFAULT) login()

  return (
    <StoreProvider store={store}>
      <PaperProvider>
        {
          // FIXME: Not currently working on my phone correctly without hidden=true
        }
        <StatusBar hidden />

        <NavigationContainer>
<<<<<<< HEAD
          <MainNavigator />
=======
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
              component={UserCreateForm}
              options={makeNavigationOptions('Settings', 'settings', '#FFFFFF')}
            />
          </BottomTab.Navigator>
>>>>>>> fieat(App): made createUserForm visible in app
        </NavigationContainer>
      </PaperProvider>
    </StoreProvider>
  )
}
