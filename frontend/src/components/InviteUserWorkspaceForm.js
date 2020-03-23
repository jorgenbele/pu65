import React, { useState } from 'react'
import { connect } from 'react-redux'

import { Headline, Button, TextInput } from 'react-native-paper'
import { View } from 'react-native'

import { inviteMemberWorkspace } from '../api'

function InviteUserWorkspaceForm ({
  navigation, route, inviteMemberWorkspace, ...props
}) {
  const [username, setUsername] = useState('')

  const { workspaceId } = route.params

  const isValidUsername = (username) => username !== ''

  const handleInviteUser = (username) => {
    inviteMemberWorkspace(workspaceId, username)
  }

  return (
    <View>
      <Headline>
        Invite user to this workspace
      </Headline>

      <TextInput
        label='Username'
        value={username}
        onChangeText={text => setUsername(text)}
      />

      <Button
        mode='contained' onPress={() => {
          if (!isValidUsername(username)) return
          handleInviteUser(username)
        }}
      >
        Add user
      </Button>
    </View>
  )
}

const mapStateToProps = state => ({ })
const mapDispatchToProps = { inviteMemberWorkspace }

const ConnectedWorkspacesCreateForm = connect(mapStateToProps, mapDispatchToProps)(InviteUserWorkspaceForm)
export default ConnectedWorkspacesCreateForm
