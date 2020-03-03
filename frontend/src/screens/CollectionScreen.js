/// COLLECTIONSCREEN
import React, { useEffect } from 'react'
import { StyleSheet, RefreshControl, ScrollView } from 'react-native'
import { List, FAB as FAButton, ActivityIndicator } from 'react-native-paper'
import { connect } from 'react-redux'
import { CommonActions } from '@react-navigation/native'

import { updateItemOfCollection, fetchCollection } from '../api'
import { makeCollectionItem, sortCompareNumber } from '../utils'

import { STATE_BOUGHT, STATE_ADDED } from '../constants/ItemStates'

const CollectionScreen = ({ navigation, collections, route, ...props }) => {
  // collectionId is passed by the navigation system. See the onPress
  // anonymous function in makeCollectionListItem() in CollectionsScreen.js
  const { collectionId } = route.params

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
  const { items } = collection

  const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0
    }
  })

  const handleAddItem = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'AddItemToCollection',
        params: { collection }
      })
    )
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
          <List.Subheader>Items</List.Subheader>
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

      <FAButton
        style={styles.fab}
        medium
        icon='plus'
        onPress={handleAddItem}
      />
    </>
  )
}

// TODO: Not updated
CollectionScreen.defaultProps = {}

const mapStateToProps = state => ({
  collections: state.collections
})

const mapDispatchToProps = {
  updateItemOfCollection,
  fetchCollection
}

const ConnectedCollectionScreen = connect(mapStateToProps, mapDispatchToProps)(CollectionScreen)
export default ConnectedCollectionScreen
