import { combineReducers } from "redux";
import todoSlice from "./todoSlice";
import sipSlice from "./sipSlice";

const rootReducer = combineReducers({
  todos: todoSlice,
  sip: sipSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
