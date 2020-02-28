/// COLLECTIONSCREEN
import React from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { List, FAB as FAButton, ActivityIndicator } from 'react-native-paper'
import { connect } from 'react-redux'
import uuidv4 from 'uuid/v4'

import {
  makeCollectionItem,
  addItemToCollection,
  removeItemFromCollection,
  fetchCollections
} from '../utils'
import { STATE_BOUGHT } from '../constants/ItemStates'

const CollectionScreen = props => {
  const { route, collections } = props
  const { collectionId } = route.params
  console.log('CollectionScreen collectionId: ' + collectionId)
  const collectionArray = collections.filter(c => c.id === collectionId)

  if (collectionArray.length !== 1) {
    return <ActivityIndicator animating color='#FF0000' />
  }
  const collection = collectionArray[0]
  console.log(collection)
  const { items } = collection

  const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0
    }
  })

  const { removeItemFromCollection, addItemToCollection } = props
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
              onLongPress: e => {
                console.log('ITEM PRESSED LONG, DELETING')
                removeItemFromCollection(collectionId, item)
              }
            })
          })}
        </List.Section>
      </ScrollView>

      <FAButton
        style={styles.fab}
        medium
        icon='plus'
        onPress={() => {
          console.log('ADDING ITEM')
          addItemToCollection(collectionId, { name: 'Test element' + uuidv4(), quantity: 1 })
        }}
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
  fetchCollections
}

const ConnectedCollectionScreen = connect(mapStateToProps, mapDispatchToProps)(CollectionScreen)
export default ConnectedCollectionScreen
