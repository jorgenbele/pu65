import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import WorkspacesScreen from '../screens/WorkspacesScreen'
import WorkspaceCreateForm from '../components/WorkspaceCreateForm'
import InviteUserWorkspaceForm from '../components/InviteUserWorkspaceForm'
import RemoveMemberWorkspaceForm from '../components/RemoveMemberWorkspaceForm'

import CollectionsScreen from '../screens/CollectionsScreen'
import CollectionScreen from '../screens/CollectionScreen'
import CollectionCreateForm from '../components/CollectionCreateForm'
import CollectionAddItemForm from '../components/CollectionAddItemForm'
import CollectionManageWSMemberForm from '../components/CollectionManageWSMemberForm'


const Stack = createStackNavigator()

function WorkspacesStackNavigator () {
  return (
    <Stack.Navigator initialRouteName='Workspaces'>
      <Stack.Screen name='Workspaces' component={WorkspacesScreen} />
      <Stack.Screen name='WorkspaceCollections' component={CollectionsScreen} />
      <Stack.Screen name='CreateWorkspace' component={WorkspaceCreateForm} />
      <Stack.Screen name='InviteUserWorkspace' component={InviteUserWorkspaceForm} />
      <Stack.Screen name='RemoveMemberFromWorkspace' component={RemoveMemberWorkspaceForm} />

      {
        /* HACK */
      }
      <Stack.Screen name='Collection' component={CollectionScreen} />
      <Stack.Screen name='CreateCollection' component={CollectionCreateForm} />
      <Stack.Screen name='AddItemToCollection' component={CollectionAddItemForm} />
      <Stack.Screen name='AddMember' component={CollectionManageWSMemberForm} />
    </Stack.Navigator>
  )
}

export default WorkspacesStackNavigator
