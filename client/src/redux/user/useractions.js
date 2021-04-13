import { UserActionTypes } from "./usertypes";

export const setCurrentUser = (user) => ({
  type: UserActionTypes.SET_CURRENT_USER,
  payload: user ? user : false,
});

export const setUserFriends = (friends) => ({
  type: UserActionTypes.SET_USER_FRIENDS,
  payload: friends ? friends : [],
});
