import React, { useState } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import { Headline, Button, TextInput, HelperText } from 'react-native-paper'
import { CommonActions } from '@react-navigation/native'

import { authLogin } from '../api'
import { promiseDelay } from '../utils'

import SECRETS from '../secrets'

function LoginForm ({ navigation, route, authLogin, ...props }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { loggedIn, pending } = props

  if (loggedIn) {
    promiseDelay(1000).then(() => {
      // Let the successfull message be displayed for 500 ms
      navigation.dispatch(
        CommonActions.navigate({
          name: 'Workspaces'
        }))
    })
  }

  return (
    <View>
      <Headline
        style={{ textAlign: 'center', padding: 20 }}
      >
        Please log in :)
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
        visible={!loggedIn && !pending}
        style={{ fontSize: 20, textAlign: 'center' }}
      >
          Invalid password and username combination!
      </HelperText>

      <Button
        mode='contained' onPress={() => {
          console.log(username, password)
          authLogin(username, password)
          console.log('Pressed')
        }}
      >
        Log in
      </Button>
      <HelperText
        type='info'
        visible={loggedIn}
        style={{ fontSize: 25, color: '#BA8CDF', textAlign: 'center' }}
      >
          You successfully logged in!!
      </HelperText>

      <Button
        mode='contained' onPress={() => {
          console.log(SECRETS.USER_NAME, SECRETS.USER_PASSWORD)
          authLogin(SECRETS.USER_NAME, SECRETS.USER_PASSWORD)
        }}
      >
        Debug login
      </Button>
    </View>
  )
}

const mapStateToProps = state => ({
  username: state.auth.username,
  password: state.auth.password,
  loggedIn: state.auth.loggedIn,
  error: state.auth.error,
  pending: state.auth.pending,
  token: state.auth.token
})

const mapDispatchToProps = { authLogin }

const ConnectedLoginForm = connect(mapStateToProps, mapDispatchToProps)(LoginForm)
export default ConnectedLoginForm
