import React from 'react'
import {
  StatusBar
} from 'react-native'
import { Provider as PaperProvider } from 'react-native-paper'
import { Provider as StoreProvider } from 'react-redux'

import { NavigationContainer } from '@react-navigation/native'

import MainNavigator from './src/navigation/MainNavigator'

import { authLogin } from './src/api'
import store from './src/redux/store'
import SECRETS from './src/secrets'

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
          <MainNavigator />
        </NavigationContainer>
      </PaperProvider>
    </StoreProvider>
  )
}
