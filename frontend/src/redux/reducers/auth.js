
import { AUTH } from '../actionTypes'

const initialState = {
  username: null,
  token: null
}

export default function (state = initialState, action) {
  switch (action.type) {
    case AUTH.LOG_IN: {
      console.log(action.payload)
      const { username, password } = action.payload

      console.log(username + ' ' + password)

      // sample response
      const response = { token: 'test' }

      return {
        username: username,
        token: response.token
      }
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
