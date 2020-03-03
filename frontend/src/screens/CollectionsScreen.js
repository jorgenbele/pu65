import React, { useEffect } from 'react'
import { StyleSheet, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler'
import { List, FAB as FAButton, ActivityIndicator } from 'react-native-paper'

import { fetchMember } from '../api'
import { makeCollectionListItem, sortCompareNumber } from '../utils'

import { CommonActions } from '@react-navigation/native'

function CollectionsScreen ({
  navigation, username, members,
  workspaces, collections, fetchPendingIds, ...props
}) {
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

  const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0
    }
  })

  const handleCreateNewCollection = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'CreateCollection'
      })
    )
  }

  const member = members.membersByUsername[username]
  const collectionIdNameMap = member.collections
  const sortedCollectionPairs = Object.keys(collectionIdNameMap)
    .sort(sortCompareNumber(e => e[0])).map((id, _) => [id, collectionIdNameMap[id]])
  console.log(sortedCollectionPairs)

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
                    CommonActions.navigate({ name: 'Collection', params: { collectionId: id } })
                  )
                }
              })
            }
            )
          }
        </List.Section>
      </ScrollView>

      <FAButton
        style={styles.fab}
        medium
        icon='plus'
        onPress={handleCreateNewCollection}
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
