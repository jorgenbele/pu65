import { combineReducers } from 'redux'
import workspaces from './workspaces'
import auth from './auth'
import collections from './collections'
import members from './members'

import { RESET_TO_INITIAL_STATE } from '../actionTypes'

const combinedReducer = combineReducers({ workspaces, auth, collections, members })

export default (state, action) => {
  // When RESET_TO_INITIAL_STATE is called we reset the state in its entirety
  if (action.type === RESET_TO_INITIAL_STATE) state = undefined
  return combinedReducer(state, action)
}
