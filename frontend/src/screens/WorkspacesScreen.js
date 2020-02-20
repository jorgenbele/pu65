import React from 'react'
import { StyleSheet } from 'react-native'

import PopupInfoBanner from '../components/PopupInfoBanner'

import { List, FAB as FAButton } from 'react-native-paper'

import {
  makeWorkspaceListItem
} from '../utils'
import { connect } from 'react-redux'

import store from '../redux/store'
import { ScrollView } from 'react-native-gesture-handler'

const mapStateToProps = state => {
  return { workspaces: state.workspaces }
}

// function mapDispatchToProps(dispatch) {
//  return {
//    createWorkspace: name => dispatch(createWorkspace(name))
//  };
// }

class WorkspacesScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = { workspaces: this.props.workspaces }
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

    const isWorkspaceOwner = workspace => workspace.isOwner

    const managingWorkspaces = this.state.workspaces.filter(isWorkspaceOwner)
    const joinedWorkspaces = this.state.workspaces.filter(
      w => !isWorkspaceOwner(w)
    )

    // const iconicon = makeIcon(true, 'list');
    return (
      <>
        {this.state.workspaces.length <= 0 ? (
          // Display a banner when no workspaces are added
          <PopupInfoBanner
            visible
            message='You are currently without a workspace'
            confirmLabel='Add a workspace'
            confirmAction={() => {
              this.state.workspaces.add(['test'])
            }}
            ignoreLabel='Not now'
            icon='exclamation'
          />
        ) : (
          <ScrollView>
            <List.Section>
              {managingWorkspaces.length > 0 && (
                <>
                  <List.Subheader>Workspaces you manage</List.Subheader>
                  {managingWorkspaces.map((workspace, index) => {
                    return makeWorkspaceListItem(workspace)
                    // <List.Item
                    //  key={workspace + index.toString()}
                    //  title={workspace.name}
                    //  left={() => <List.Icon icon={this.props.workspaceIcon} />}
                    /// >
                  })}
                </>
              )}

              <List.Subheader>Workspaces you are part of</List.Subheader>
              {joinedWorkspaces.map((workspace, index) => {
                return (
                  // <List.Item
                  //  key={workspace + index.toString()}
                  //  title={workspace.name}
                  //  left={() => <List.Icon icon={this.props.workspaceIcon} />}
                  /// >
                  makeWorkspaceListItem(workspace)
                )
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
            // this.props.createWorkspace({name: 'testworkspace'});
            console.log('Pressed')
            console.log(store.getState())
          }} // FIXME: Add authentication/creation of workspace
        />
      </>
    )
  }
}

WorkspacesScreen.defaultProps = {
  workspaceIcon: 'folder',
  // FIXME: members should include current user
  workspaces: []
}

// const ConnectedWorkspacesScreen = connect(mapStateToProps, mapDispatchToProps)(WorkspacesScreen);
const ConnectedWorkspacesScreen = connect(mapStateToProps)(WorkspacesScreen)
export default ConnectedWorkspacesScreen
