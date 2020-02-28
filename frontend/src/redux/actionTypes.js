// Shopping List
export const SHOPPING_LIST = {
  CREATE: 'CREATE',
  DELETE: 'DELETE',

  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  RENAME: 'RENAME',
  TOGGLE_STATE: 'TOGGLE_STATE'
}

export const COLLECTION = {
  FETCH_ALL_PENDING: 'COLLECTION_FETCH_PENDING',
  FETCH_ALL_SUCCESS: 'COLLECTION_FETCH_SUCCESS',
  FETCH_ALL_ERROR: 'COLLECTION_FETCH_ERROR',

  CREATE_PENDING: 'COLLECTION_CREATE_PENDING',
  CREATE_SUCCESS: 'COLLECTION_CREATE_SUCCESS',
  CREATE_ERROR: 'COLLECTION_CREATE_ERROR',

  ADD_ITEM_PENDING: 'ADD_ITEM_FETCH_PENDING',
  ADD_ITEM_SUCCESS: 'ADD_ITEM_FETCH_SUCCESS',
  ADD_ITEM_ERROR: 'ADD_ITEM_FETCH_ERROR',

  CREATE: 'COLLECTION_CREATE',
  DELETE: 'COLLECTION_DELETE',

  ADD_ITEM: 'COLLECTION_ADD_ITEM',
  REMOVE_ITEM: 'COLLECTION_REMOVE_ITEM',
  RENAME: 'COLLECTION_RENAME',
  TOGGLE_STATE: 'COLLECTION_TOGGLE_STATE'
}

export const WORKSPACE = {
  CREATE_PENDING: 'WORKSPACE_CREATE_PENDING',
  CREATE_SUCCESS: 'WORKSPACE_CREATE_SUCCESS',
  CREATE_ERROR: 'WORKSPACE_CREATE_ERROR',

  FETCH_PENDING: 'WORKSPACE_FETCH_PENDING',
  FETCH_SUCCESS: 'WORKSPACE_FETCH_SUCCESS',
  FETCH_ERROR: 'WORKSPACE_FETCH_ERROR'
}

export const AUTH = {
  LOG_IN_PENDING: 'LOG_IN_PENDING',
  LOG_IN_SUCCESS: 'LOG_IN_SUCCESS',
  LOG_IN_ERROR: 'LOG_IN_ERROR',

  LOG_OUT: 'LOG_OUT',
  CREATE_USER: 'CREATE_USER'

  // DELETE_USER: 'DELETE_USER', // ???
}
