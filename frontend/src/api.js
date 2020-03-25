/* global fetch:false Headers:false */

import {
  BASE_URL, LOGIN_PATH, LOGOUT_PATH, WORKSPACES_PATH,
  COLLECTIONS_PATH, ITEMS_PATH, MEMBERS_PATH
} from './constants/Urls'

import {
  authLoginSuccess, authLoginPending, authLoginError,
  createWorkspaceSuccess, createWorkspacePending, createWorkspaceError,

  fetchWorkspaceSuccess, fetchWorkspacePending, fetchWorkspaceError,
  addMemberWorkspacesState, addMemberCollectionsState,
  inviteMemberWorkspaceSuccess, inviteMemberWorkspacePending, inviteMemberWorkspaceError,
  leaveWorkspaceSuccess, leaveWorkspacePending, leaveWorkspaceError,
  removeFromWorkspaceSuccess, removeFromWorkspacePending, removeFromWorkspaceError,

  fetchCollectionSuccess, fetchCollectionPending, fetchCollectionError,

  createCollectionSuccess, createCollectionPending, createCollectionError,
  addItemToCollectionSuccess, addItemToCollectionPending, addItemToCollectionError,
  updateItemOfCollectionSuccess, updateItemOfCollectionPending, updateItemOfCollectionError,
  inviteMemberToCollectionSuccess, inviteMemberToCollectionPending, inviteMemberToCollectionError,

  fetchMemberSuccess, fetchMemberPending, fetchMemberError, authLogoutPending,

  authLogoutSuccess, authLogoutError
} from './redux/actions'
import { RESET_TO_INITIAL_STATE } from './redux/actionTypes'

// authorizationToken is a helper function to
// return a authrozation token used in requests
// to backend that requires authorization
// (for example all user actions)
export const authorizationToken = (state) => {
  return { Authorization: 'Token ' + state.auth.token }
}

// headersFromOptions is a helper function to extract
// the headers field from an option dict, or just
// use Content-Type Json with authentication token
const headersFromOptions = (getState, options) => {
  if (options && options.headers) {
    return options.headers
  }
  return new Headers({
    'Content-type': 'application/json',
    ...authorizationToken(getState())
  })
}

// apiCall is a wrapper function for fetch, don't use this directly
// instead use one of apiPost, apiGet, apiPatch, etc.
const apiCall = (endpoints, method, pending, success, error, options) => {
  let url = BASE_URL + endpoints.join('/')
  if (!url.endsWith('/')) url = url + '/'

  return (dispatch, getState) => {
    pending(dispatch, getState)
    const promise = fetch(url, {
      method, headers: headersFromOptions(getState, options), body: options && options.body
    })

    if (options && options.noJSON) {
      return promise.then(data => { success(dispatch, getState, data) })
        .catch(errorData => error(dispatch, getState, errorData))
    }
    return promise.then(data => data.json())
      .then(jsonData => { success(dispatch, getState, jsonData) })
      .catch(errorData => error(dispatch, getState, errorData))
  }
}

const apiPost = (endpoints, pending, success, error, options) => {
  return apiCall(endpoints, 'POST', pending, success, error, options)
}

const apiGet = (endpoints, pending, success, error, options) => {
  return apiCall(endpoints, 'GET', pending, success, error, options)
}

const apiPatch = (endpoints, pending, success, error, options) => {
  return apiCall(endpoints, 'PATCH', pending, success, error, options)
}

const apiPut = (endpoints, pending, success, error, options) => {
  return apiCall(endpoints, 'PUT', pending, success, error, options)
}

// withDispatch returns a function that takes (dispatch, getState, data)
// and calls dispatch on the callback with data as the first parameter
// and getState as the second, to the callback function.
const withDispatch = (callback) => {
  return (dispatch, getState, data) => dispatch(callback(data, getState))
}

