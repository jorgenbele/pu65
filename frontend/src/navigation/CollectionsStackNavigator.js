import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import CollectionsScreen from '../screens/CollectionsScreen'
import CollectionScreen from '../screens/CollectionScreen'
import CollectionCreateForm from '../components/CollectionCreateForm'
import CollectionAddItemForm from '../components/CollectionAddItemForm'
import CollectionManageWSMemberForm from '../components/CollectionManageWSMemberForm'

const Stack = createStackNavigator()
function CollectionsStackNavigator () {
  return (
    <Stack.Navigator initialRouteName='Collections'>
      <Stack.Screen name='Collections' component={CollectionsScreen} />
      <Stack.Screen name='Collection' component={CollectionScreen} />
      <Stack.Screen name='CreateCollection' component={CollectionCreateForm} />
      <Stack.Screen name='AddItemToCollection' component={CollectionAddItemForm} />
      <Stack.Screen name='AddMember' component={CollectionManageWSMemberForm} />
    </Stack.Navigator>
  )
}

export default CollectionsStackNavigator
