import { createAction, createFeatureSelector, createReducer, createSelector, on, props } from '@ngrx/store';

export const DB_KEY = 'DATA_BASE';

export interface DBState {
    count: number;
    updatedAt?: number;
}

/** ACTIONS */
export const add = createAction('[DATA_BASE] add');
export const remove = createAction('[DATA_BASE] remove');
export const update = createAction('[DATA_BASE] update');

export const initialState: DBState = {
    count: 0
};

/** REDUCERS */
export const dbReducer = createReducer(
    initialState,
    on(add, state => ({
        ...state,
        count: state.count + 1
    })),
    on(remove, state => ({
        ...state,
        count: state.count - 1
    })),
    on(update, state => ({
        ...state,
        count: 0
    }))
);
/** SELECTORS */
export const featureSelector
    = createFeatureSelector<DBState>(DB_KEY);
export const countSelector = createSelector(
    featureSelector,
    state => state.count
);
export const updatedAtSelector = createSelector(
    featureSelector,
    state => state.updatedAt
);
