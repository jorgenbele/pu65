import React from 'react'
import { StyleSheet } from 'react-native'

import PopupInfoBanner from '../components/PopupInfoBanner'

import { List, FAB as FAButton, ActivityIndicator } from 'react-native-paper'

import { connect } from 'react-redux'

import store from '../redux/store'
import { ScrollView } from 'react-native-gesture-handler'

import {
  fetchWorkspaces,
  makeWorkspaceListItem
} from '../utils'

class WorkspacesScreen extends React.Component {
  constructor (props) {
    super(props)
    this.shouldComponentRender = this.shouldComponentRender.bind(this)
  }

  componentDidMount () {
    const { fetchWorkspaces } = this.props
    fetchWorkspaces()
  }

  shouldComponentRender () {
    // TODO: more checks
    const { pending } = this.props
    if (!pending) return false
    return true
  }

  render () {
    const { workspaces, error, pending } = this.props
    console.log(pending)
    console.log(error)
    console.log(workspaces)

    if (pending) {
      return <ActivityIndicator animating color='#FF0000' />
    }

    const styles = StyleSheet.create({
      fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0
      }
    })

    console.log(this.props)
    const isWorkspaceOwner = workspace => workspace.isOwner

    console.log(this.props.workspaces)
    const managingWorkspaces = this.props.workspaces.filter(isWorkspaceOwner)
    const joinedWorkspaces = this.props.workspaces.filter(
      w => !isWorkspaceOwner(w)
    )

    // const iconicon = makeIcon(true, 'list');
    return (
      <>
        {this.props.workspaces.length <= 0 ? (
          // Display a banner when no workspaces are added
          <PopupInfoBanner
            visible
            message='You are currently without a workspace'
            confirmLabel='Add a workspace'
            confirmAction={(ConnectedWorkspacesScreen) => {
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
  error: null,
  pending: false,
  workspaces: []
}

const mapStateToProps = state => ({
  workspaces: state.workspaces.workspaces,
  error: state.workspaces.error,
  pending: state.workspaces.pending
})

const mapDispatchToProps = {
  fetchWorkspaces
}

const ConnectedWorkspacesScreen = connect(mapStateToProps, mapDispatchToProps)(WorkspacesScreen)
export default ConnectedWorkspacesScreen
