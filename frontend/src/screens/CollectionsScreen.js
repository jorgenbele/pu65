import React from 'react'
import { StyleSheet, ScrollView } from 'react-native'

import { List, FAB as FAButton, ActivityIndicator } from 'react-native-paper'

import { connect } from 'react-redux'
import uuidv4 from 'uuid/v4'

import {
  fetchCollections,
  createCollection,
  makeCollectionListItem
} from '../utils'

import { FETCH_NONE, FETCH_NEVER } from '../constants/FetchStates'
import { CommonActions } from '@react-navigation/native'

class CollectionsScreen extends React.Component {
  constructor (props) {
    super(props)
    this.shouldComponentRender = this.shouldComponentRender.bind(this)
  }

  componentDidMount () {
    const { fetchCollections } = this.props
    fetchCollections()
  }

  shouldComponentRender () {
    // TODO: more checks
    const { fetchState } = this.props
    if (fetchState !== FETCH_NONE) return false
    return true
  }

  render () {
    const { collections, error, fetchState } = this.props
    console.log(fetchState)
    console.log(error)
    console.log('==== COLLECTIONS ====')
    console.log(collections)

    const styles = StyleSheet.create({
      fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0
      }
    })

    if (fetchState !== FETCH_NONE) {
      return <ActivityIndicator animating color='#FF0000' />
    }

    const { createCollection, navigation } = this.props

    return (
      <>
        <ScrollView>
          <List.Section>
            <List.Subheader>Lists you belong to</List.Subheader>
            {collections.map(collection => makeCollectionListItem(collection, {
              onPress: e => {
                console.log('navigating')
                // navigation.('Collection', { collectionId: collection.id })
                navigation.dispatch(
                  CommonActions.navigate({ name: 'Collection', params: { collectionId: collection.id } })
                )
              }
            }))}
          </List.Section>
        </ScrollView>

        <FAButton
          style={styles.fab}
          medium
          icon='plus'
          onPress={() => {
            console.log('CREATING COLLECTION')
            createCollection(1, 'Test list' + uuidv4())
          }} // FIXME: Add authentication/creation of workspace
        />
      </>
    )
  }
}

CollectionsScreen.defaultProps = {
  error: null,
  fetchState: FETCH_NEVER,
  createPending: [],
  collections: []
}

const mapStateToProps = state => ({
  collections: state.collections.collections,
  error: state.collections.error,
  fetchState: state.collections.fetchState,
  createPending: state.collections.createPending
})

const mapDispatchToProps = {
  fetchCollections,
  createCollection
}

const ConnectedCollectionsScreen = connect(mapStateToProps, mapDispatchToProps)(CollectionsScreen)
export default ConnectedCollectionsScreen
