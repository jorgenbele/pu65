import { AUTH, COLLECTION, WORKSPACE, MEMBERS } from './actionTypes'

export function fetchCollectionPending (collectionId) {
  return { type: COLLECTION.FETCH_PENDING, payload: { collectionId } }
}

export function fetchCollectionSuccess (collection) {
  return { type: COLLECTION.FETCH_SUCCESS, payload: { collection } }
}

export function fetchCollectionError (collectionId, error) {
  return { type: COLLECTION.FETCH_ERROR, payload: { collectionId, error } }
}

export function createCollectionPending (workspaceId, collectionName) {
  return { type: COLLECTION.CREATE_PENDING, payload: { workspaceId, collectionName } }
}

export function createCollectionSuccess (collection) {
  return { type: COLLECTION.CREATE_SUCCESS, payload: { collection } }
}

export function createCollectionError (workspaceId, collectionName, error) {
  return { type: COLLECTION.CREATE_ERROR, payload: { workspaceId, collectionName, error } }
}

export function addItemToCollectionPending (collectionId, item) {
  return { type: COLLECTION.ADD_ITEM_PENDING, payload: { collectionId, item } }
}

export function addItemToCollectionSuccess (collectionId, item) {
  return { type: COLLECTION.ADD_ITEM_SUCCESS, payload: { collectionId, item } }
}

export function addItemToCollectionError (collectionId, item, error) {
  return { type: COLLECTION.ADD_ITEM_ERROR, payload: { collectionId, item, error } }
}

export function updateItemOfCollectionPending (collectionId, item) {
  return { type: COLLECTION.UPDATE_ITEM_PENDING, payload: { collectionId, item } }
}

export function updateItemOfCollectionSuccess (collectionId, item) {
  return { type: COLLECTION.UPDATE_ITEM_SUCCESS, payload: { collectionId, item } }
}

export function updateItemOfCollectionError (collectionId, item, error) {
  return { type: COLLECTION.UPDATE_ITEM_ERROR, payload: { collectionId, item, error } }
}

export function createCollection (collection) {
  return { type: COLLECTION.CREATE, payload: { collection } }
}

// not implemented
export function deleteCollection (collection) {
  return { type: COLLECTION.DELETE, payload: { collection } }
}

export function inviteMemberToCollectionPending (collectionId, username) {
  return { type: COLLECTION.INVITE_MEMBER_TO_COLLECTION_PENDING, payload: { collectionId, username } }
}

export function inviteMemberToCollectionSuccess (collectionId, username) {
  return { type: COLLECTION.INVITE_MEMBER_TO_COLLECTION_SUCCESS, payload: { collectionId, username } }
}

export function inviteMemberToCollectionError (collectionId, username, inviteError) {
  return { type: COLLECTION.INVITE_MEMBER_TO_COLLECTION_ERROR, payload: { collectionId, username, inviteError } }
}

export function createWorkspacePending (workspaceName) {
  return { type: WORKSPACE.CREATE_PENDING, payload: { workspaceName } }
}

export function createWorkspaceSuccess (createdWorkspace) {
  return { type: WORKSPACE.CREATE_SUCCESS, payload: { createdWorkspace } }
}

export function createWorkspaceError (failedWorkspaceName, error) {
  return { type: WORKSPACE.CREATE_ERROR, payload: { failedWorkspaceName, error } }
}

export function fetchWorkspacePending (workspaceId) {
  return { type: WORKSPACE.FETCH_PENDING, payload: { workspaceId } }
}

export function fetchWorkspaceSuccess (workspace) {
  return { type: WORKSPACE.FETCH_SUCCESS, payload: { workspace } }
}

export function fetchWorkspaceError (workspaceId, error) {
  return { type: WORKSPACE.FETCH_ERROR, payload: { workspaceId, error } }
}

export function inviteMemberWorkspacePending (workspaceId, username) {
  return { type: WORKSPACE.INVITE_MEMBER_PENDING, payload: { workspaceId, username } }
}

export function inviteMemberWorkspaceSuccess (workspaceId, username, data) {
  return { type: WORKSPACE.INVITE_MEMBER_SUCCESS, payload: { workspaceId, username, data } }
}

export function inviteMemberWorkspaceError (workspaceId, username, error) {
  return { type: WORKSPACE.INVITE_MEMBER_ERROR, payload: { workspaceId, username, error } }
}

export function leaveWorkspacePending (workspaceId) {
  return { type: WORKSPACE.LEAVE_PENDING, payload: { workspaceId } }
}

export function leaveWorkspaceSuccess (workspaceId, data) {
  return { type: WORKSPACE.LEAVE_SUCCESS, payload: { workspaceId, data } }
}

export function leaveWorkspaceError (workspaceId, error) {
  return { type: WORKSPACE.LEAVE_ERROR, payload: { workspaceId, error } }
}

export function removeFromWorkspacePending (workspaceId, username) {
  return { type: WORKSPACE.REMOVE_FROM_WORKSPACE_PENDING, payload: { workspaceId, username } }
}

export function removeFromWorkspaceSuccess (workspaceId, username, data) {
  return { type: WORKSPACE.REMOVE_FROM_WORKSPACE_SUCCESS, payload: { workspaceId, username, data } }
}

export function removeFromWorkspaceError (workspaceId, username, error) {
  return { type: WORKSPACE.REMOVE_FROM_WORKSPACE_ERROR, payload: { workspaceId, username, error } }
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

export function authLogoutPending (token) {
  return { type: AUTH.LOG_OUT_SUCCESS, payload: { token } }
}

export function authLogoutSuccess () {
  return { type: AUTH.LOG_OUT_SUCCESS, payload: { } }
}

export function authLogoutError (error) {
  return { type: AUTH.LOG_OUT_ERROR, payload: { error } }
}

export function fetchMemberPending (username) {
  return { type: MEMBERS.FETCH_PENDING, payload: { username } }
}

export function fetchMemberSuccess (id, username, workspaces, collections, allCollections) {
  return {
    type: MEMBERS.FETCH_SUCCESS,
    payload: {
      id, username, workspaces, collections, allCollections
    }
  }
}

export function fetchMemberError (username, error) {
  return { type: MEMBERS.FETCH_ERROR, payload: { username, error } }
}

// update the state of the members.workspacesById field with
// the given workspace
export function addMemberWorkspacesState (username, workspace) {
  return { type: MEMBERS.ADD_MEMBER_WORKSPACE, payload: { username, workspace } }
}

// update the state of the members.workspacesById field with
// the given collection
export function addMemberCollectionsState (username, collection) {
  return { type: MEMBERS.ADD_MEMBER_COLLECTION, payload: { username, collection } }
}
