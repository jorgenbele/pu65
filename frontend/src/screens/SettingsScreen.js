import React from 'react'
import { ScrollView } from 'react-native'
import { Button } from 'react-native-paper'

import { authLogin, authLogout } from '../api'
import store from '../redux/store'
import SECRETS from '../secrets'

const login = () => {
  store.dispatch(authLogin(SECRETS.USER_NAME, SECRETS.USER_PASSWORD))
}

const logout = () => {
  console.log('LOGOUT')
  store.dispatch(authLogout(store.getState().auth.token))
}

export default function SettingsScreen () {
  return (
    <ScrollView>
      <Button icon='login' mode='contained' onPress={() => login()}>
      Login
      </Button>

      <Button icon='logout' mode='contained' onPress={() => logout()}>
      Logout
      </Button>

      <Button icon='login' mode='contained' onPress={() => console.log(store.getState())}>
        print state
      </Button>
    </ScrollView>
  )
}

export const TabColor = '#fff'
