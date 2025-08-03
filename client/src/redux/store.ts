import { legacy_createStore as createStore, applyMiddleware, compose } from "redux";
import { reducer } from "./reducer";
import { thunk } from "redux-thunk";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__?: typeof compose;
    }
}


const config = {
    key: "redux",
    storage,
};

// @ts-expect-error cant understand the error
const persists = persistReducer(config, reducer);

// TypeScript safe Redux DevTools + Thunk
const composer =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
    persists,
    composer(applyMiddleware(thunk))
);

export const persistReduce = persistStore(store);
