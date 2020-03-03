import { MEMBERS } from '../actionTypes'

const initialState = {
  error: null,
  fetchPendingUsernames: new Set(),
  membersByUsername: {
    jbr: { id: 2, workspaces: {}, collections: {} }
  }
}

export default function (state = initialState, action) {
  switch (action.type) {
    case MEMBERS.FETCH_PENDING: {
      const { username } = action.payload
      const fetchPendingUsernames = new Set(state.fetchPendingUsernames)
      fetchPendingUsernames.add(username)
      return { ...state, error: null, fetchPendingUsernames }
    }

    case MEMBERS.FETCH_SUCCESS: {
      const { id, username, workspaces, collections } = action.payload
      const fetchPendingUsernames = new Set(state.fetchPendingUsernames)
      fetchPendingUsernames.delete(username)
      return {
        ...state,
        error: null,
        fetchPendingUsernames,
        membersByUsername: {
          ...state.membersByUsername,
          [username]: { id, workspaces, collections }
        }
      }
    }

    case MEMBERS.FETCH_ERROR: {
      const { username, error } = action.payload
      const fetchPendingUsernames = new Set(state.fetchPendingUsernames)
      fetchPendingUsernames.delete(username)
      return { ...state, error, fetchPendingUsernames }
    }

    // When a user adds a workspace we want it to be added without
    // fetching from backend
    case MEMBERS.ADD_MEMBER_WORKSPACE: {
      console.log('MEMBERS ADD MEMBER WORKSPACE')
      const { workspace, username } = action.payload
      return {
        ...state,
        error: null,
        membersByUsername: {
          ...state.membersByUsername,
          [username]: {
            ...state.membersByUsername[username],
            workspaces: {
              ...state.membersByUsername[username].workspaces,
              [workspace.id]: workspace.name
            }
          }
        }
      }
    }

    // When a user adds a collection we want it to be added without
    // fetching from backend
    case MEMBERS.ADD_MEMBER_COLLECTION: {
      const { collection, username } = action.payload
      return {
        ...state,
        error: null,
        membersByUsername: {
          ...state.membersByUsername,
          [username]: {
            ...state.membersByUsername[username],
            collections: {
              ...state.membersByUsername[username].collections,
              [collection.id]: collection.name
            }
          }
        }
      }
    }

    default:
      return state
  }
}
