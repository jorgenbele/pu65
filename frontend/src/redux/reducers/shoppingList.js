//import { lensPath, lensProp, view, set, over } from 'rambda';

import { SHOPPING_LIST } from "../actionTypes";

//const listsLens = lensProp('lists');
//const listLens = lensPath(['lists']);

const initialState = {
  lists: [
    { name: "Kollektivfest", workspace: "Kollektivet", index: 0, },
    { name: "Hjemmefest", workspace: null, index: 1,  },
    { name: "Jobbfest", workspace: "Jobb", index: 2, }
  ]
};

//const append = item => array => [...(array || []), item];
//const findById = id => array => array.find(item => item.id === id);

export default function(state = initialState, action) {
  switch (action.type) {

    case SHOPPING_LIST.CREATE: {
      console.log(action.payload);
      const { list } = action.payload;

      return {
        ...state,
        lists: [
          ...state.lists,
          list,       
        ]
      };
    }

    case SHOPPING_LIST.ADD_ITEM: {
      const { list, item } = action.payload;

      const newList = immutableReplaceAtIndex(state.lists[list], item.index, item)
      const newLists = immutableReplaceAtIndex(state.lists, list.index, list)

      return {
        ...state,
        lists: newLists,
      };
    }
    default:
      return state;
  }
}
