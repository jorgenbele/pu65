import React from 'react'
import { StyleSheet } from 'react-native'

import PopupInfoBanner from '../components/PopupInfoBanner'

import { List, FAB as FAButton, ActivityIndicator } from 'react-native-paper'

import { connect } from 'react-redux'

import { ScrollView } from 'react-native-gesture-handler'

import {
  fetchWorkspaces,
  makeWorkspaceListItem,
  createWorkspace
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
    const { fetchPending } = this.props
    if (!fetchPending) return false
    return true
  }

  render () {
    const { workspaces, error, fetchPending, fetchWorkspaces } = this.props
    console.log(fetchPending)
    console.log(fetchWorkspaces)
    console.log(error)
    console.log(workspaces)

    if (fetchPending) {
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

    const { createWorkspace } = this.props

    // const iconicon = makeIcon(true, 'list');
    return (
      <>
        {workspaces.length <= 0 ? (
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
                    /// >ConnectedWorkspacesScreenConnectedWorkspacesScreen
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
            console.log('creating workspace!')
            createWorkspace({ name: 'Test workspace' + workspaces.length })
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
  fetchPending: false,
  createPending: [],
  workspaces: []
}

const mapStateToProps = state => ({
  workspaces: state.workspaces.workspaces,
  error: state.workspaces.error,
  fetchPending: state.workspaces.fetchPending,
  createPending: state.workspaces.createPending
})

const mapDispatchToProps = {
  fetchWorkspaces,
  createWorkspace
}

const ConnectedWorkspacesScreen = connect(mapStateToProps, mapDispatchToProps)(WorkspacesScreen)
export default ConnectedWorkspacesScreen
