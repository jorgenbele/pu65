/* global fetch:false Headers:false */

import {
  BASE_URL, LOGIN_PATH, WORKSPACES_PATH,
  COLLECTIONS_PATH, ITEMS_PATH, MEMBERS_PATH
} from './constants/Urls'

import {
  authLoginSuccess, authLoginPending, authLoginError,
  createWorkspaceSuccess, createWorkspacePending, createWorkspaceError,

  fetchWorkspaceSuccess, fetchWorkspacePending, fetchWorkspaceError,
  addMemberWorkspacesState, addMemberCollectionsState,

  fetchCollectionSuccess, fetchCollectionPending, fetchCollectionError,

  createCollectionSuccess, createCollectionPending, createCollectionError,
  addItemToCollectionSuccess, addItemToCollectionPending, addItemToCollectionError,
  updateItemOfCollectionSuccess, updateItemOfCollectionPending, updateItemOfCollectionError,

  fetchMemberSuccess, fetchMemberPending, fetchMemberError
} from './redux/actions'

// authLogin is a redux-thunk action function that will
// authenticate as a user given the username and password
// of said account. It will update the redux store, and
// must be mapped to dispatch, using mapToDispatch, or
// by calling dispatch(authLogin(username, password))
// directly
export function authLogin (username, password) {
  console.log('AUTH LOGIN')

  return (dispatch, getState) => {
    console.log('AUTH LOGIN DISPATCH')
    const url = BASE_URL + LOGIN_PATH
    const body = JSON.stringify({
      username,
      password
    })

    dispatch(authLoginPending())
    fetch(url, {
      method: 'POST',
      headers: new Headers({ 'Content-type': 'application/json' }),
      body
    }).then(data => data.json())
      .then(jsonData => {
        dispatch(authLoginSuccess(username, jsonData.token))

        // FIXME: should probably not be here, this fetches the member
        dispatch(fetchMember(username))
      })
      .catch(error => {
        dispatch(authLoginError(error))
        console.error(error)
      })
  }
}

// authorizationToken is a helper function to
// return a authrozation token used in requests
// to backend that requires authorization
// (for example all user actions)
export const authorizationToken = (state) => {
  return { Authorization: 'Token ' + state.auth.token }
}

// fetchWorkspace is similar to authLogin, but takes
// a workspaceId and will update the redux store
// with the given workspace.
export const fetchWorkspace = (workspaceId) => {
  return (dispatch, getState) => {
    dispatch(fetchWorkspacePending(workspaceId))

    const url = BASE_URL + WORKSPACES_PATH + workspaceId

    return fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-type': 'application/json',
        ...authorizationToken(getState())
      })
    }).then(data => data.json())
      .then(jsonData => {
        const data = jsonData.map(workspace => {
          return {
            ...workspace,
            isOwner: (workspace.members[workspace.owner] === getState().auth.username)
          }
        })
        dispatch(fetchWorkspaceSuccess(data))
      })
      .catch(error => {
        console.log(error)
        dispatch(fetchWorkspaceError(workspaceId, error))
      })
  }
}

// createWorkspace is similar to fetchWorkspace, but
// creates a workspace instead of fetching one.
// On success the new workspace will be added to the
// redux store as well as be in the backend.
export const createWorkspace = (newWorkspace) => {
  return (dispatch, getState) => {
    dispatch(createWorkspacePending(newWorkspace.name))

    const url = BASE_URL + WORKSPACES_PATH
    console.log(url)

    return fetch(url, {
      method: 'POST',
      headers: new Headers({
        'Content-type': 'application/json',
        ...authorizationToken(getState())
      }),
      body: JSON.stringify(newWorkspace)
    }).then(data => data.json())
      .then(jsonData => {
        const createdWorkspace = { ...jsonData, isOwner: true }
        dispatch(createWorkspaceSuccess(createdWorkspace))

        // NOTE: This is used to make the workspace be displayed in the list
        // otherwise a fetchmember(username) has to be used, but since we know
        // that it was successfully added, it's not needed.
        dispatch(addMemberWorkspacesState(getState().auth.username, createdWorkspace))
      })
      .catch(error => {
        console.log(error)
        dispatch(createWorkspaceError(newWorkspace, error))
      })
  }
}