// authLogin is a redux-thunk action function that will
// authenticate as a user given the username and password
// of said account. It will update the redux store, and
// must be mapped to dispatch, using mapToDispatch, or
// by calling dispatch(authLogin(username, password))
// directly
export function authLogin (username, password) {
  console.log('AUTH LOGIN')
  return apiPost([LOGIN_PATH],
    withDispatch(authLoginPending),
    (dispatch, getState, data) => {
      console.log('AUTH LOGIN SUCCESSFUL', data.token)
      dispatch(authLoginSuccess(username, data.token))
    },
    withDispatch(authLoginError),
    {
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' }
    }
  )
}

// authLogout is similar to authLogin but logs out the user
// instead of logging in. NOTE: the token provided is
// the one that is invalidated, so be sure to pass the
// correct one.
export function authLogout (token) {
  console.log('Logging out')
  return apiPost([LOGOUT_PATH],
    withDispatch(authLogoutPending.bind(null, token)),
    // withDispatch(authLogoutSuccess.bind(null, token)),
    (dispatch, getState, data) => {
      console.log('AUTH LOGOUT SUCCESSFUL', token)
      dispatch(authLogoutSuccess(token))
      dispatch({ type: RESET_TO_INITIAL_STATE })
    },
    withDispatch(authLogoutError),
    { headers: { Authorization: 'Token ' + token }, noJSON: true })
}

// fetchWorkspace is similar to authLogin, but takes
// a workspaceId and will update the redux store
// with the given workspace.
export const fetchWorkspace = (workspaceId) => {
  return apiGet([WORKSPACES_PATH, workspaceId],
    withDispatch(fetchWorkspacePending.bind(null, workspaceId)),
    (dispatch, getState, data) => {
      console.log('FETCH WORKSPACE SUCCESS', workspaceId, data)
      dispatch(fetchWorkspaceSuccess(data))
    },
    withDispatch(fetchWorkspaceError.bind(null, workspaceId)))
}

// createWorkspace is similar to fetchWorkspace, but
// creates a workspace instead of fetching one.
// On success the new workspace will be added to the
// redux store as well as be in the backend.
export const createWorkspace = (newWorkspace) => {
  return apiPost([WORKSPACES_PATH],
    withDispatch(createWorkspacePending.bind(null, newWorkspace.name)),
    (dispatch, getState, createdWorkspace) => {
      dispatch(createWorkspaceSuccess({ ...createdWorkspace, isOwner: true }))

      // NOTE: This is used to make the workspace be displayed in the list
      // otherwise a fetchmember(username) has to be used, but since we know
      // that it was successfully added, it's not needed.
      dispatch(addMemberWorkspacesState(getState().auth.username, createdWorkspace))
    },
    withDispatch(createWorkspaceError),
    { body: JSON.stringify(newWorkspace) }
  )
}

// inviteMemberWorkspace is used to invite a member given by its username
// to a workspace with the given id.
export const inviteMemberWorkspace = (workspaceId, username) => {
  return apiPost([WORKSPACES_PATH, workspaceId, 'invite', username],
    withDispatch(inviteMemberWorkspacePending.bind(null, workspaceId, username)),
    (dispatch, _, data) => {
      console.log('INVITE MEMBER TO WORKSPACE', data)
      if (data.success) dispatch(inviteMemberWorkspaceSuccess(workspaceId, username, data))
      else dispatch(inviteMemberWorkspaceError(workspaceId, username, data))
    },
    withDispatch(inviteMemberWorkspaceError.bind(null, workspaceId, username)))
}

// leaveWorkspace is used to invite a member given by its username
// to a workspace with the given id.
export const leaveWorkspace = (workspaceId) => {
  return apiPost([WORKSPACES_PATH, workspaceId, 'leave'],
    withDispatch(leaveWorkspacePending.bind(null, workspaceId)),
    (dispatch, _, data) => {
      if (data.success) dispatch(leaveWorkspaceSuccess(workspaceId, data))
      else dispatch(leaveWorkspaceError(workspaceId, data))
    },
    withDispatch(leaveWorkspaceError.bind(null, workspaceId)))
}

