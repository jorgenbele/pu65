import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import PopupInfoBanner from '../components/PopupInfoBanner'
import { List, FAB as FAButton } from 'react-native-paper'
import { makeListItem } from '../utils'
import { connect } from 'react-redux'

import { createList } from '../redux/actions'

import store from '../redux/store'

const mapStateToProps = state => {
  return { lists: state.shoppingList.lists }
}

function mapDispatchToProps (dispatch) {
  return {
    createList: l => dispatch(createList(l))
  }
}

class ConnectedListsScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = { lists: this.props.lists }
  }

  render () {
    const styles = StyleSheet.create({
      fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0
      }
    })

    const isPersonalList = list => list.workspace === null
    console.log('this.props.list:')
    console.log(this.props.lists)
    const personalLists = this.props.lists.filter(isPersonalList)
    const sharedLists = this.props.lists.filter(l => !isPersonalList(l))

    return (
      <>
        {this.state.lists.length <= 0 ? (
          // Display a banner when no lists exists
          <PopupInfoBanner
            visible
            message={
              'You currently have ' +
              this.props.lists.length.toString() +
            ' lists'
            }
            confirmLabel='Create a list'
            confirmAction={() => {
              this.setState({
                lists: [
                  {
                    name: 'Kollektiv2',
                    workspace: 'Kollektivet'
                  },
                  ...this.state.lists
                ]
              })
            }}
            ignoreLabel='Not now'
            icon='exclamation'
          />
        ) : (
          <ScrollView>
            <List.Section>
              {personalLists.length > 0 && (
                <>
                  <List.Subheader>Personal lists</List.Subheader>
                  {personalLists.map((list, index) => {
                    return makeListItem(list.name, list.name)
                    // <List.Item
                    //  key={list + index.toString()}
                    //  title={list.name}
                    //  left={() => <List.Icon icon={this.props.listIcon} />}
                    /// >
                  })}
                </>
              )}

              <List.Subheader>Shared lists</List.Subheader>
              {sharedLists.map((list, index) => {
                return makeListItem(list.name, list.workspace)
                // <List.Item
                //  key={list + index.toString()}
                //  title={list.name}
                //  left={() => <List.Icon icon={this.props.listIcon} />}
                /// >
              })}
            </List.Section>
          </ScrollView>
        )}

        <FAButton
          style={styles.fab}
          medium
          icon='plus'
          onPress={() => {
            console.log(store.getState())
            this.props.createList({
              name:
                'List ' +
                this.props.lists
                  .reduce((l, r) => (l.index > r.index ? l.index : r.index), 0)
                  .toString(),
              workspace: 'Kollektivet',
              index:
                1 +
                this.props.lists.reduce(
                  (l, r) => (l.index > r.index ? l.index : r.index),
                  0
                )
            })
            console.log('Pressed')
          }} // FIXME: Add authentication/creation of workspace
        />
      </>
    )
  }
}
ConnectedListsScreen.defaultProps = {
  listIcon: 'folder',
  lists: []
}

const ListsScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedListsScreen)
export default ListsScreen
