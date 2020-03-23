import { WORKSPACE } from '../actionTypes'

const initialState = {
  fetchPendingById: new Set(),
  createPendingByName: new Set(),
  error: null,

  invitePendingByIdUsername: new Set(), // set of tuples
  inviteErrorsByIdUsername: new Map(), // [id, username] => error

  removePendingByIdUsername: new Set(), // set of tuples
  removeErrorsByIdUsername: new Map(), // [id, username] => error

  leavePendingById: new Set(), // set of workspace ids
  leaveErrorsById: new Map(), // id => error

  workspacesById: {}
}

export default function (state = initialState, action) {
  switch (action.type) {
    case WORKSPACE.CREATE_PENDING: {
      const { workspaceName } = action.payload
      const createPendingByName = new Set(state.createPendingByName)
      createPendingByName.add(workspaceName)
      return { ...state, createPendingByName }
    }

    case WORKSPACE.CREATE_SUCCESS: {
      const { createdWorkspace } = action.payload
      const createPendingByName = new Set(state.createPendingByName)
      createPendingByName.delete(createdWorkspace.name)
      return {
        ...state,
        createPendingByName,
        workspacesById: {
          [createdWorkspace.id]: createdWorkspace
        }
      }
    }

    case WORKSPACE.CREATE_ERROR: {
      const { failedWorkspaceName, error } = action.payload
      const createPendingByName = new Set(state.createPendingByName)
      createPendingByName.delete(failedWorkspaceName)
      return {
        ...state,
        error,
        createPendingByName
      }
    }

    case WORKSPACE.FETCH_PENDING: {
      const { workspaceId } = action.payload
      const fetchPendingIds = new Set(state.fetchPendingIds)
      fetchPendingIds.add(workspaceId)
      return { ...state, fetchPendingIds }
    }

    case WORKSPACE.FETCH_SUCCESS: {
      console.log(action.payload)
      const { workspace } = action.payload
      const fetchPendingIds = new Set(state.fetchPendingIds)
      fetchPendingIds.delete(workspace.id)
      return {
        ...state,
        fetchPendingIds,
        workspacesById: {
          ...state.workspaceById,
          [workspace.id]: workspace
        }
      }
    }

    case WORKSPACE.FETCH_ERROR: {
      const { workspaceId, error } = action.payload
      const fetchPendingIds = new Set(state.fetchPendingIds)
      fetchPendingIds.delete(workspaceId)
      return { ...state, error, fetchPendingIds }
    }

    case WORKSPACE.INVITE_MEMBER_PENDING: {
      const { workspaceId, username } = action.payload

      const newInvitePendingByIdUsername = state.invitePendingByIdUsername
      newInvitePendingByIdUsername.add([workspaceId, username])

      const newInviteErrorsByIdUsername = state.inviteErrorsByIdUsername
      newInviteErrorsByIdUsername.delete([workspaceId, username])

      console.log('INVITE PENDING')
      return {
        ...state,
        invitePendingByIdUsername: newInvitePendingByIdUsername,
        inviteErrorsByIdUsername: newInviteErrorsByIdUsername
      }
    }

    case WORKSPACE.INVITE_MEMBER_SUCCESS: {
      const { workspaceId, username } = action.payload
      const newInvitePendingByIdUsername = state.invitePendingByIdUsername
      newInvitePendingByIdUsername.add([workspaceId, username])

      const newInviteErrorsByIdUsername = state.inviteErrorsByIdUsername
      newInviteErrorsByIdUsername.delete([workspaceId, username])

      console.log('INVITE SUCCESS')
      return {
        ...state,
        invitePendingByIdUsername: newInvitePendingByIdUsername,
        inviteErrorsByIdUsername: newInviteErrorsByIdUsername
      }
    }

    case WORKSPACE.INVITE_MEMBER_ERROR: {
      const { workspaceId, username, error } = action.payload
      const newInvitePendingByIdUsername = state.invitePendingByIdUsername
      newInvitePendingByIdUsername.delete([workspaceId, username])

      const newInviteErrorsByIdUsername = state.inviteErrorsByIdUsername
      newInviteErrorsByIdUsername.set([workspaceId, username], error)

      console.log('INVITE SUCCESS')
      return {
        ...state,
        invitePendingByIdUsername: newInvitePendingByIdUsername,
        inviteErrorsByIdUsername: newInviteErrorsByIdUsername
      }
    }

    case WORKSPACE.REMOVE_FROM_WORKSPACE_PENDING: {
      const { workspaceId, username } = action.payload

      const newRemovePendingByIdUsername = state.removePendingByIdUsername
      newRemovePendingByIdUsername.add([workspaceId, username])

      const newRemoveErrorsByIdUsername = state.removeErrorsByIdUsername
      newRemoveErrorsByIdUsername.delete([workspaceId, username])

      console.log('REMOVE PENDING')
      return {
        ...state,
        removePendingByIdUsername: newRemovePendingByIdUsername,
        removeErrorsByIdUsername: newRemoveErrorsByIdUsername
      }
    }

    case WORKSPACE.REMOVE_FROM_MEMBER_SUCCESS: {
      const { workspaceId, username } = action.payload
      const newRemovePendingByIdUsername = state.removePendingByIdUsername
      newRemovePendingByIdUsername.add([workspaceId, username])

      const newRemoveErrorsByIdUsername = state.removeErrorsByIdUsername
      newRemoveErrorsByIdUsername.delete([workspaceId, username])

      console.log('REMOVE_FROM SUCCESS')
      return {
        ...state,
        removePendingByIdUsername: newRemovePendingByIdUsername,
        removeErrorsByIdUsername: newRemoveErrorsByIdUsername
      }
    }

    case WORKSPACE.REMOVE_FROM_MEMBER_ERROR: {
      const { workspaceId, username, error } = action.payload
      const newRemovePendingByIdUsername = state.removePendingByIdUsername
      newRemovePendingByIdUsername.add([workspaceId, username])

      const newRemoveErrorsByIdUsername = state.removeErrorsByIdUsername
      newRemoveErrorsByIdUsername.set([workspaceId, username], error)

      console.log('REMOVE_FROM SUCCESS')
      return {
        ...state,
        removePendingByIdUsername: newRemovePendingByIdUsername,
        removeErrorsByIdUsername: newRemoveErrorsByIdUsername
      }
    }

    case WORKSPACE.LEAVE_PENDING: {
      const { workspaceId } = action.payload

      const newLeavePendingById = state.leavePendingById
      newLeavePendingById.add(workspaceId)

      const newLeaveErrorsById = state.leaveErrorsById
      newLeaveErrorsById.delete(workspaceId)

      console.log('LEAVE PENDING')
      return {
        ...state,
        leavePendingById: newLeavePendingById,
        leaveErrorsById: newLeaveErrorsById
      }
    }

    case WORKSPACE.LEAVE_SUCCESS: {
      const { workspaceId } = action.payload
      const newLeavePendingById = state.leavePendingById
      newLeavePendingById.set(workspaceId)

      const newLeaveErrorsById = state.leaveErrorsById
      newLeaveErrorsById.delete(workspaceId)

      console.log('LEAVE SUCCESS')
      return {
        ...state,
        leavePendingById: newLeavePendingById,
        leaveErrorsById: newLeaveErrorsById
      }
    }

    case WORKSPACE.LEAVE_ERROR: {
      const { workspaceId, error } = action.payload
      const newLeavePendingById = state.leavePendingById
      newLeavePendingById.delete(workspaceId)

      const newLeaveErrorsById = state.leaveErrorsById
      newLeaveErrorsById.set(workspaceId, error)

      console.log('LEAVE SUCCESS')
      return {
        ...state,
        leavePendingById: newLeavePendingById,
        leaveErrorsById: newLeaveErrorsById
      }
    }

    default:
      return state
  }
}
