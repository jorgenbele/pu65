import React from 'react'
import { ScrollView } from 'react-native'
import { Button } from 'react-native-paper'

import { CommonActions } from '@react-navigation/native'

import store from '../redux/store'

const login = (navigation) => {
  navigation.dispatch(
    CommonActions.navigate({
      name: 'Login'
    }))
}

export default function SettingsScreen ({ navigation, route, ...props }) {
  return (
    <ScrollView>
      <Button icon='login' mode='contained' onPress={() => login()}>
      Login
      </Button>

      <Button icon='login' mode='contained' onPress={() => console.log(store.getState())}>
        print state
      </Button>
    </ScrollView>
  )
}

export const TabColor = '#fff'
