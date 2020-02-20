import React from 'react'
import { StyleSheet } from 'react-native'
import { FAB as FAButton } from 'react-native-paper'

import ShoppingItem from '../components/ShoppingItem'
import { ScrollView } from 'react-native-gesture-handler'

export default class ListScreen extends React.Component {
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

    // const isPersonalList = list => list.workspace === null;

    return (
      <>
        <ScrollView>
          {this.state.list.map((l, i) => <ShoppingItem title={l.name} key={i} />)}
        </ScrollView>

        <FAButton
          style={styles.fab}
          medium
          icon='plus'
          onPress={() => {
            this.setState({
              lists: [
                {
                  name: 'Kollektiv2',
                  workspace: 'Kollektivet'
                },
                ...this.state.lists
              ],
              ...this.state
            })
            console.log('Pressed')
          }} // FIXME: Add authentication/creation of workspace
        />
      </>
    )
  }
}

ListScreen.defaultProps = {
  listIcon: 'folder'
}
