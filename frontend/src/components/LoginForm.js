import React, { useState } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import { Headline, Button, TextInput, HelperText } from 'react-native-paper'
import { CommonActions } from '@react-navigation/native'

import { authLogin } from '../api'

function LoginForm ({ navigation, route, authLogin, ...props }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const sucsessfulLogin = () => {
    return props.username !== '' && props.password !== '' && props.error === 0
    /* dispatch(authLogin(username, password)) */
  }

  return (
    <View>
      <Headline>
        Create new workspace
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
      />
      <HelperText
        type='error'
        visible={!sucsessfulLogin()}
      >
          Password or username is wrong!
      </HelperText>

      <Button
        mode='contained' onPress={() => {
          props.authLogin(username, password)
          if (sucsessfulLogin) return
          navigation.dispatch(
            CommonActions.navigate({
              name: 'Workspacescreen'
            })
          )
        }}
      >
        Create workspace
      </Button>
    </View>
  )
}

const mapStateToProps = state => ({
  usernameState: state.auth.username,
  passwordState: state.auth.password,
  error: state.auth.error
})

const mapDispatchToProps = { authLogin }

const ConnectedLoginForm = connect(mapStateToProps, mapDispatchToProps)(LoginForm)
export default ConnectedLoginForm
