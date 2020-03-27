import React, { useEffect, useState } from 'react'
import { RefreshControl, ScrollView } from 'react-native'
import { List, ActivityIndicator, FAB as FloatingActionButton, Dialog, Paragraph } from 'react-native-paper'

import { connect } from 'react-redux'
import { CommonActions } from '@react-navigation/native'

import { updateItemOfCollection, fetchCollectionAndWorkspace, fetchCollection, fetchWorkspace, leaveCollection } from '../api'
import { makeCollectionItem, sortCompareNumber } from '../utils'

import { STATE_BOUGHT, STATE_ADDED, STATE_CANCELLED } from '../constants/ItemStates'

import store from '../redux/store'

import {
  fetchWorkspaceSuccess, fetchWorkspacePending,
  fetchCollectionSuccess, fetchCollectionPending
} from '../redux/actions'

const CollectionScreen = ({
  navigation, route,
  collections, workspaces,
  fetchCollectionSuccess, fetchWorkspaceSuccess,
  fetchCollection, fetchWorkspace, fetchCollectionPending,
  fetchWorkspacePending,
  leaveCollection,
  ...props
}) => {
  const [open, setOpen] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [dialogMsg, setDialogMsg] = useState('')

  // collectionId is passed by the navigation system. See the onPress
  // anonymous function in makeCollectionListItem() in CollectionsScreen.js
  const { collectionId } = route.params
  const { username } = props

  const onRefresh = async () => {
    fetchCollectionPending(collectionId)
    const [collection, workspace] = await fetchCollectionAndWorkspace(store.getState(), collectionId)
    fetchWorkspacePending(workspace.id)
    fetchWorkspaceSuccess(workspace)
    fetchCollectionSuccess(collection)
  }

  useEffect(() => { onRefresh() }, [])
  const isLoaded = () => (collectionId != null && collectionId in collections.collectionsById)
  const isRefreshing = () => (collectionId in collections.fetchPendingIds)

  if (!isLoaded()) {
    console.log('loading')
    return <ActivityIndicator animating color='#FF0000' />
  }

  // console.log('got colllection and workspace')
  console.log(collections)

  // console.log()
  const collection = collections.collectionsById[collectionId]
  // console.log('collection:', collection)
  const workspace = workspaces.workspacesById[collection.workspace.id]
  // console.log(workspace)

  console.log(collection)
  const isOwnerOfCollection = collection.created_by === username
  const { items } = collection

  const handleAddItem = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'AddItemToCollection',
        params: { collectionId, collection }
      })
    )
  }

  const handleAddMember = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'AddMember',
        params: { collectionId, collection }
      })
    )
  }

  const handleLeaveCollection = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Collections',
        params: { collection }
      })
    )
    leaveCollection(collection.id)
  }

  const handleToggleItemState = (item) => {
    updateItemOfCollection(collectionId, {
      ...item,
      state: item.state === STATE_BOUGHT ? STATE_ADDED : STATE_BOUGHT
    })
  }

  const handleRemoveItem = (item) => {
    console.log('=== REMOVE ITEM ===')
    console.log(workspace)
    console.log(collection)
    console.log(username)

    // The check is done in backend too, but this removes the need for a round-trip to the backend
    if (item.added_by !== username && workspace.members[workspace.owner] !== username && collection.created_by !== username) {
      setDialogMsg('You cannot remove this item because you are not the owner of the item, collection or workspace')
      setShowDialog(true)
      return
    }
    updateItemOfCollection(collectionId, { ...item, state: STATE_CANCELLED })
    setDialogMsg('Removed item ' + item.name + ' from collection ' + collection.name)
    setShowDialog(true)
  }

  const sortedItems = items.sort(sortCompareNumber(e => e.id))
  const boughtItems = sortedItems.filter(item => item.state === STATE_BOUGHT)
  const otherItems = sortedItems.filter(item => item.state === STATE_ADDED)

  const { updateItemOfCollection } = props

  const actions = [{ icon: 'plus', label: 'Legg til produkt', onPress: () => { handleAddItem() } }]

  if (isOwnerOfCollection) {
    actions.push({ icon: 'account-switch', label: 'Legg til medlem', onPress: () => { handleAddMember() } })
  } else {
    actions.push({ icon: 'playlist-remove', label: 'Forlat handleliste', onPress: () => { handleLeaveCollection() } })
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
          <List.Subheader>
            Items
          </List.Subheader>
          {otherItems.map(item => {
            const checkmark = item.state === STATE_BOUGHT
            return makeCollectionItem(item, {
              checkmark,
              onPress: e => handleToggleItemState(item)
            })
          })}
        </List.Section>

        <List.Section>
          <List.Subheader>Bought items</List.Subheader>
          {boughtItems.map(item => {
            const checkmark = item.state === STATE_BOUGHT
            return makeCollectionItem(item, {
              checkmark,
              onPress: e => handleToggleItemState(item),
              onLongPress: e => handleRemoveItem(item)
            })
          })}
        </List.Section>
      </ScrollView>

      <Dialog
        visible={showDialog}
        onDismiss={() => { setShowDialog(false) }}
      >
        <Dialog.Title>Alert</Dialog.Title>
        <Dialog.Content>
          <Paragraph>{dialogMsg}</Paragraph>
        </Dialog.Content>
      </Dialog>

      <FloatingActionButton.Group
        open={open}
        icon={open ? 'menu-up' : 'menu-down'}
        actions={actions}
        onStateChange={() => setOpen(!open)}
        visible
      />
    </>
  )
}

// TODO: Not updated
CollectionScreen.defaultProps = {}

const mapStateToProps = state => ({
  username: state.auth.username,
  collections: state.collections,
  workspaces: state.workspaces
})

const mapDispatchToProps = {
  updateItemOfCollection,
  fetchCollectionSuccess,
  fetchWorkspaceSuccess,
  fetchCollectionPending,
  fetchWorkspacePending,

  fetchWorkspace,
  fetchCollection,

  leaveCollection
}

const ConnectedCollectionScreen = connect(mapStateToProps, mapDispatchToProps)(CollectionScreen)
export default ConnectedCollectionScreen
