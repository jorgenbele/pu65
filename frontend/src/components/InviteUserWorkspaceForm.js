import React, { useState } from 'react'
import { connect } from 'react-redux'

import { HelperText, Headline, Button, TextInput } from 'react-native-paper'
import { View } from 'react-native'

import { inviteMemberWorkspace } from '../api'

function InviteUserWorkspaceForm ({
  navigation, route, inviteMemberWorkspace, ...props
}) {
  const [username, setUsername] = useState('')

  const { workspaceId } = route.params

  const isValidUsername = (username) => username !== ''

  const handleInviteUser = (username) => {
    if (!isValidUsername) return
    inviteMemberWorkspace(workspaceId, username)
    navigation.pop()
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
      <HelperText
        type='error'
        visible={!isValidUsername(username)}
      >
          You must set a valid username!
      </HelperText>

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
