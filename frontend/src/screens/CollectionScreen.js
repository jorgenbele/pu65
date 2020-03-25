import React, { useEffect, useState } from 'react'
import { RefreshControl, ScrollView } from 'react-native'
import { List, ActivityIndicator, FAB as FloatingActionButton } from 'react-native-paper'

import { connect } from 'react-redux'
import { CommonActions } from '@react-navigation/native'

import { updateItemOfCollection, fetchCollection } from '../api'
import { makeCollectionItem, sortCompareNumber } from '../utils'

import { STATE_BOUGHT, STATE_ADDED } from '../constants/ItemStates'

const CollectionScreen = ({ navigation, collections, route, ...props }) => {
  const [open, setOpen] = useState(false)

  // collectionId is passed by the navigation system. See the onPress
  // anonymous function in makeCollectionListItem() in CollectionsScreen.js
  const { username, collectionId } = route.params

  const onRefresh = () => {
    const { fetchCollection } = props
    fetchCollection(collectionId)
  }

  useEffect(() => { onRefresh() }, [])

  const isLoaded = () => (collectionId != null && (collectionId in collections.collectionsById))
  const isRefreshing = () => (collectionId in collections.fetchPendingIds)

  if (!isLoaded()) {
    return <ActivityIndicator animating color='#FF0000' />
  }

  const collection = collections.collectionsById[collectionId]
  const isOwnerOfCollection = collection.added_by === username
  const { items } = collection

  const handleAddItem = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'AddItemToCollection',
        params: { collection }
      })
    )
  }

  const handleAddMember = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'AddMember',
        params: { collection }
      })
    )
  }

  // dummie function
  const leaveCollection = (collectionId) => {
    console.log('You have left the collection')
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

  const sortedItems = items.sort(sortCompareNumber(e => e.id))
  const boughtItems = sortedItems.filter(item => item.state === STATE_BOUGHT)
  const otherItems = sortedItems.filter(item => item.state !== STATE_BOUGHT)

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
              onPress: e => handleToggleItemState(item)
            })
          })}
        </List.Section>
      </ScrollView>
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
  collections: state.collections
})

const mapDispatchToProps = {
  updateItemOfCollection,
  fetchCollection
}

const ConnectedCollectionScreen = connect(mapStateToProps, mapDispatchToProps)(CollectionScreen)
export default ConnectedCollectionScreen
