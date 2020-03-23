import React, { useState } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import { Headline, Button, TextInput, HelperText } from 'react-native-paper'

import { authCreateUser } from '../api'

function UserCreateForm ({ navigation, route, ...props }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [repeat, setRepeat] = useState('')

  const isValidPassword = () => {
    return password === repeat
  }

  const handleCreateUser = () => {
    if (!isValidPassword()) return
    authCreateUser(username, password)
    navigation.pop()
  }

  return (
    <View>
      <Headline
        style={{ textAlign: 'center', padding: 20 }}
      >
        Create user :)
      </Headline>

      <TextInput
        label='Username'
        value={username}
        onChangeText={text => setUsername(text)}
      />
      <TextInput
        label='Password'
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
      />
      <TextInput
        label='Repeat password'
        value={repeat}
        onChangeText={text => setRepeat(text)}
        secureTextEntry
      />
      <HelperText
        type='error'
        visible={!isValidPassword()}
        style={{ fontSize: 20, textAlign: 'center' }}
      >
          Passwords does not match!
      </HelperText>

      <Button
        mode='contained' onPress={() => {
          console.log('Pressed')
          if (!isValidPassword()) return
          handleCreateUser()
        }}
      >
        Register
      </Button>
    </View>
  )
}

const mapStateToProps = state => ({
})

const mapDispatchToProps = { }

const ConnectedLoginForm = connect(mapStateToProps, mapDispatchToProps)(UserCreateForm)
export default ConnectedLoginForm
