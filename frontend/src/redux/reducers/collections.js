import { COLLECTION } from '../actionTypes'
import { immutableReplaceAtIndex } from '../../utils'

// TODO: update to match database
const initialState = {
  fetchPendingIds: new Set(),
  createPending: new Set(), // set of pairs (workspaceId, collectionName)
  invitePending: new Set(), // set of pairs (collectionId, username)
  error: null,

  collectionsById: {}
}

export default function (state = initialState, action) {
  switch (action.type) {
    case COLLECTION.UPDATE_ITEM_PENDING: {
      return state
    }

    case COLLECTION.UPDATE_ITEM_SUCCESS: {
      const { collectionId, item } = action.payload

      // TODO: make functional (programming, not as in working or not)
      let index = 0
      for (let i = 0; i < state.collectionsById[collectionId].items.length; i++) {
        if (state.collectionsById[collectionId].items[i].id === item.id) {
          index = i
          break
        }
      }

      const newItems = immutableReplaceAtIndex(
        state.collectionsById[collectionId].items,
        index,
        item
      )

      return {
        ...state,
        collectionsById: {
          ...state.collectionsById,
          [collectionId]: {
            ...state.collectionsById[collectionId],
            items: newItems
          }
        }
      }
    }

    case COLLECTION.UPDATE_ITEM_ERROR: {
      const { error } = action.payload
      return { ...state, error }
    }

    case COLLECTION.ADD_ITEM_PENDING: {
      const { collectionId, item } = action.payload
      const fetchPendingIds = new Set(state.fetchPendingIds)
      fetchPendingIds.add({ item, collectionId })
      return {
        ...state,
        fetchPendingIds
      }
    }

    // TODO
    case COLLECTION.ADD_ITEM_SUCCESS: {
      const { collectionId, item } = action.payload
      return {
        ...state,
        collectionsById: {
          ...state.collectionsById,
          [collectionId]: {
            ...state.collectionsById[collectionId],
            items: [...state.collectionsById[collectionId].items, item]
          }
        }
      }
    }

    case COLLECTION.ADD_ITEM_ERROR: {
      const { collectionId, item, error } = action.payload
      const fetchPendingIds = new Set(state.fetchPendingIds)
      fetchPendingIds.delete({ item, collectionId })
      return {
        ...state,
        error,
        fetchPendingIds
      }
    }

    // Fetch single
    case COLLECTION.FETCH_PENDING: {
      const { collectionId } = action.payload
      // FIXME: use immutable structure instead
      const fetchPendingIds = new Set(state.fetchPendingIds)
      fetchPendingIds.add(collectionId)
      return { ...state, fetchPendingIds }
    }

    case COLLECTION.FETCH_SUCCESS: {
      console.log(action.payload)
      const { collection } = action.payload
      const fetchPendingIds = new Set(state.fetchPendingIds)
      fetchPendingIds.delete(collection.id)
      return {
        ...state,
        fetchPendingIds,
        collectionsById: {
          ...state.collectionsById,
          [collection.id]: collection
        }
      }
    }

    case COLLECTION.FETCH_ERROR: {
      const { collectionId, error } = action.payload
      const fetchPendingIds = new Set(state.fetchPendingIds)
      fetchPendingIds.delete(collectionId)
      return { ...state, error, fetchPendingIds }
    }

    case COLLECTION.CREATE_PENDING: {
      const { workspaceId, collectionName } = action.payload
      const createPending = new Set(state.createPending)
      createPending.add([workspaceId, collectionName])
      return { ...state, createPending }
    }

    case COLLECTION.CREATE_SUCCESS: {
      const { collection } = action.payload
      const createPending = new Set(state.createPending)
      createPending.add([collection.workspace.id, collection.name])
      return {
        ...state,
        createPending,
        collectionsById: {
          ...state.collectionsById,
          [collection.id]: collection
        }
      }
    }

    case COLLECTION.CREATE_ERROR: {
      const { workspaceId, collectionName, error } = action.payload
      const createPending = new Set(state.createPending)
      createPending.delete([workspaceId, collectionName])
      return { ...state, error, createPending }
    }

    case COLLECTION.INVITE_MEMBER_TO_COLLECTION_PENDING: {
      const { collectionId, username } = action.payload
      const invitePending = new Set(state.invitePending)
      invitePending.add([collectionId, username])
      return { ...state, invitePending }
    }

    case COLLECTION.INVITE_MEMBER_TO_COLLECTION_SUCCESS: {
      const { collectionId, username } = action.payload
      const invitePending = new Set(state.invitePending)
      invitePending.delete([collectionId, username])
      return { ...state, invitePending }
    }

    case COLLECTION.INVITE_MEMBER_TO_COLLECTION_ERROR: {
      const { collectionId, username, inviteError } = action.payload
      const invitePending = new Set(state.invitePending)
      invitePending.delete([collectionId, username])
      return { ...state, invitePending, inviteError }
    }

    default:
      return state
  }
}
