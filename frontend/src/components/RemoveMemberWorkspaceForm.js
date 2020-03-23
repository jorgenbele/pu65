import React, { useState } from 'react'
import { connect } from 'react-redux'

import { Headline, HelperText } from 'react-native-paper'
import { View, TextInput, Button } from 'react-native'

import { removeMemberWorkspace } from '../api'

function RemoveMemberWorkspaceForm ({ navigation, route, removeMemberWorkspace, ...props }) {
  const [username, setUsername] = useState('')

  const { added } = props
  const myWorkspaceID = ''
  const [, setPendingInvites] = useState([[]])  //Må endre her

  const handleToggleMemberRemove = (username) => {
    removeMemberWorkspace(myWorkspaceID, username)
    setPendingInvites(prevPendingInvites => {   //Må endre her
      return [...prevPendingInvites, [myWorkspaceID, username]]
    })
    // Do something when members are added to the workspace.
    // use the workspace ID i am in. Get that from props?
  }

  return (
    <View>
      <Headline>
        Remove member from this workspace
      </Headline>

      <TextInput
        label='Username'
        value={username}
        onChangeText={text => setUsername(text)}
      />

      <Button
        mode='contained' onPress={() => {
          console.log(username)
          handleToggleMemberRemove(username)
          console.log('Pressed')
        }}
      >
        Add user
      </Button>
      <HelperText
        type='info'
        visible={removed}
        style={{ fontSize: 25, color: '#BA8CDF', textAlign: 'center' }}
      >
          You successfully removed this user!
      </HelperText>
      <HelperText
        type='info'
        visible={!added && username !== ''}
        style={{ fontSize: 25, color: '#BA8CDF', textAlign: 'center' }}
      >
          Not a valid member!
      </HelperText>

    </View>
  )
}

const mapStateToProps = state => ({
// have to take in members as prop
  removed: state.removeMemberWorkspacesState

})
const mapDispatchToProps = { removeMemberWorkspace }

const ConnectedWorkspacesCreateForm = connect(mapStateToProps, mapDispatchToProps)(RemoveMemberWorkspaceForm)
export default ConnectedWorkspacesCreateForm //Hva gjør denne?