import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import WorkspacesScreen from '../screens/WorkspacesScreen'
import WorkspaceCreateForm from '../components/WorkspaceCreateForm'

const Stack = createStackNavigator()

function MainStackNavigator () {
  return (
    <Stack.Navigator initialRouteName='Workspaces'>
      <Stack.Screen name='Workspaces' component={WorkspacesScreen} />
      <Stack.Screen name='CreateWorkspace' component={WorkspaceCreateForm} />
    </Stack.Navigator>
  )
}

export default MainStackNavigator
