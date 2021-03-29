import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./user/userreducer";
import domainReducer from "./domain/domain-reducer";

const persistConfig = {
  key: "root", // from root
  storage,
  whitelist: ["user", "domainReducer"], // which reducer to persist
};

const rootReducer = combineReducers({
  user: userReducer,
  domain: domainReducer
});

export default persistReducer(persistConfig, rootReducer);
