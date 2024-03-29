export const RESET_TO_INITIAL_STATE = 'RESET_TO_INITIAL_STATE'

export const COLLECTION = {
  FETCH_PENDING: 'COLLECTION_FETCH_PENDING',
  FETCH_SUCCESS: 'COLLECTION_FETCH_SUCCESS',
  FETCH_ERROR: 'COLLECTION_FETCH_ERROR',

  CREATE_PENDING: 'COLLECTION_CREATE_PENDING',
  CREATE_SUCCESS: 'COLLECTION_CREATE_SUCCESS',
  CREATE_ERROR: 'COLLECTION_CREATE_ERROR',

  ADD_ITEM_PENDING: 'ADD_ITEM_PENDING',
  ADD_ITEM_SUCCESS: 'ADD_ITEM_SUCCESS',
  ADD_ITEM_ERROR: 'ADD_ITEM_ERROR',

  UPDATE_ITEM_PENDING: 'UPDATE_ITEM_PENDING',
  UPDATE_ITEM_SUCCESS: 'UPDATE_ITEM_SUCCESS',
  UPDATE_ITEM_ERROR: 'UPDATE_ITEM_ERROR',

  INVITE_MEMBER_TO_COLLECTION_PENDING: 'INVITE_MEMBER_TO_COLLECTION_PENDING',
  INVITE_MEMBER_TO_COLLECTION_SUCCESS: 'INVITE_MEMBER_TO_COLLECTION_SUCCESS',
  INVITE_MEMBER_TO_COLLECTION_ERROR: 'INVITE_MEMBER_TO_COLLECTION_ERROR',

  JOIN_COLLECTION_PENDING: 'JOIN_COLLECTION_PENDING',
  JOIN_COLLECTION_SUCCESS: 'JOIN_COLLECTION_SUCCESS',
  JOIN_COLLECTION_ERROR: 'JOIN_COLLECTION_ERROR',

  LEAVE_COLLECTION_PENDING: 'LEAVE_COLLECTION_PENDING',
  LEAVE_COLLECTION_SUCCESS: 'LEAVE_COLLECTION_SUCCESS',
  LEAVE_COLLECTION_ERROR: 'LEAVE_COLLECTION_ERROR'
}

export const WORKSPACE = {
  CREATE_PENDING: 'WORKSPACE_CREATE_PENDING',
  CREATE_SUCCESS: 'WORKSPACE_CREATE_SUCCESS',
  CREATE_ERROR: 'WORKSPACE_CREATE_ERROR',

  FETCH_PENDING: 'WORKSPACE_FETCH_PENDING',
  FETCH_SUCCESS: 'WORKSPACE_FETCH_SUCCESS',
  FETCH_ERROR: 'WORKSPACE_FETCH_ERROR',

  INVITE_MEMBER_PENDING: 'INVITE_MEMBER_TO_COLLECTION_PENDING',
  INVITE_MEMBER_SUCCESS: 'INVITE_MEMBER_TO_COLLECTION_SUCCESS',
  INVITE_MEMBER_ERROR: 'INVITE_MEMBER_TO_COLLECTION_ERROR',

  REMOVE_FROM_WORKSPACE_PENDING: 'REMOVE_MEMBER_PENDING',
  REMOVE_FROM_WORKSPACE_SUCCESS: 'REMOVE_MEMBER_SUCCESS',
  REMOVE_FROM_WORKSPACE_ERROR: 'REMOVE_MEMBER_ERROR',

  LEAVE_PENDING: 'LEAVE_PENDING',
  LEAVE_SUCCESS: 'LEAVE_SUCCESS',
  LEAVE_ERROR: 'LEAVE_ERROR'
}

export const AUTH = {
  LOG_IN_PENDING: 'LOG_IN_PENDING',
  LOG_IN_SUCCESS: 'LOG_IN_SUCCESS',
  LOG_IN_ERROR: 'LOG_IN_ERROR',

  LOG_OUT_PENDING: 'LOG_OUT_PENDING',
  LOG_OUT_SUCCESS: 'LOG_OUT_SUCCESS',
  LOG_OUT_ERROR: 'LOG_OUT_ERROR',

  // NOT IMPLEMENTED
  CREATE_USER: 'CREATE_USER'
}

export const MEMBERS = {
  FETCH_PENDING: 'MEMBERS_FETCH_PENDING',
  FETCH_SUCCESS: 'MEMBERS_FETCH_SUCCESS',
  FETCH_ERROR: 'MEMBERS_FETCH_ERROR',

  ADD_MEMBER_WORKSPACE: 'MEMBER_ADD_MEMBER_WORKSPACE',
  REMOVE_MEMBER_WORKSPACE: 'MEMBER_REMOVE_MEMBER_WORKSPACE',

  ADD_MEMBER_COLLECTION: 'MEMBER_ADD_MEMBER_COLLECTION',
  REMOVE_MEMBER_COLLECTION: 'MEMBER_REMOVE_MEMBER_COLLECTION'
}
