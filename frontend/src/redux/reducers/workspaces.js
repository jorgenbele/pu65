import { WORKSPACE } from '../actionTypes'

const initialState = {
  fetchPendingById: new Set(),
  createPendingByName: new Set(),
  error: null,

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

    default:
      return state
  }
}
