import { WORKSPACE } from '../actionTypes'

const initialState = [
  {
    name: 'Kollektivet',
    isOwner: true,
    members: ['jbr'],
    lists: ['Kollektivfest'],
    index: 0
  },
  {
    name: 'Hjemme',
    isOwner: false,
    members: ['jbr'],
    lists: ['Hjemmefest'],
    index: 1
  },
  {
    name: 'Jobb',
    isOwner: false,
    members: ['jbr'],
    lists: ['Jobbfest'],
    index: 2
  }
]

export default function (state = initialState, action) {
  switch (action.type) {
    case WORKSPACE.CREATE: {
      // console.log('action.payload');
      // console.log(action.payload);
      const { name } = action.payload

      return [
        ...state,
        {
          name,
          isOwner: true,
          members: ['jbr'],
          lists: [],
          index: 1 + state.reduce((l, r) => (l.index > r.index ? l.index : r.index), 0)
        }
      ]
    }
    default:
      return state
  }
}
