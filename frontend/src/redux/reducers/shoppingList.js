// import { lensPath, lensProp, view, set, over } from 'rambda';

import { SHOPPING_LIST } from '../actionTypes'

import { immutableReplaceAtIndex } from '../../utils'

const initialState = {
  lists: [
    { name: 'Kollektivfest', workspace: 'Kollektivet', index: 0 },
    { name: 'Hjemmefest', workspace: null, index: 1 },
    { name: 'Jobbfest', workspace: 'Jobb', index: 2 }
  ]
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SHOPPING_LIST.CREATE: {
      console.log(action.payload)
      const { list } = action.payload

      return {
        ...state,
        lists: [
          ...state.lists,
          list
        ]
      }
    }

    case SHOPPING_LIST.ADD_ITEM: {
      const { list, item } = action.payload

      const newList = immutableReplaceAtIndex(state.lists[list], item.index, item)
      const newLists = immutableReplaceAtIndex(state.lists, list.index, newList)

      return {
        ...state,
        lists: newLists
      }
    }
    default:
      return state
  }
}
