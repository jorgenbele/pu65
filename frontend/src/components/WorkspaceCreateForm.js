import React, { useState } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import { Headline, Button, TextInput, HelperText } from 'react-native-paper'

import { createWorkspace } from '../api'

function WorkspaceCreateForm ({ navigation, route, createWorkspace, ...props }) {
  const [workspaceName, setWorkspaceName] = useState('')

  const isValidWorkspaceName = () => {
    return workspaceName !== ''
  }

  return (
    <View>
      <Headline>
        Create new workspace
      </Headline>

      <TextInput
        label='Workspace name'
        value={workspaceName}
        onChangeText={text => setWorkspaceName(text)}
      />
      <HelperText
        type='error'
        visible={!isValidWorkspaceName()}
      >
          You must set a valid workspace name!
      </HelperText>

      <Button
        mode='contained' onPress={() => {
          if (!isValidWorkspaceName) return
          createWorkspace({ name: workspaceName })
          navigation.pop()
        }}
      >
        Create workspace
      </Button>
    </View>
  )
}

const mapStateToProps = state => ({ })
const mapDispatchToProps = { createWorkspace }

const ConnectedWorkspacesCreateForm = connect(mapStateToProps, mapDispatchToProps)(WorkspaceCreateForm)
export default ConnectedWorkspacesCreateForm
