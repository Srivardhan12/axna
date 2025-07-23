import { type Action } from 'redux';

const initialState = {};

export const reducer = (state = initialState, actions: Action) => {
  switch (actions.type) {
    default:
      return state;
  }
};
