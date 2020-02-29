/// COLLECTIONSCREEN
import React from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { List, FAB as FAButton, ActivityIndicator } from 'react-native-paper'
import { connect } from 'react-redux'
import { CommonActions } from '@react-navigation/native'

import {
  makeCollectionItem,
  addItemToCollection,
  removeItemFromCollection,
  fetchCollections,
  updateItemOfCollection
} from '../utils'
import { STATE_BOUGHT, STATE_ADDED } from '../constants/ItemStates'

const CollectionScreen = ({ navigation, collections, route, addItemToCollection, ...props }) => {
  const { collectionId } = route.params

  console.log('CollectionScreen collectionId: ' + collectionId)
  const collectionArray = collections.filter(c => c.id === collectionId)

  if (collectionArray.length !== 1) {
    return <ActivityIndicator animating color='#FF0000' />
  }
  const collection = collectionArray[0]
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
    updateItemOfCollection(collectionId, { ...item, state: item.state === STATE_BOUGHT ? STATE_ADDED : STATE_BOUGHT })
  }

  const { updateItemOfCollection } = props
  return (
    <>
      <ScrollView>
        <List.Section>
          <List.Subheader>Items</List.Subheader>
          {items.map(item => {
            const checkmark = item.state === STATE_BOUGHT
            return makeCollectionItem(item, {
              checkmark,
              onPress: e => console.log('ITEM PRESSED'),
              onLongPress: e => handleToggleItemState(item)
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

CollectionScreen.defaultProps = {
  collectionId: 1, // this collection
  collections: [] // all collections
}

const mapStateToProps = state => ({
  collections: state.collections.collections
})

const mapDispatchToProps = {
  addItemToCollection,
  removeItemFromCollection,
  updateItemOfCollection,
  fetchCollections
}

const ConnectedCollectionScreen = connect(mapStateToProps, mapDispatchToProps)(CollectionScreen)
export default ConnectedCollectionScreen
