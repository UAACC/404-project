import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./user/userreducer";

const persistConfig = {
  key: "root", // from root
  storage,
  whitelist: ["user"], // which reducer to persist
};

const rootReducer = combineReducers({
  user: userReducer,
});

export default persistReducer(persistConfig, rootReducer);
