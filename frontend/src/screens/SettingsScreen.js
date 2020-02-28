import React from 'react'
import { /* StyleSheet, */ ScrollView } from 'react-native'
import { Button } from 'react-native-paper'
/*
import { createStackNavigator } from '@react-navigation/stack'
import { Text } from 'react-native-paper'
*/

import { authLogin, fetchWorkspaces, createWorkspace, fetchCollections } from '../utils' // TODO move
import store from '../redux/store'

import SECRETS from '../secrets'

const login = () => {
  store.dispatch(authLogin(SECRETS.USER_NAME, SECRETS.USER_PASSWORD))
}
export default function SettingsScreen () {
  return (
    <ScrollView>
      <Button icon='login' mode='contained' onPress={() => login()}>
      Login
      </Button>

      <Button icon='login' mode='contained' onPress={() => store.dispatch(fetchWorkspaces())}>
      fetch workspaces
      </Button>

      <Button icon='login' mode='contained' onPress={() => store.dispatch(createWorkspace('test name'))}>
      add new workspaces
      </Button>

      <Button icon='login' mode='contained' onPress={() => console.log(store.getState())}>
        print state
      </Button>

      <Button icon='login' mode='contained' onPress={() => login()}>
        Login
      </Button>

      <Button icon='login' mode='contained' onPress={() => store.dispatch(fetchCollections())}>
        fetch collections
      </Button>
    </ScrollView>
  )

/*
  return (
    <Stack.Navigator>
      <Stack.Screen name='Settings' component={SettingsMainScreen} />
      <Stack.Screen name='Workspace' component={WorkspaceScreen} />
      <Stack.Screen name='State' component={StateScreen} />
      <Stack.Screen name='Collections' component={CollectionScreen} />
    </Stack.Navigator>
  )
  */
}

/*
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
*/

export const TabColor = '#fff'
