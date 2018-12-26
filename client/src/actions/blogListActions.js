import moment from 'moment';
import _ from 'lodash';
import { BLOG_LIST_DATA, SORTED_POSTS_LIST } from './types';
import { DATE_DESC, DATE_ASC, CATEGORY_ASC, CATEGORY_DESC, STATUS } from '../components/consts'; 

export const sortPostsList = () => {
  return (dispatch, getState) => {
    let sortedList = [];
    const sortBy = getState().postReducer.sortBy;
    const posts = getState().postReducer.posts;

    switch (sortBy) {
    case DATE_DESC:
      sortedList = _.orderBy(posts, ['date'], ['desc'] );
      break;
    case DATE_ASC:
      sortedList = _.orderBy(posts, ['date'], ['asc'] );
      break;
    case CATEGORY_DESC:
      sortedList = _.orderBy(posts, ['category'], ['desc']);
      break;
    case CATEGORY_ASC:
      sortedList = _.orderBy(posts, ['category'], ['asc']);
      console.log(sortedList);
      break;
    case STATUS:
      sortedList = _.orderBy(posts, ['status'], ['asc']);
      break;
    default:
      sortedList = _.orderBy(posts, ['date'], ['asc']);
      console.log('default sort');
      break;
    }

    dispatch({
      type: SORTED_POSTS_LIST,
      payload: sortedList,
    });
    dispatch(createBlogListData());
  };
};

export const createBlogListData = () => {
  return (dispatch, getState) => {
    const sortedList = getState().blogListReducer.sortedPostsList;

    let listData = getState().postReducer.dateRange.map((date) =>{
      const firstDate = moment(date, 'MM/DD/YYYY').subtract(1, 'day');
      const endDate = moment(date, 'MM/DD/YYYY').add(7, 'day');
      const data = _.filter(sortedList, (item) => (
        moment(item.date,).isBetween(firstDate, endDate)
      ))
        .map((item) => {
          return item;
        });   
      return {[date]: data};
    });

    if(getState().postReducer.sortBy === 'date-desc') {
      listData = listData.reverse();
    }
    console.log(listData);
    dispatch({
      type: BLOG_LIST_DATA,
      payload: listData
    });
  };
};

export const updatePostDate = (data) => {
  return () => {
    fetch(`/api/post/${data._id}`, {
      method: 'PUT',
      mode: 'cors', 
      'async': true,
      'crossDomain': true,
      cache: 'no-cache', 
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }, 
      body: JSON.stringify(data), 
    })
      .then(response => console.log(response))
      .catch((err) => {
        console.log(err);
      });
  };
};

export const moveBlogListData = (destination, source, ) => {
  return (dispatch, getState) => {
    let blogListData = getState().blogListReducer.blogListData;
    const sourceSectionIndex = _.findIndex(blogListData, (post) => {return Object.keys(post)[0] === source.droppableId; });
    const sourceSection = blogListData[sourceSectionIndex][source.droppableId];
    const blogToMove = _.pullAt(sourceSection, source.index)[0];
    const destinationSectionIndex = _.findIndex(blogListData, (post) => {return Object.keys(post)[0] === destination.droppableId; });
    //remove from source
    blogListData[sourceSectionIndex][source.droppableId].splice(source.index, 1);

    //changeDate 
    blogToMove.date = moment(destination.droppableId, 'MM/DD/YYYY').format('YYYY-MM-DD');
    console.log(blogToMove);

    //send blog to update
    dispatch(updatePostDate(blogToMove));

    // add to destination
    blogListData[destinationSectionIndex][destination.droppableId].splice(destination.index, 0, blogToMove);
    dispatch({
      type: BLOG_LIST_DATA,
      payload: blogListData
    });
  };
};
