/* global fetch:false Headers:false */

import React from 'react'

import Iconicon from './components/Iconicon'

import { ListItem, Badge } from 'react-native-elements'
import TouchableScale from 'react-native-touchable-scale'

// ...
import { BASE_URL, LOGIN_PATH, WORKSPACES_PATH, COLLECTIONS_PATH } from './constants/Urls'

import {
  authLoginSuccess, authLoginPending, authLoginError,
  createWorkspacesSuccess, createWorkspacesPending, createWorkspacesError,
  fetchWorkspacesSuccess, fetchWorkspacesPending, fetchWorkspacesError,
  fetchCollectionsSuccess, fetchCollectionsPending, fetchCollectionsError,
  createCollectionSuccess, createCollectionPending, createCollectionError,
  addItemToCollectionSuccess, /* addItemToCollectionPending, */ addItemToCollectionError,

  removeItem
} from './redux/actions'

export const makeIcon = (name, focused) => {
  return (
    <Iconicon
      focused={focused}
      name={
        Platform.OS === 'ios' // eslint-disable-line
          ? `ios-${name}${focused ? '' : '-outline'}`
          : `md-${name}`
      }
    />
  )
} // https://github.com/kohver/react-native-touchable-scale
// import LinearGradient from 'react-native-linear-gradient'; // Only if no expo

export const gradientsMap = {
  redOrange: {
    colors: ['#FF9800', '#F44336'],
    start: [1, 0],
    end: [0.2, 0]
  },
  blue: {
    colors: ['#1A6DC4', '#10334B'],
    start: [1, 0],
    end: [0.2, 0]
  },
  green: {
    colors: ['#4CA856', '#235230'],
    start: [1, 0],
    end: [0.2, 0]
  },
  purple: {
    colors: ['#A934C5', '#4B059F'],
    start: [1, 0],
    end: [0.2, 0]
  }
}

export const gradients = Object.keys(gradientsMap).map(k => gradientsMap[k])

export const uniqueColor = (title, subtitle) => {
  const c = Math.trunc((title.charCodeAt(0) + subtitle.charCodeAt(0)) / 2)
  console.log(c)
  return gradients[c % gradients.length]
}

export const makeListItem = (title, subtitle) => (
  // FROM: https://react-native-elements.github.io/react-native-elements/docs/listitem.html
  <ListItem
    key={title + subtitle} // FIXME: make unique
    Component={TouchableScale}
    friction={90} //
    tension={100} // These props are passed to the parent component (here TouchableScale)
    activeScale={0.95} //
    linearGradientProps={uniqueColor(title, subtitle)}
    // ViewComponent={LinearGradient} // Only if no expo
    leftAvatar={{ rounded: true, title: title[0] }}
    title={title}
    titleStyle={{ color: 'white', fontWeight: 'bold' }}
    subtitleStyle={{ color: 'white' }}
    subtitle={subtitle}
    chevron={{ color: 'white' }}
  />
)

export const makeCollectionListItem = (collection, props) => {
  return (
  // FROM: https://react-native-elements.github.io/react-native-elements/docs/listitem.html
    <ListItem
      key={collection.name + collection.workspace.id} // FIXME: make unique
      Component={TouchableScale}
      friction={90} //
      tension={100} // These props are passed to the parent component (here TouchableScale)
      activeScale={0.95} //
      linearGradientProps={uniqueColor(collection.name, collection.workspace.name)}
      // ViewComponent={LinearGradient} // Only if no expo
      leftAvatar={{ rounded: true, title: collection.name[0] }}
      title={collection.name}
      titleStyle={{ color: 'white', fontWeight: 'bold' }}
      subtitleStyle={{ color: 'white' }}
      subtitle={collection.workspace.name}
      chevron={{ color: 'white' }}
      {...props}
    />
  )
}

