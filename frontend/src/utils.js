import React from 'react'

import { ListItem } from 'react-native-elements'
import Iconicon from './components/Iconicon'
import TouchableScale from 'react-native-touchable-scale'

// makeIcon is used to create icons 'generic' to iOS and Android
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
}

// gradientsMap is a map of the gradients used for the
// various list items that use gradients.
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

// gradiens is a list containing all the values in gradientsMap
// and is used to randomly select a gradient for the workspace and
// collection list items.
export const gradients = Object.keys(gradientsMap).map(k => gradientsMap[k])

// uniqueColor returns a predictable but seemingly random gradient given
// a title and subtitle
export const uniqueColor = (title, subtitle) => {
  const c = Math.trunc((title.charCodeAt(0) + subtitle.charCodeAt(0)) / 2)
  console.log(c)
  return gradients[c % gradients.length]
}

// makeCollectionListItem is used to create a collection list item.
// That is, the react component that represents an element in the collections.
export const makeCollectionListItem = (id, name, workspaceName, props) => {
  return (
  // FROM: https://react-native-elements.github.io/react-native-elements/docs/listitem.html
    <ListItem
      key={id}
      Component={TouchableScale}
      friction={90} //
      tension={100} // These props are passed to the parent component (here TouchableScale)
      activeScale={0.95} //
      linearGradientProps={uniqueColor(name, workspaceName)}
      leftAvatar={{ rounded: true, title: name[0] }}
      title={name}
      titleStyle={{ color: 'white', fontWeight: 'bold' }}
      subtitleStyle={{ color: 'white' }}
      chevron={{ color: 'white' }}
      {...props}
    />
  )
}

// makeCollectionItem is used to create a collection list item-item.
// These are the products and such.
export const makeCollectionItem = (item, props) => {
  return (
  // FROM: https://react-native-elements.github.io/react-native-elements/docs/listitem.html
    <ListItem
      key={item.id}
      leftAvatar={{ rounded: true, title: item.name[0] }}
      title={item.name}
      titleStyle={{ color: 'black', fontWeight: 'bold' }}
      subtitleStyle={{ color: 'white' }}
      subtitle={item.created_by}
      chevron={{ color: 'white' }}
      {...props}
    />
  )
}

// makeWorkspaceListItem is used to create a workspace list item.
export const makeWorkspaceListItem = (id, name, props) => {
  return (
    <ListItem
      key={id}
      Component={TouchableScale}
      friction={90} //
      tension={100} // These props are passed to the parent component (here TouchableScale)
      activeScale={0.95} //
      linearGradientProps={gradients[id % gradients.length]}
      leftAvatar={{ rounded: true, title: name[0] }}
      title={name}
      titleStyle={{ color: 'white', fontWeight: 'bold' }}
      subtitleStyle={{ color: 'white' }}
      subtitle={name}
      chevron={{ color: 'white' }}
      {...props}
    />
  )
}

// immutableReplaceAtIndex creates a copy of an array and replaces the
// item at the given index with given element and returns this copy
// Used mostly in redux reducers, where all actions must be immutable
export const immutableReplaceAtIndex = (array, index, element) => {
  const newArray = array.slice()
  newArray[index] = element
  return newArray
}

// sortCompareNumber takes a function getField and
// returns a comparison function that sorts by numerical value
// on the given field of the objects.
export const sortCompareNumber = (getField) => {
  return (l, r) => getField(l) > getField(r) ? 1 : (getField(r) > getField(l) ? -1 : 0)
}

// promiseDelay is used to do something async in the future
// after some delay
export const promiseDelay = (duration) => {
  return new Promise((resolve, reject) => setTimeout(() => {
    resolve()
  }, duration))
}
