import React, { useEffect } from 'react'
import { StyleSheet, RefreshControl } from 'react-native'
import PopupInfoBanner from '../components/PopupInfoBanner'
import { List, FAB as FAButton, ActivityIndicator } from 'react-native-paper'
import { connect } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler'
import { CommonActions } from '@react-navigation/native'

import { fetchMember, createWorkspace } from '../api'
import { sortCompareNumber, makeWorkspaceListItem } from '../utils'

function WorkspacesScreen ({ navigation, ...props }) {
  // navigation is the prop passed to all screens by
  // react-native-navigation, and is used to be able
  // to change screens. In this screen we use it to
  // change to the create workspace screen.

  // username and members are props updated by redux/react-redux
  // as seen in the mapStateToProps function seen at the end of
  // the file. This means that whenever at *ANY* place in
  // the app the username or members portion of the global state
  // is updated, this screen will be re-rendered/updated with
  // those new values.
  const { username, members } = props

  // onRefresh is used to fetch the information about
  // the current user (called member). This information
  // includes a list of workspace <id, name> pairs in the
  // form of a dictionary, and is used to display the
  // workspaces list.
  const onRefresh = () => {
    const { fetchMember } = props
    fetchMember(username)
  }
  // Using useEffect with the second parameter []
  // makes this equivalent (I think) to onComponentMount,
  // which means that it will be called when this component is
  // first in use.
  useEffect(() => { onRefresh() }, [])

  // Helper functions to ease code readibility - shows intention
  const isLoaded = () => username != null && (username in members.membersByUsername)
  const isRefreshing = () => members.fetchPendingUsernames.has(username)

  if (!isLoaded()) {
    // Waiting for member dict to be fetched,
    // just display a loading animation
    return <ActivityIndicator animating color='#FF0000' />
  }

  // Styling for the FAB - to make it float in a suitable position
  const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0
    }
  })

  // This gets the workspaces mapping from id to name of the workspaces
  // that the current user belongs to, as mentioned above.
  const workspaceIdNamePairs = members.membersByUsername[username].workspaces

  // list of tuples: (workspaceId, workspaceIdNamePairs) sorted by workspaceId
  const sortedWorkspaces = Object.keys(workspaceIdNamePairs)
    .map(workspaceId => [workspaceId, workspaceIdNamePairs[workspaceId]])
    .sort(sortCompareNumber(e => e[0]))

  // Navigate to the screen to create a new workspace when the FAB add button
  // is pressed. This will change to the 'CreateWorkspace' screen, defined in
  // src/navigation/WorkspacesStackNavigator.js
  const handleCreateNewWorkspace = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'CreateWorkspace'
      })
    )
  }

  // Display a popup message instructing the user to create a new
  // workspace when they have none.
  const noWorkspacesPopup = sortedWorkspaces.length <= 0 &&
  (
    <PopupInfoBanner
      visible
      confirmLabel=''
      message='Create a new workspace by pressing the plus button'
      ignoreLabel='Dismiss'
      icon='exclamation'
    />
  )

  return (
    <>
      {noWorkspacesPopup}
      <ScrollView
        refreshControl={
          // The refreshControl prop and the RefreshControl component implements
          // a pull-down-to refresh functionality, as seen in most mobile apps.
          // Here we call onRefresh (seen above).
          <RefreshControl refreshing={isRefreshing()} onRefresh={onRefresh} />
        }
      >
        <List.Section>
          <List.Subheader>Your workspaces</List.Subheader>
          {/* Just map the workspaceId-name list created above to
               the cooresponding workspace item components. */}
          {sortedWorkspaces.map(([workspaceId, name], index) => {
            return makeWorkspaceListItem(workspaceId, name)
          })}
        </List.Section>
      </ScrollView>

      {/* The FAB mentioned above. It is used to create a new workspace. */}
      <FAButton
        style={styles.fab}
        medium
        icon='plus'
        onPress={handleCreateNewWorkspace}
      />
    </>)
}

// FIXME: Fix defaultProps, they are outdated
WorkspacesScreen.defaultProps = {}

// mapStateToProps describes how redux should
// map the state in the redux store to the props
// of this component. Here we care about the
// members, the username of the current user and more.
const mapStateToProps = state => ({
  members: state.members,
  username: state.auth.username,

  // TODO: remove error, fetchPending and createPending?
  workspaces: state.workspaces.workspaces,
  error: state.workspaces.error,
  fetchPending: state.workspaces.fetchPending,
  createPending: state.workspaces.createPending
})

// mapDispatchToProps is used to create a mapping
// from props to the functions to call to do something
// with the redux store. We use redux-thunk, so these
// are functions that themselves call actions, not
// actions in themselves, but they could be.
const mapDispatchToProps = {
  fetchMember,
  createWorkspace
}

const ConnectedWorkspacesScreen = connect(mapStateToProps, mapDispatchToProps)(WorkspacesScreen)
export default ConnectedWorkspacesScreen
