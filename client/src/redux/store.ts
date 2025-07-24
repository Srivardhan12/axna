import { legacy_createStore as createstore } from "redux"
import { reducer } from "./reducer"
import { applyMiddleware } from "redux"
import { thunk } from "redux-thunk"
import { compose } from "redux"
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"

const config = {
    key: "redux",
    storage
}

const persists = persistReducer(config, reducer)
// @ts-expect-error cant find the solution to this error
const composer = compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

export const store = createstore(persists, composer)
export const persistReduce = persistStore(store)