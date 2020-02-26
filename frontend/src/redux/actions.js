import { AUTH, SHOPPING_LIST, WORKSPACE } from './actionTypes'

// ShoppingList
export function addItem (list, item) {
  return { type: SHOPPING_LIST.ADD_ITEM, payload: { list, item } }
}

export function removeItem (list, item) {
  return { type: SHOPPING_LIST.REMOVE_ITEM, payload: { list, item } }
}

export function renameItem (list, item, newTitle) {
  return { type: SHOPPING_LIST.RENAME, payload: { title: newTitle } }
}

export function toggleItemState (list, item) {
  return { type: SHOPPING_LIST.TOGGLE_STATE, payload: { item } }
}

export function createList (list) {
  return { type: SHOPPING_LIST.CREATE, payload: { list } }
}
export function deleteList (list) {
  return { type: SHOPPING_LIST.DELETE, payload: { list } }
}

// Workspace
export function createWorkspace (name) {
  return { type: WORKSPACE.CREATE, payload: { name } }
}

// Auth
export function authLoginPending () {
  return { type: AUTH.LOG_IN_PENDING }
}

export function authLoginSuccess (username, token) {
  return { type: AUTH.LOG_IN_SUCCESS, payload: { username, token } }
}

export function authLoginError (error) {
  return { type: AUTH.LOG_IN_ERROR, error }
}

export function authLogout (token) {
  return { type: AUTH.LOG_OUT, payload: { token } }
}
// export function authCreate(username, password) {
//    return { type: AUTH.CREATE, payload: { username, password } }
// }
