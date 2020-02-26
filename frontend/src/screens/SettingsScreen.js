import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Button } from 'react-native-paper'
import { createStackNavigator } from '@react-navigation/stack'

import { authLogin, fetchWorkspaces, createWorkspace } from '../utils' // TODO move
import store from '../redux/store'

import SECRETS from '../secrets'

// The stack navigator is used to handle the "stacking"
// of screens/views for the settings screen.
// This means that if a button press on this screen
// is supposed to change to another view, it will
// push the current view to this stack, then go to the new screen/view.
// When the back button is pressed from this nested screen/view,
// it will go back to THIS screen/view, OR the one below it
// in the stack. The bottom element in the stack will always
// be this SettingsScreen view, OR else it will be empty.
const Stack = createStackNavigator()

const login = () => {
  store.dispatch(authLogin(SECRETS.USER_NAME, SECRETS.USER_PASSWORD))
}

// This is just an example screen.
function SettingsMainScreen ({ navigation }) {
  // Screen for displaying buttons used to change to the other screens
  return (
    <View style={styles.container}>
      <Button icon='login' mode='contained' onPress={() => navigation.navigate('Workspace')}>
        show workspace utils
      </Button>

      <Button icon='login' mode='contained' onPress={() => navigation.navigate('State')}>
        show state utils
      </Button>

    </View>
  )
}

function WorkspaceScreen ({ navigation }) {
  return (
    <View style={styles.container}>
      <Button icon='login' mode='contained' onPress={() => store.dispatch(fetchWorkspaces())}>
        fetch workspaces
      </Button>

      <Button icon='login' mode='contained' onPress={() => store.dispatch(createWorkspace('test name'))}>
        add new workspaces
      </Button>
    </View>
  )
}

function StateScreen ({ navigation }) {
  return (
    <View style={styles.container}>
      <Button icon='login' mode='contained' onPress={() => login()}>
        Login
      </Button>
    </View>
  )
}

export default function SettingsScreen () {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Settings' component={SettingsMainScreen} />
      <Stack.Screen name='Workspace' component={WorkspaceScreen} />
      <Stack.Screen name='State' component={StateScreen} />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export const TabColor = '#fff'
