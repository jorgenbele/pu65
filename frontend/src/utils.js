/* global fetch:false Headers:false */

import React from 'react'

import Iconicon from './components/Iconicon'

import { ListItem, Badge } from 'react-native-elements'
import TouchableScale from 'react-native-touchable-scale'

// ...
import { BASE_URL, LOGIN_PATH, WORKSPACES_PATH } from './constants/Urls'

import {
  authLoginSuccess, authLoginPending, authLoginError,
  fetchWorkspacesSuccess, fetchWorkspacesPending, fetchWorkspacesError
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

    fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-type': 'application/json',
        ...authorizationToken(getState())
      })
    }).then(data => data.json())
      .then(jsonData => {
        console.log(jsonData)

        const data = jsonData.map(workspace => {
          return { ...workspace, isOwner: (workspace.members[workspace.owner] === getState().auth.username) }
        })
        dispatch(fetchWorkspacesSuccess(data))
      })
      .catch(error => {
        console.log(error)
        dispatch(fetchWorkspacesError(error))
      })
  }
}