// fetchCollection, similar to above redux-thunk functions
// will fetch a collection given its id
export const fetchCollection = (collectionId) => {
  return (dispatch, getState) => {
    dispatch(fetchCollectionPending(collectionId))

    const url = BASE_URL + COLLECTIONS_PATH + collectionId
    console.log(url)

    return fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-type': 'application/json',
        ...authorizationToken(getState())
      })
    }).then(data => data.json())
      .then(jsonData => {
        dispatch(fetchCollectionSuccess(jsonData))
      })
      .catch(error => {
        console.log(error)
        dispatch(fetchCollectionError(error))
      })
  }
}

// createCollection, similar to above redux-thunk functions
// will create a collection given a workspace object and
// a collection name. On success it will be added to the
// redux-store.
export const createCollection = (workspace, collectionName) => {
  return (dispatch, getState) => {
    dispatch(createCollectionPending(workspace.id, collectionName))
    console.log('Creating collection ' + workspace.id + ' , ' + collectionName)

    const url = BASE_URL + COLLECTIONS_PATH

    return fetch(url, {
      method: 'POST',
      headers: new Headers({
        'Content-type': 'application/json',
        ...authorizationToken(getState())
      }),
      body: JSON.stringify({ workspace, name: collectionName })

    }).then(data => data.json())
      .then(jsonData => {
        dispatch(createCollectionSuccess(jsonData))
        // update the state.member.memberByUsername[username].collections
        // dictionary to match this newly created collections. This makes it
        // such that another fetch is unnecessary.
        dispatch(addMemberCollectionsState(getState().auth.username, jsonData))
      })
      .catch(error => {
        dispatch(createCollectionError(workspace.id, collectionName, error))
      })
  }
}

// updateItemOfCollection is used to update, not create, an item
// this is used when updating updating the item state (bought, added, cancelled)
// but can be used for updating all non-readonly fields such as the quantity
export const updateItemOfCollection = (collectionId, item) => {
  return (dispatch, getState) => {
    dispatch(updateItemOfCollectionPending)

    const url = BASE_URL + ITEMS_PATH + item.id + '/'

    return fetch(url, {
      method: 'PATCH',
      headers: new Headers({
        'Content-type': 'application/json',
        ...authorizationToken(getState())
      }),
      body: JSON.stringify(item)
    }).then(data => data.json())
      .then(jsonData => {
        dispatch(updateItemOfCollectionSuccess(collectionId, item))
      })
      .catch(error => {
        console.log(error)
        dispatch(updateItemOfCollectionError(collectionId, item, error))
      })
  }
}

// addItemToCollection is used to add an item object to a collection.
// On success it will be updated in the redux store.
export const addItemToCollection = (collectionId, item) => {
  return (dispatch, getState) => {
    dispatch(addItemToCollectionPending(collectionId, item))

    const url = BASE_URL + COLLECTIONS_PATH + collectionId + '/item/'

    return fetch(url, {
      method: 'PUT',
      headers: new Headers({
        'Content-type': 'application/json',
        ...authorizationToken(getState())
      }),
      body: JSON.stringify(item)
    }).then(data => data.json())
      .then(jsonData => {
        dispatch(addItemToCollectionSuccess(collectionId, jsonData.item))
      })
      .catch(error => {
        console.log(error)
        dispatch(addItemToCollectionError(collectionId, item, error))
      })
  }
}

// fetchMember is used to fetch crucial information about a member,
// (really a user since all workspaces and collections the member belongs
// to are returned). On success it will be reflected in the redux-store.
export const fetchMember = (username) => {
  return (dispatch, getState) => {
    dispatch(fetchMemberPending())

    const url = BASE_URL + MEMBERS_PATH + username + '/'

    return fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-type': 'application/json',
        ...authorizationToken(getState())
      })
    }).then(data => data.json())
      .then(jsonData => {
        dispatch(fetchMemberSuccess(jsonData.id, jsonData.username,
          jsonData.workspaces, jsonData.collections))
      })
      .catch(error => {
        console.log(error)
        dispatch(fetchMemberError(error))
      })
  }
}
