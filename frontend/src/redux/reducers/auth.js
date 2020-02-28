import { AUTH } from '../actionTypes'

const initialState = {
  username: 'jbr',
  token: '716e8f4f78eab7d4dff3a4237a94b32c9159e244'
}

export default function (state = initialState, action) {
  switch (action.type) {
    case AUTH.LOG_IN_PENDING: {
      return { ...state, pending: true }
    }

    case AUTH.LOG_IN_SUCCESS: {
      const { username, token } = action.payload
      console.log('LOGGED IN: ', username + ' ' + token)
      return { ...state, pending: false, username, token }
    }

    case AUTH.LOG_IN_ERROR: {
      const { error } = action.payload
      return { ...state, pending: false, error }
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
