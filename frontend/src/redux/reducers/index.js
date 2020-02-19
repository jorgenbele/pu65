import { combineReducers } from "redux";
import shoppingList from './shoppingList'
import workspaces from './workspaces'

export default combineReducers({ shoppingList, workspaces });
