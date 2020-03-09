import React, { useState } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import { Headline, Button, TextInput, HelperText } from 'react-native-paper'
// import { CommonActions } from '@react-navigation/native'

function UserCreateForm ({ navigation, route, ...props }) {
  const [username, setUsername] = useState('')
  const [tryPassword, setTryPassword] = useState('')
  const [password, setPassword] = useState('')
  const [registered, setRegistered] = useState(false)

  const sucsessSetPassword = () => {
    // FIXME
    console.log(tryPassword === password)
    console.log(tryPassword)
    return tryPassword === password
  }

  const dummiFunction = () => {
    return [username, password]
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
        value={tryPassword}
        onChangeText={text => setTryPassword(text)}
        secureTextEntry
      />
      <TextInput
        label='Repeat password'
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
      />
      <HelperText
        type='error'
        visible={!sucsessSetPassword()}
        style={{ fontSize: 20, textAlign: 'center' }}
      >
          Password does not match!
      </HelperText>

      <Button
        mode='contained' onPress={() => {
          console.log('Pressed')
          if (sucsessSetPassword()) {
            dummiFunction() // Link to backend to save user information
            setRegistered(true)
          }
          // FIX Navigation
        }}
      >
        Register
      </Button>
      <HelperText
        type='info'
        visible={registered && sucsessSetPassword()}
        style={{ fontSize: 25, color: '#BA8CDF', textAlign: 'center' }}
      >
          You sucsessfully registered your user!!
      </HelperText>
    </View>
  )
}

const mapStateToProps = state => ({
})

const mapDispatchToProps = { }

const ConnectedLoginForm = connect(mapStateToProps, mapDispatchToProps)(UserCreateForm)
export default ConnectedLoginForm
