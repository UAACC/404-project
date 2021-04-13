import { UserActionTypes } from "./usertypes";

const INITIAL_STATE = {
  currentUser: false,
  userFriends: []
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UserActionTypes.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
    case UserActionTypes.SET_USER_FRIENDS:
      return {
        ...state,
        userFriends: action.payload
      }
    default:
      return state;
  }
};

export default userReducer;
