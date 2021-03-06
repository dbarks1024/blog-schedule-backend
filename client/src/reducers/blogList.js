import { BLOG_LIST_DATA, SORTED_POSTS_LIST } from '../actions/types';

const INITIAL_STATE = {
  blogListData: [],
  sortedPostsList: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case BLOG_LIST_DATA:
    return {
      ...state, 
      blogListData: action.payload
    };
  case SORTED_POSTS_LIST:
    return {
      ...state,
      sortedPostsList: action.payload
    };
  default:
    return state;
  }
};