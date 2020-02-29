import React from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { connect } from 'react-redux'

import { List, FAB as FAButton, ActivityIndicator } from 'react-native-paper'

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
    const { collections, fetchState } = this.props

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

    const { navigation } = this.props

    // TODO: use redux store to handle pending create
    const handleCreateNewCollection = () => {
      navigation.dispatch(
        CommonActions.navigate({
          name: 'CreateCollection'
        })
      )
    }

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
          onPress={handleCreateNewCollection}
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
