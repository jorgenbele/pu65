import { combineReducers } from 'redux'
import shoppingList from './shoppingList'
import workspaces from './workspaces'
import auth from './auth'

export default combineReducers({ shoppingList, workspaces, auth })