export const makeCollectionItem = (item, props) => {
  return (
  // FROM: https://react-native-elements.github.io/react-native-elements/docs/listitem.html
    <ListItem
      key={item.name} // FIXME: make unique
      Component={TouchableScale}
      friction={90} //
      tension={100} // These props are passed to the parent component (here TouchableScale)
      activeScale={0.95} //
      linearGradientProps={uniqueColor(item.name, item.name)}
      // ViewComponent={LinearGradient} // Only if no expo
      leftAvatar={{ rounded: true, title: item.name[0] }}
      title={item.name}
      titleStyle={{ color: 'white', fontWeight: 'bold' }}
      subtitleStyle={{ color: 'white' }}
      subtitle={item.created_by}
      chevron={{ color: 'white' }}
      {...props}
    />
  )
}

export const makeWorkspaceListItem = workspace => {
  // Example of withBadge: shows the number of members in the workspace in the icon
  // const BadgedAvatar = withBadge(workspace.members.length.toString(), {right: -3, status: 'primary'})(Avatar);
  // const workspaceAvatar = <BadgedAvatar rounded={true} title={workspace.name[0]} />;

  return (
    // FROM: https://react-native-elements.github.io/react-native-elements/docs/listitem.html
    <ListItem
      key={workspace.id} // FIXME: make unique
      Component={TouchableScale}
      friction={90} //
      tension={100} // These props are passed to the parent component (here TouchableScale)
      activeScale={0.95} //
      linearGradientProps={gradients[workspace.id % gradients.length]}
      // ViewComponent={LinearGradient} // Only if no expo

      // Uncomment leftElement line to display number of members in icon
      // leftElement={workspaceAvatar}
      leftAvatar={{ rounded: true, title: workspace.name[0] }}
      title={workspace.name}
      titleStyle={{ color: 'white', fontWeight: 'bold' }}
      subtitleStyle={{ color: 'white' }}
      subtitle={workspace.name}
      rightElement={<Badge value={workspace.collections.length} />}
      chevron={{ color: 'white' }}
    />
  )
}

export const showMessage = msg => { }

export const objectMap = (obj, fn) =>
  Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]))
export const objectFilter = (obj, fn) =>
  Object.fromEntries(
    Object.entries(obj).filter(([k, v], i) => [k, fn(v, k, i)])
  )

export const immutableReplaceAtIndex = (array, index, element) => {
  const newArray = array.slice()
  newArray[index] = element
  return newArray
}

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
      })
      .catch(error => {
        dispatch(authLoginError(error))
        console.error(error)
      })
  }
}

export const authorizationToken = (state) => {
  return { Authorization: 'Token ' + state.auth.token }
}

export const fetchWorkspaces = () => {
  return (dispatch, getState) => {
    dispatch(fetchWorkspacesPending())

    const url = BASE_URL + WORKSPACES_PATH

    return fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-type': 'application/json',
        ...authorizationToken(getState())
      })
    }).then(data => data.json())
      .then(jsonData => {
        console.log(jsonData)

        // const data = jsonData.map(workspace => {
        //   return { ...workspace, isOwner: (workspace.members[workspace.owner] === getState().auth.username) }
        // })
        const data = jsonData.map(workspace => {
          return { ...workspace, isOwner: true }
        })
        dispatch(fetchWorkspacesSuccess(data))
      })
      .catch(error => {
        console.log(error)
        dispatch(fetchWorkspacesError(error))
      })
  }
}

export const createWorkspace = (newWorkspace) => {
  return (dispatch, getState) => {
    dispatch(createWorkspacesPending(newWorkspace))

    const url = BASE_URL + WORKSPACES_PATH
    console.log(url)

    const auth = authorizationToken(getState())
    console.log('auth token: ')
    console.log(auth)

    return fetch(url, {
      method: 'POST',
      headers: new Headers({
        'Content-type': 'application/json',
        ...authorizationToken(getState())
      }),
      body: JSON.stringify(newWorkspace)
    }).then(data => data.json())
      .then(jsonData => {
        console.log('CREATED WORKSPACE!!!!§')
        console.log(jsonData)

        const createdWorkspace = { ...jsonData, isOwner: true }
        dispatch(createWorkspacesSuccess(createdWorkspace))
        dispatch(fetchWorkspaces())
      })
      .catch(error => {
        console.log(error)
        dispatch(createWorkspacesError(newWorkspace, error))
      })
  }
}

