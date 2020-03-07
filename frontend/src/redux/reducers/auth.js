import { AUTH } from '../actionTypes'

const initialState = {
  username: null,
  token: null,
  loggedIn: false,
  pending: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case AUTH.LOG_IN_PENDING: {
      return { ...state, username: null, token: null, pending: true, loggedIn: false }
    }

    case AUTH.LOG_IN_SUCCESS: {
      const { username, token } = action.payload
      console.log('LOGGED IN: ', username + ' ' + token)
      return { ...state, pending: false, username, token, loggedIn: true }
    }

    case AUTH.LOG_IN_ERROR: {
      const { error } = action.payload
      return { ...state, username: null, token: null, pending: false, error, loggedIn: false }
    }

    case AUTH.LOG_OUT:
      // TODO
      return state

    case AUTH.CREATE_USER:
      // TODO
      return state

    default:
      return state
  }
}
