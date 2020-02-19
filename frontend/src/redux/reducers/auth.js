
import { AUTH } from "../actionTypes";

const initialState = {
  username: null,
  token: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case AUTH.LOG_IN: {
      console.log(action.payload);
      const { username, password } = action.payload;

      return {
        username: username,
        token: response.token,
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
