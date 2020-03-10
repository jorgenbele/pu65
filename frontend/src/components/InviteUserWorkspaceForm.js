import React, { useState } from 'react'
import { connect } from 'react-redux'

import { Headline, HelperText } from 'react-native-paper'
import { View, TextInput, Button } from 'react-native'

import { inviteMemberWorkspace } from '../api'

function InviteUserWorkspaceForm ({ navigation, route, inviteMemberWorkspace, ...props }) {
  const [username, setUsername] = useState('')

  const { added } = props
  const myWorkspaceID = ''
  const [pendingInvites, setPendingInvites] = useState([[]])

  const handleToggleMemberAdd = (username) => {
    inviteMemberWorkspace(myWorkspaceID, username)
    setPendingInvites(prevPendingInvites => {
      return {...prevPendingInvites, [myWorkspaceID, username] }
    })
    // Do something when members are added to the workspace.
    // use the workspace ID i am in. Get that from props?
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
          console.log(username)
          handleToggleMemberAdd(username)
          console.log('Pressed')
        }}
      >
        Add user
      </Button>
      <HelperText
        type='info'
        visible={added}
        style={{ fontSize: 25, color: '#BA8CDF', textAlign: 'center' }}
      >
          You successfully added this user!
      </HelperText>
      <HelperText
        type='info'
        visible={!added && username !== ''}
        style={{ fontSize: 25, color: '#BA8CDF', textAlign: 'center' }}
      >
          Not a valid user!
      </HelperText>

    </View>
  )
}

const mapStateToProps = state => ({
// have to take in members as prop
  added: state.addMemberWorkspacesState

})
const mapDispatchToProps = { inviteMemberWorkspace }

const ConnectedWorkspacesCreateForm = connect(mapStateToProps, mapDispatchToProps)(InviteUserWorkspaceForm)
export default ConnectedWorkspacesCreateForm
