import React, { useState } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import { Headline, Button, TextInput, HelperText, List } from 'react-native-paper'

import { createCollection } from '../api'

function CollectionCreateForm ({ me, navigation, route, createCollection, ...props }) {
  const [workspaceListExpanded, setWorkspaceListExpanded] = useState(true)
  const [workspace, setWorkspace] = useState({ id: null, name: null })
  const [collectionName, setCollectionName] = useState('')

  const isValidCollectionName = () => {
    return collectionName !== ''
  }

  const isValidWorkspace = () => {
    return workspace.id !== null
  }

  return (
    <View>
      <Headline>
        Create new collection
      </Headline>

      <List.Accordion
        title={workspace.name || 'Select Workspace'}
        left={props => <List.Icon {...props} icon='apps' />}
        expanded={workspaceListExpanded}
        onPress={() => setWorkspaceListExpanded(!workspaceListExpanded)}
      >

        {
          Object.keys(me.workspaces).map((id) => {
            const name = me.workspaces[id]
            console.log(id, name)
            return (
              <List.Item
                title={name}
                key={id}
                onPress={() => { setWorkspace({ id, name }); setWorkspaceListExpanded(false) }}
                left={props => {
                  if (workspace.id === id) { return <List.Icon {...props} icon='checkbox-marked-circle-outline' /> }
                }}
              />
            )
          })
        }

      </List.Accordion>

      <HelperText
        type='error'
        visible={!isValidWorkspace()}
      >
          You must choose a workspace
      </HelperText>

      <TextInput
        label='Collection name'
        value={collectionName}
        onChangeText={text => setCollectionName(text)}
      />
      <HelperText
        type='error'
        visible={!isValidCollectionName()}
      >
          You must set a valid collection name!
      </HelperText>

      <Button
        mode='contained' onPress={() => {
          if (!isValidCollectionName() || !isValidWorkspace()) return
          createCollection(workspace, collectionName)
          navigation.pop()
        }}
      >
        Create collection
      </Button>
    </View>
  )
}

const mapStateToProps = state => ({
  me: state.members.membersByUsername[state.auth.username]
})
const mapDispatchToProps = { createCollection }

const ConnectedCollectionCreateForm = connect(mapStateToProps, mapDispatchToProps)(CollectionCreateForm)
export default ConnectedCollectionCreateForm
