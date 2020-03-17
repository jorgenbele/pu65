import React, { useState } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import { inviteMemberToCollection } from '../api'

import { Headline, Button, TextInput } from 'react-native-paper'

function ManageMembersInCollection ({ navigation, route, username, inviteMemberToCollection, collectionId, ...props }) {
  const [name, setName] = useState()

  const { collection } = route.params

  return (
    <View>
      <Headline>
                Choose an user to invite
      </Headline>
      <TextInput
        label='Username'
        value={name}
        onChangeText={text => setName(text)}
      />
      <Button
        mode='contained' onPress={() => {
          if (!name) return

          inviteMemberToCollection(collection.id, name)

          navigation.pop()
        }}
      >
                Add user to collection
      </Button>

    </View>
  )
}

const mapStateToProps = state => ({
  username: state.members.membersByUsername[state.auth.username],
  collections: state.collections.collections
})
const mapDispatchToProps = { inviteMemberToCollection }

const ConnectedManageMembersForm = connect(mapStateToProps, mapDispatchToProps)(ManageMembersInCollection)

export default ConnectedManageMembersForm
