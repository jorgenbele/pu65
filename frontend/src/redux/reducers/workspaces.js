import { WORKSPACE } from '../actionTypes'

const initialState = {
  fetchPending: false,
  createPending: [],
  error: null,

  workspaces: [
    {
      name: 'Kollektivet',
      isOwner: true,
      members: ['jbr'],
      collections: ['Kollektivfest'],
      id: 155
    },
    {
      name: 'Hjemme',
      isOwner: false,
      members: ['jbr'],
      collections: ['Hjemmefest'],
      id: 1
    },
    {
      name: 'Jobb',
      isOwner: false,
      members: ['jbr'],
      collections: ['Jobbfest'],
      id: 2
    }
  ]
}

export default function (state = initialState, action) {
  switch (action.type) {
    case WORKSPACE.CREATE_PENDING: {
      const { workspaceName } = action.payload
      return { ...state, createPending: [...state.createPending, workspaceName] }
    }

    case WORKSPACE.CREATE_SUCCESS: {
      const { createdWorkspace } = action.payload
      return {
        ...state,
        createPending: [...state.createPending.filter(w => w !== createdWorkspace.name)]
      }
    }

    case WORKSPACE.CREATE_ERROR: {
      const { failedWorkspaceName, error } = action.payload
      return {
        ...state,
        error,
        createPending: [...state.createPending.filter(w => w !== failedWorkspaceName)]
      }
    }

    case WORKSPACE.FETCH_PENDING: {
      return { ...state, fetchPending: true }
    }

    case WORKSPACE.FETCH_SUCCESS: {
      const { workspaces } = action.payload
      return { ...state, fetchPending: false, workspaces }
    }

    case WORKSPACE.FETCH_ERROR: {
      const { error } = action.payload
      return { ...state, fetchPending: false, error }
    }

    default:
      return state
  }
}
