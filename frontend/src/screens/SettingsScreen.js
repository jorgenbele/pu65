import React from 'react'
import { ScrollView } from 'react-native'
import { Button } from 'react-native-paper'

import { CommonActions } from '@react-navigation/native'
import { authLogout } from '../api'
import store from '../redux/store'

const login = (navigation) => {
  navigation.dispatch(
    CommonActions.navigate({
      name: 'Login'
    }))
}

const logout = (navigation) => {
  console.log('LOGOUT')
  store.dispatch(authLogout(store.getState().auth.token))
  // login(navigation)
}

export default function SettingsScreen ({ navigation, route, ...props }) {
  return (
    <ScrollView>
      <Button icon='login' mode='contained' onPress={() => login(navigation)}>
      Login
      </Button>

      <Button icon='logout' mode='contained' onPress={() => logout(navigation)}>
      Logout
      </Button>

      <Button icon='login' mode='contained' onPress={() => console.log(store.getState())}>
        print state
      </Button>
    </ScrollView>
  )
}

export const TabColor = '#fff'
