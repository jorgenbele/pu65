import { combineReducers } from 'redux'
import workspaces from './workspaces'
import auth from './auth'
import collections from './collections'

export default combineReducers({ workspaces, auth, collections })
