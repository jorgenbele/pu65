//import { lensPath, lensProp, view, set, over } from 'rambda';

import { WORKSPACE } from "../actionTypes";

//const listsLens = lensProp('lists');
//const listLens = lensPath(['lists']);

const initialState = [
  {
    name: "Kollektivet",
    isOwner: true,
    members: ["jbr"],
    lists: ["Kollektivfest"],
    index: 0
  },
  {
    name: "Hjemme",
    isOwner: false,
    members: ["jbr"],
    lists: ["Hjemmefest"],
    index: 1
  },
  {
    name: "Jobb",
    isOwner: false,
    members: ["jbr"],
    lists: ["Jobbfest"],
    index: 2
  }
];

//const append = item => array => [...(array || []), item];
//const findById = id => array => array.find(item => item.id === id);

const immutableReplaceAtIndex = (array, index, element) => {
  const newArray = array.slice();
  newArray[index] = element;
  return newArray;
};

export default function(state = initialState, action) {
  switch (action.type) {
    case WORKSPACE.CREATE: {
      //console.log('action.payload');
      //console.log(action.payload);
      const { name } = action.payload;

      return [
        ...state,
        { 
          name,
          isOwner: true,
          members: ["jbr"],
          lists: [],
          index:  1 + state.reduce( (l, r) => (l.index > r.index ? l.index : r.index), 0),
        }
      ];
    }
    default:
      return state;
  }
}
