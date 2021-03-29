import { DomainActionTypes } from "./domain-types";

const INITIAL_STATE = {
  domains: [],
};

const domainReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DomainActionTypes.SET_ALL_DOMAIN:
      return {
        ...state,
        domains: action.payload,
      };
    default:
      return state;
  }
};

export default domainReducer;
