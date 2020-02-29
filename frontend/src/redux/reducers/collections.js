import { COLLECTION } from '../actionTypes'

import { STATE_ADDED, STATE_BOUGHT } from '../../constants/ItemStates'
import { FETCH_ALL, FETCH_NONE, FETCH_NEVER } from '../../constants/FetchStates'
import { immutableReplaceAtIndex } from '../../utils'

const initialState = {
  fetchState: FETCH_NEVER,
  createPending: [],
  error: null,

  collections: [
    {
      id: 1,
      workspace: {
        id: 2,
        name: 'Kollektivet'
      },
      created_by: 'jbr',
      name: 'Kollektivfest',
      items: [
        {
          id: 1,
          name: 'testitem',
          added_by: 'jbr',
          quantity: 10,
          state: STATE_ADDED,
          bought_by: null
        }
      ]
    }
  ]
}

const updateCollectionItemState = (state, collectionId, item) => {
  let collectionIndex = null
  let newItems = null
  for (let i = 0; i < state.collections.length; i++) {
    if (state.collections[i].id === collectionId) {
      console.log('found collectoin at index ' + i)
      collectionIndex = i

      for (let j = 0; j < state.collections[collectionIndex]; j++) {
        if (state.collections[collectionIndex].items[j] === item.id) {
          newItems = immutableReplaceAtIndex(state.collections[i].items, j, item)
        }
      }
      break
    }
  }

  const newCollection = {
    ...state.collections[collectionIndex],
    items: newItems
  }

  return {
    ...state,
    collections: immutableReplaceAtIndex(state.collections, collectionIndex, newCollection)
  }
}

export default function (state = initialState, action) {
  switch (action.type) {
    case COLLECTION.REMOVE_ITEM: {
      console.log('REMOVE ITEM')
      const { collectionId, item } = action.payload

      return updateCollectionItemState(state, collectionId, { ...item, state: STATE_BOUGHT })
    }

    case COLLECTION.UPDATE_ITEM_PENDING: {
      return state
    }

    case COLLECTION.UPDATE_ITEM_SUCCESS: {
      const { collectionId, item } = action.payload
      return updateCollectionItemState(collectionId, { ...item })
    }

    // TODO
    case COLLECTION.UPDATE_ITEM_ERROR: {
      // const { error } = action.payload
      return state
    }

    // TODO FIX
    case COLLECTION.ADD_ITEM_PENDING: {
      // console.log('ADD_ITEM_PENDING')
      // console.log(action.payload)
      // const { collectionId, item } = action.payload
      // return { ...state, addPending: [...state.addPending, { collectionId, item }] }
      return { ...state }
    }

    // TODO
    case COLLECTION.ADD_ITEM_SUCCESS: {
      return { ...state }
    }

    case COLLECTION.ADD_ITEM_ERROR: {
      console.log(action.payload.error)
      return state
    }

    // TODO FFIX SOME STUFF
    case COLLECTION.FETCH_ALL_PENDING: {
      return { ...state, fetchState: FETCH_ALL }
    }

    case COLLECTION.FETCH_ALL_SUCCESS: {
      console.log(action.payload)
      const { collections } = action.payload
      return { ...state, fetchState: FETCH_NONE, collections }
    }

    case COLLECTION.FETCH_ALL_ERROR: {
      const { error } = action
      return { ...state, fetchState: FETCH_NONE, error }
    }

    case COLLECTION.CREATE_PENDING: {
      return { ...state, fetchState: FETCH_ALL }
    }

    case COLLECTION.CREATE_SUCCESS: {
      const { collection } = action.payload
      console.log('CREATE SUCCESS')
      console.log(collection)
      return { ...state, collections: [state.collections, collection] }
    }

    case COLLECTION.CREATE_ERROR: {
      const { error } = action
      return { ...state, error }
    }

    default:
      return state
  }
}
