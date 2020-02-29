import { MEMBERS } from '../actionTypes'

const initialState = {
  error: null,
  membersByUsername: {
    jbr: { id: 2, workspaces: [] }
  }
}

export default function (state = initialState, action) {
  switch (action.type) {
    // TODO FIX
    case MEMBERS.FETCH_PENDING: {
      return { ...state, error: null }
    }

    case MEMBERS.FETCH_SUCCESS: {
      const { id, username, workspaces } = action.payload
      return {
        ...state,
        error: null,
        membersByUsername: {
          ...state.membersByUsername,
          [username]: { id, workspaces }
        }
      }
    }

    case MEMBERS.FETCH_ERROR: {
      const { error } = action.payload
      return { ...state, error }
    }

    default:
      return state
  }
}
