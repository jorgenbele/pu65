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
    // FIXME
    return props.username !== '' && props.password !== '' && props.error === null
  }

  return (
    <View>
      <Headline>
        Please log in
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
          authLogin(username, password)
          console.log('Pressed')
          if (sucsessfulLogin) return
          navigation.dispatch(
            CommonActions.navigate({
              name: 'Workspacescreen'
            })
          // FIX Navigation
          )
        }}
      >
        Log in
      </Button>
      <HelperText
        type='error'
        visible={sucsessfulLogin()}
      >
          You sucsessfully loged in!!
      </HelperText>
    </View>
  )
}

const mapStateToProps = state => ({
  username: state.auth.username,
  password: state.auth.password,
  error: state.auth.error,
  token: state.auth.token
})

const mapDispatchToProps = { authLogin }

const ConnectedLoginForm = connect(mapStateToProps, mapDispatchToProps)(LoginForm)
export default ConnectedLoginForm
