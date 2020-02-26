import { WORKSPACE } from '../actionTypes'

const initialState = {
  pending: false,
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
  console.log('WORKSPACE REDUCER')
  switch (action.type) {
    case WORKSPACE.FETCH_PENDING: {
      console.log('workspace pending')
      return { ...state, pending: true }
    }

    case WORKSPACE.FETCH_SUCCESS: {
      console.log('workspace success')
      const { workspaces } = action
      console.log(workspaces)
      return { ...state, pending: false, workspaces }
    }

    case WORKSPACE.FETCH_ERROR: {
      console.log('workspace error')
      const { error } = action
      return { ...state, pending: false, error }
    }

    case WORKSPACE.CREATE: {
      // console.log('action.payload');
      // console.log(action.payload);
      const { name } = action.payload

      return [
        ...state,
        {
          name,
          isOwner: true,
          members: ['jbr'],
          collections: [],
          id: 1 + state.reduce((l, r) => (l.id > r.id ? l.id : r.id), 0)
        }
      ]
    }
    default:
      return state
  }
}

// Selectors: https://dev.to/markusclaus/fetching-data-from-an-api-using-reactredux-55ao
export const getWorkspaces = state => state.workspaces
export const getWorkspacesPending = state => state.pending
export const getWorkspacesError = state => state.error
