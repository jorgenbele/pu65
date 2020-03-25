import React, { useState } from 'react'
import { connect } from 'react-redux'

import { Headline, HelperText, TextInput, Button } from 'react-native-paper'
import { View } from 'react-native'

import { removeFromWorkspace } from '../api'

function RemoveMemberWorkspaceForm ({ navigation, route, removeFromWorkspace, ...props }) {
  const [username, setUsername] = useState('')
  const [isRemoving, setIsRemoving] = useState(false)

  const { pending, errors } = props
  const { workspace, workspaceId } = route.params

  const handleRemoveMember = (username) => {
    removeFromWorkspace(workspace, username)
    setIsRemoving(true)
  }

  const removed = () => {
    return isRemoving && [workspaceId, username] in pending
  }

  const error = () => {
    return isRemoving && [workspaceId, username] in errors
  }

  console.log('REMOVING FROM ', workspace)

  return (
    <View>
      <Headline>
        Remove member from the {workspace.name} workspace
      </Headline>

      <TextInput
        label='Username'
        value={username}
        onChangeText={text => setUsername(text)}
      />

      <Button
        mode='contained' onPress={() => {
          handleRemoveMember(username)
          console.log(pending)
          console.log(errors)
        }}
      >
        Remove user from workspace
      </Button>
      <HelperText
        type='info'
        visible={removed()}
        style={{ fontSize: 25, color: '#BA8CDF', textAlign: 'center' }}
      >
          You successfully removed this user!
      </HelperText>
      <HelperText
        type='info'
        visible={error()}
        style={{ fontSize: 25, color: '#BA8CDF', textAlign: 'center' }}
      >
          Not a valid member!
      </HelperText>

    </View>
  )
}

const mapStateToProps = state => ({
  pending: state.workspaces.removePendingByIdUsername,
  errors: state.workspaces.removeErrorsByIdUsername
})
const mapDispatchToProps = { removeFromWorkspace }

export default connect(mapStateToProps, mapDispatchToProps)(RemoveMemberWorkspaceForm)