// removeFromWorkspace is used to remove a member given by its username
// from a workspace with the given id. Can only be done by the owner of
// the workspace. It will fail otherwise.
export const removeFromWorkspace = (workspaceId, username) => {
  return apiPost([WORKSPACES_PATH, workspaceId, 'remove'],
    withDispatch(removeFromWorkspacePending.bind(null, workspaceId, username)),
    (dispatch, _, data) => {
      if (data.success) dispatch(removeFromWorkspaceSuccess(workspaceId, username, data))
      else dispatch(removeFromWorkspaceError(workspaceId, username, data))
    },
    withDispatch(removeFromWorkspaceError.bind(null, workspaceId, username)))
}

// fetchCollection, similar to above redux-thunk functions
// will fetch a collection given its id
export const fetchCollection = (collectionId) => {
  return apiGet([COLLECTIONS_PATH, collectionId],
    withDispatch(fetchCollectionPending.bind(null, collectionId)),
    withDispatch(fetchCollectionSuccess),
    withDispatch(fetchCollectionError))
}

// createCollection, similar to above redux-thunk functions
// will create a collection given a workspace object and
// a collection name. On success it will be added to the
// redux-store.
export const createCollection = (workspace, collectionName) => {
  return apiPost([COLLECTIONS_PATH],
    withDispatch(createCollectionPending.bind(null, workspace.id, collectionName)),
    (dispatch, getState, data) => {
      dispatch(createCollectionSuccess(data))
      // update the state.member.memberByUsername[username].collections
      // dictionary to match this newly created collections. This makes it
      // such that another fetch is unnecessary.
      dispatch(addMemberCollectionsState(getState().auth.username, data))
    },
    withDispatch(createCollectionError.bind(null, workspace.id, collectionName)),
    { body: JSON.stringify({ workspace, name: collectionName }) }
  )
}

export const inviteMemberToCollection = (collectionId, username) => {
  return apiPost([COLLECTIONS_PATH, collectionId, 'invite', username],
    withDispatch(inviteMemberToCollectionPending.bind(null, collectionId, username)),
    (dispatch, getState, data) => {
      dispatch(inviteMemberToCollectionSuccess(data))
      // update the state.member.memberByUsername[username].collections
      // dictionary to match this newly created collections. This makes it
      // such that another fetch is unnecessary.
      dispatch(addMemberCollectionsState(username, data))
    },
    withDispatch(inviteMemberToCollectionError.bind(null, collectionId, username))
  )
}

// updateItemOfCollection is used to update, not create, an item
// this is used when updating updating the item state (bought, added, cancelled)
// but can be used for updating all non-readonly fields such as the quantity
export const updateItemOfCollection = (collectionId, item) => {
  return apiPatch([ITEMS_PATH, item.id],
    withDispatch(updateItemOfCollectionPending),
    withDispatch(updateItemOfCollectionSuccess.bind(null, collectionId, item)),
    withDispatch(updateItemOfCollectionError.bind(null, collectionId, item)),
    { body: JSON.stringify(item) }
  )
}

// addItemToCollection is used to add an item object to a collection.
// On success it will be updated in the redux store.
export const addItemToCollection = (collectionId, item) => {
  return apiPut([COLLECTIONS_PATH, collectionId, 'item'],
    withDispatch(addItemToCollectionPending.bind(null, collectionId, item)),
    (dispatch, getState, data) => dispatch(addItemToCollectionSuccess(collectionId, data.item)),
    withDispatch(addItemToCollectionError.bind(null, collectionId, item)),
    { body: JSON.stringify(item) }
  )
}

// fetchMember is used to fetch crucial information about a member,
// (really a user since all workspaces and collections the member belongs
// to are returned). On success it will be reflected in the redux-store.
export const fetchMember = (username) => {
  return apiGet([MEMBERS_PATH, username],
    withDispatch(fetchMemberPending),
    (dispatch, getState, data) => dispatch(fetchMemberSuccess(
      data.id, data.username, data.workspaces, data.collections, data.all_collections
    )),
    withDispatch(fetchMemberError))
}

// TODO: redux?
export const authCreateUser = (username, password) => {
  fetch(BASE_URL + 'create_user/', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then((data) => { console.log(data.json()); console.log('CREATED USER') })
}
