import * as React from 'react'
import { connect } from 'react-redux'

import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'

import { makeIcon } from '../utils'

import CollectionsStackNavigator from './CollectionsStackNavigator'
import WorkspacesStackNavigator from './WorkspacesStackNavigator'
import SettingsStackNavigator from './SettingsStackNavigator'

import LoginForm from '../components/LoginForm'

const BottomTab = createMaterialBottomTabNavigator()

const makeNavigationOptions = (label, iconName, color) => {
  return {
    tabBarLabel: label,
    tabBarColor: color,
    tabBarIcon: ({ focused }) => makeIcon(iconName, focused)
  }
}

function HomeNavigator () {
  return (
    <>
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
          component={SettingsStackNavigator}
          options={makeNavigationOptions('Settings', 'settings', '#FFFFFF')}
        />
      </BottomTab.Navigator>
    </>
  )
}

const Stack = createStackNavigator()
function MainNavigator ({ loggedIn }) {
  return (
    <Stack.Navigator headerMode='none'>
      {loggedIn ? (
        <Stack.Screen name='Home' component={HomeNavigator} />
      ) : (
        <Stack.Screen name='Login' component={LoginForm} />
      )}
    </Stack.Navigator>
  )
}

const mapStateToProps = state => ({
  loggedIn: state.auth.loggedIn
})

const ConnectedMainNavigator = connect(mapStateToProps)(MainNavigator)
export default ConnectedMainNavigator
