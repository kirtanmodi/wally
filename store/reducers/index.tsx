import { combineReducers } from "redux";
import todoSlice from "./todoSlice";

const rootReducer = combineReducers({
  todos: todoSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
