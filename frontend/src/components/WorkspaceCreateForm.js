import React, { useState } from 'react'
import { View } from 'react-native'
import { Headline, Button, TextInput, HelperText, ActivityIndicator, Snackbar } from 'react-native-paper'

export default function WorkspaceCreateForm ({ ...props }) {
  const [workspaceName, setWorkspaceName] = useState('')
  const [createState, setCreateState] = useState({ pending: false, response: null })
  // response is on the form: { wasSuccessful: <bool>, error: <error> (on error), workspace: <workspace> (on success) }

  const [snackBarVisible, setSnackBarVisible] = useState(false)

  const { route } = props
  const { createNewWorkspace } = route.params

  const isValidWorkspaceName = () => {
    return workspaceName !== ''
  }

  if (createState.pending) {
    return (
      <View>
        <ActivityIndicator animating color='#FF0000' />
      </View>
    )
  } else if (createState.response) {
    return (
      <Snackbar
        visible={snackBarVisible} // snackBarVisible is set when the createWorkspace promise is returned
        onDismiss={() => setSnackBarVisible(false)}
      >
        {!createState.response.wasSuccessful ? 'Failed to create workspace ' + createState.response.error
          : 'Created workspace ' + createState.response.workspace}
      </Snackbar>
    )
  }

  return (
    <View>
      <Headline>
        Create new workspace
      </Headline>

      <TextInput
        label='Workspace name'
        value={workspaceName}
        onChangeText={text => setWorkspaceName(text)}
      />
      <HelperText
        type='error'
        visible={!isValidWorkspaceName()}
      >
          You must set a valid workspace name!
      </HelperText>

      <Button
        mode='contained' onPress={() => {
          if (!isValidWorkspaceName) return

          createNewWorkspace(workspaceName,
            (response) => {
              console.log('GOT CRETE WORKSPACE RESPONE ')
              setSnackBarVisible(true)
              setCreateState({ pending: false, response })
            }
          )
        }}
      >
        Create workspace
      </Button>
    </View>
  )
}
