import React, { useEffect, useState } from 'react'
import { RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler'
import { List, FAB as FAButton, ActivityIndicator } from 'react-native-paper'

import { fetchMember, fetchWorkspace, leaveWorkspace } from '../api'
import { makeCollectionListItem, sortCompareNumber } from '../utils'

import { CommonActions } from '@react-navigation/native'

function CollectionsScreen ({
  navigation, route,
  username, members, workspaces, collections,
  fetchMember, fetchWorkspace, leaveWorkspace,
  ...props
}) {
  console.log('collectionsscreen: ', workspaces)

  const [open, setOpen] = useState(false)

  const workspaceId = route.params && route.params.workspaceId

  const onRefresh = () => {
    fetchMember(username)
    fetchWorkspace(workspaceId)
  }
  useEffect(() => { onRefresh() }, [])

  const isWorkspaceSpecific = !!workspaceId
  let workspace = null
  if (isWorkspaceSpecific) workspace = workspaces.workspacesById[workspaceId]
  console.log('workspace', workspace)

  const isOwnerOfSpecificWorkspace = (workspace) => workspace && workspace.owner === username

  const isLoaded = () => username != null && (username in members.membersByUsername) && (!isWorkspaceSpecific || workspaceId in workspaces.workspacesById)
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

  const handleLeaveWorkspace = () => {
    if (!isWorkspaceSpecific) return
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Workspaces',
        params: { workspace, workspaceId }
      })
    )
    leaveWorkspace(workspaceId)
  }

  const handleRemoveMember = (username) => {
    if (!isWorkspaceSpecific) return
    navigation.dispatch(
      CommonActions.navigate({
        name: 'RemoveMemberFromWorkspace',
        params: { workspace, workspaceId }
      })
    )
  }

  const handleAddUser = () => {
    if (!isWorkspaceSpecific) return
    navigation.dispatch(
      CommonActions.navigate({
        name: 'InviteUserWorkspace',
        params: { workspace, workspaceId }
      })
    )
  }

  const member = members.membersByUsername[username]
  const collectionIdNameMap = member.collections
  // const workspaceSpesificCollections = collectionIdNameMap.includes()
  const sortedCollectionPairs = Object.keys(collectionIdNameMap)
    .filter(id => (isWorkspaceSpecific ? id in workspace.collections : true))
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
  fetchMember,
  fetchWorkspace,
  leaveWorkspace
}

const ConnectedCollectionsScreen = connect(mapStateToProps, mapDispatchToProps)(CollectionsScreen)
export default ConnectedCollectionsScreen
