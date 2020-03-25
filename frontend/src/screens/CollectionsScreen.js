import React, { useEffect, useState } from 'react'
import { RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler'
import { List, FAB as FAButton, ActivityIndicator } from 'react-native-paper'

import { fetchMember } from '../api'
import { makeCollectionListItem, sortCompareNumber } from '../utils'

import { CommonActions } from '@react-navigation/native'

function CollectionsScreen ({
  navigation, username, members, workspaces, collections,
  fetchPendingIds, route, ...props
}) {
  const [open, setOpen] = useState(false)

  const workspaceId = route.params
  const isWorkspaceSpecific = workspaceId != null
  let workspace = null
  if (isWorkspaceSpecific) workspace = workspaces.workspacesById[workspaceId]

  const isOwnerOfSpecificWorkspace = workspace && workspace.owner === username

  const onRefresh = () => {
    const { fetchMember } = props
    fetchMember(username)
  }
  useEffect(() => { onRefresh() }, [])

  const isLoaded = () => username != null && (username in members.membersByUsername)
  const isRefreshing = () => members.fetchPendingUsernames.has(username)

  if (!isLoaded()) {
    return <ActivityIndicator animating color='#FF0000' />
  }

  const handleCreateNewCollection = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'CreateCollection',
        params: isWorkspaceSpecific ? { workspaceId } : { }
      })
    )
  }

  // dummie function
  const leaveWorkspace = (workspaceId) => {
    if (!isWorkspaceSpecific) return
    console.log('You have left the workspace')
  }

  const handleLeaveWorkspace = () => {
    if (!isWorkspaceSpecific) return
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Workspaces'
      })
    )
    leaveWorkspace(workspaceId)
  }

  const handleRemoveMember = (username) => {
    if (!isWorkspaceSpecific) return
    navigation.dispatch(
      CommonActions.navigate({
        name: 'RemoveMemberFromWorkspace'
      })
    )
  }

  const handleAddUser = () => {
    if (!isWorkspaceSpecific) return
    navigation.dispatch(
      CommonActions.navigate({
        name: 'InviteUserToWorkspace'
      })
    )
  }

  const member = members.membersByUsername[username]
  const collectionIdNameMap = member.collections
  // const workspaceSpesificCollections = collectionIdNameMap.includes()
  const sortedCollectionPairs = Object.keys(collectionIdNameMap)
    .sort(sortCompareNumber(e => e[0])).map((id, _) => [id, collectionIdNameMap[id]])
  console.log(sortedCollectionPairs)

  const actions = [
    { icon: 'playlist-plus', label: 'Opprett handleliste', onPress: () => { handleCreateNewCollection() } }
  ]

  if (isWorkspaceSpecific) {
    if (isOwnerOfSpecificWorkspace) {
      actions.push({ icon: 'account-plus', label: 'Legg til meldlem i workspace', onPress: () => { handleAddUser() } })
      actions.push({ icon: 'account-minus', label: 'Fjern medlem fra workspace', onPress: () => { handleRemoveMember() } })
    } else {
      actions.push({ icon: 'playlist-remove', label: 'Forlat workspace', onPress: () => { handleLeaveWorkspace() } })
    }
  }

  return (
    <>
      <ScrollView
        refreshControl={
          // The refreshControl prop and the RefreshControl component implements
          // a pull-down-to refresh functionality, as seen in most mobile apps.
          // Here we call onRefresh (seen above).
          <RefreshControl refreshing={isRefreshing()} onRefresh={onRefresh} />
        }
      >
        <List.Section>
          <List.Subheader>Lists you belong to</List.Subheader>
          {
            // TODO: reverse-lookup of workspace name may be needed,
            // for now the workspace name is not displayed
            sortedCollectionPairs.map(([id, name], index) => {
              return makeCollectionListItem(id, name, name, {
                onPress: e => {
                  navigation.dispatch(
                    CommonActions.navigate({
                      name: 'Collection',
                      params: { collectionId: id }
                    })
                  )
                }
              })
            }
            )
          }
        </List.Section>
      </ScrollView>
      <FAButton.Group
        open={open}
        icon={open ? 'menu-up' : 'menu-down'}
        actions={actions}
        onStateChange={() => setOpen(!open)}
        visible
      />
    </>
  )
}

// TODO: update
CollectionsScreen.defaultProps = {}

const mapStateToProps = state => ({
  username: state.auth.username,
  members: state.members,
  collections: state.collections,
  workspaces: state.workspaces,

  error: state.collections.error,
  fetchPendingIds: state.collections.fetchPendingIds,
  createPending: state.collections.createPending
})

const mapDispatchToProps = {
  fetchMember
}

const ConnectedCollectionsScreen = connect(mapStateToProps, mapDispatchToProps)(CollectionsScreen)
export default ConnectedCollectionsScreen
