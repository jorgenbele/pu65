import { AUTH, COLLECTION, WORKSPACE } from './actionTypes'

// Collection
// FETCH
export function fetchCollectionsPending () {
  return { type: COLLECTION.FETCH_ALL_PENDING }
}

export function fetchCollectionsSuccess (collections) {
  return { type: COLLECTION.FETCH_ALL_SUCCESS, payload: { collections } }
}

export function fetchCollectionsError (error) {
  return { type: COLLECTION.FETCH_ALL_ERROR, payload: { error } }
}

// CREATEfetchCollectionsError
export function createCollectionPending (workspaceId, collectionName) {
  return { type: COLLECTION.CREATE_PENDING }
}

export function createCollectionSuccess (collection) {
  return { type: COLLECTION.CREATE_SUCCESS, payload: { collection } }
}

export function createCollectionError (workspaceId, collectionName, error) {
  return { type: COLLECTION.CREATE_ERROR, payload: { workspaceId, collectionName, error } }
}

// ADD ITEM
export function addItemToCollectionPending (collectionId, item) {
  return { type: COLLECTION.ADD_ITEM_PENDING, payload: { collectionId, item } }
}

export function addItemToCollectionSuccess (collectionId, item) {
  return { type: COLLECTION.ADD_ITEM_SUCCESS, payload: { collectionId, item } }
}

export function addItemCollectionError (collectionId, item, error) {
  return { type: COLLECTION.ADD_ITEM_ERROR, payload: { collectionId, item, error } }
}

// ShoppingList
export function addItem (collection, item) {
  return { type: COLLECTION.ADD_ITEM, payload: { collection, item } }
}

export function removeItem (collectionId, item) {
  return { type: COLLECTION.REMOVE_ITEM, payload: { collectionId, item } }
}

export function renameItem (collection, item, newTitle) {
  return { type: COLLECTION.RENAME, payload: { title: newTitle } }
}

export function toggleItemState (collection, item) {
  return { type: COLLECTION.TOGGLE_STATE, payload: { item } }
}

export function createCollection (collection) {
  return { type: COLLECTION.CREATE, payload: { collection } }
}

export function deleteCollection (collection) {
  return { type: COLLECTION.DELETE, payload: { collection } }
}

// Workspace
export function createWorkspacesPending (workspaceName) {
  return { type: WORKSPACE.CREATE_PENDING, payload: { workspaceName } }
}

export function createWorkspacesSuccess (createdWorkspace) {
  return { type: WORKSPACE.CREATE_SUCCESS, payload: { createdWorkspace } }
}

export function createWorkspacesError (failedWorkspaceName, error) {
  return { type: WORKSPACE.CREATE_ERROR, payload: { failedWorkspaceName, error } }
}

export function fetchWorkspacesPending () {
  return { type: WORKSPACE.FETCH_PENDING }
}

export function fetchWorkspacesSuccess (workspaces) {
  console.log(workspaces)
  return { type: WORKSPACE.FETCH_SUCCESS, payload: { workspaces } }
}

export function fetchWorkspacesError (error) {
  return { type: WORKSPACE.FETCH_ERROR, payload: { error } }
}

// Auth
export function authLoginPending () {
  return { type: AUTH.LOG_IN_PENDING }
}

export function authLoginSuccess (username, token) {
  return { type: AUTH.LOG_IN_SUCCESS, payload: { username, token } }
}

export function authLoginError (error) {
  return { type: AUTH.LOG_IN_ERROR, payload: { error } }
}

export function authLogout (token) {
  return { type: AUTH.LOG_OUT, payload: { token } }
}
// export function authCreate(username, password) {
//    return { type: AUTH.CREATE, payload: { username, password } }
// }