export const fetchCollections = () => {
  return (dispatch, getState) => {
    dispatch(fetchCollectionsPending())

    const url = BASE_URL + COLLECTIONS_PATH

    console.log('FETCH COLLECTIONS TOKEN')
    console.log(authorizationToken(getState()))

    return fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-type': 'application/json',
        ...authorizationToken(getState())
      })
    }).then(data => data.json())
      .then(jsonData => {
        console.log(jsonData)
        dispatch(fetchCollectionsSuccess(jsonData))
      })
      .catch(error => {
        console.log(error)
        dispatch(fetchCollectionsError(error))
      })
  }
}

export const createCollection = (workspaceId, collectionName) => {
  return (dispatch, getState) => {
    dispatch(createCollectionPending(workspaceId, collectionName))
    console.log('Creating collection ' + workspaceId + ' , ' + collectionName)

    const url = BASE_URL + COLLECTIONS_PATH

    return fetch(url, {
      method: 'POST',
      headers: new Headers({
        'Content-type': 'application/json',
        ...authorizationToken(getState())
      }),
      body: JSON.stringify({ workspaceId, name: collectionName })

    }).then(data => data.json())
      .then(jsonData => {
        if (jsonData.detail) {
          console.log('ERROR CREATE')
          console.log(jsonData)
          dispatch(createCollectionError(workspaceId, collectionName, jsonData))
        } else {
          console.log('SUCCESS CREATE')
          console.log(jsonData)
          dispatch(createCollectionSuccess(jsonData))
        }
      })
      .catch(error => {
        console.log('ERROR CREATE')
        console.log(error)
        dispatch(createCollectionError(workspaceId, collectionName, error))
      })
  }
}

//  export const fetchCollection = (collectionId) => {
//    return (dispatch, getState) => {
//      dispatch(fetchCollectionPending(collectionId))
//
//      const url = BASE_URL + COLLECTIONS_PATH
//
//      return fetch(url, {
//        method: 'GET',
//        headers: new Headers({
//          'Content-type': 'application/json',
//          ...authorizationToken(getState())
//        })
//      }).then(data => data.json())
//        .then(jsonData => {
//          console.log(jsonData)
//          dispatch(fetchCollectionSuccess(jsonData))
//        })
//        .catch(error => {
//          console.log(error)
//          dispatch(fetchCollectionError(collectionId, error))
//        })
//    }
//  }

export const updateItemState = (collectionId, item) => {
  return (dispatch, getState) => {
    console.log('updateItemState')
    // dispatch(addItemToCollectionPending(collectionId))

    const url = BASE_URL + COLLECTIONS_PATH + collectionId + '/item/'
    console.log(url)

    console.log(authorizationToken(getState()))

    return fetch(url, {
      method: 'PUT',
      headers: new Headers({
        'Content-type': 'application/json',
        ...authorizationToken(getState())
      }),
      body: JSON.stringify(item)
    }).then(data => data.json())
      .then(jsonData => {
        console.log('ADDED ITEM')
        console.log(jsonData)
        dispatch(addItemToCollectionSuccess(collectionId, item))
      })
      .catch(error => {
        console.log('ADDEERROR')
        console.log(error)
        dispatch(addItemToCollectionError(collectionId, item, error))
      })
  }
}

export const addItemToCollection = (collectionId, item) => {
  return (dispatch, getState) => {
    console.log('addItemToCollection')
    // dispatch(addItemToCollectionPending(collectionId))

    const url = BASE_URL + COLLECTIONS_PATH + collectionId + '/item/'
    console.log(url)

    console.log(authorizationToken(getState()))

    return fetch(url, {
      method: 'PUT',
      headers: new Headers({
        'Content-type': 'application/json',
        ...authorizationToken(getState())
      }),
      body: JSON.stringify(item)
    }).then(data => data.json())
      .then(jsonData => {
        console.log('ADDED ITEM')
        console.log(jsonData)
        dispatch(addItemToCollectionSuccess(collectionId, item))
        dispatch(fetchCollections())
      })
      .catch(error => {
        console.log('ADDEERROR')
        console.log(error)
        dispatch(addItemToCollectionError(collectionId, item, error))
      })
  }
}

export const removeItemFromCollection = (collectionId, item) => {
  return (dispatch, getState) => {
    console.log('remove item from collection')
    dispatch(removeItem(collectionId, item))
  }
}
