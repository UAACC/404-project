import { DomainActionTypes } from "./domain-types";

export const setCurrentDomain = (domain) => ({
  type: DomainActionTypes.SET_ALL_DOMAIN,
  payload: domain ? domain : [],
});
