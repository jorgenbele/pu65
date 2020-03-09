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
      console.log('LOGIN ERROR ', error)
      return { ...state, username: null, token: null, pending: false, error, loggedIn: false }
    }

    case AUTH.LOG_OUT_PENDING: {
      console.log('LOGGED OUT PENDING')
      return { ...state, pending: true }
    }

    case AUTH.LOG_OUT_SUCCESS: {
      console.log('LOGGED OUT')
      return { ...state, pending: false, username: null, token: null, loggedIn: false }
    }

    case AUTH.LOG_OUT_ERROR: {
      const { error } = action.payload
      console.log('LOGOUT ERROR ', error)
      return { ...state, pending: false, error }
    }

    case AUTH.CREATE_USER:
      // TODO
      return state

    default:
      return state
  }
}
