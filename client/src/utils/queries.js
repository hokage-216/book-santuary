import { gql } from '@apollo/client';

export const GET_ME = gql`
  query me {
    me {
        _id
        username
    }
  }
`;

export const SEARCH_BOOKS = gql`
  query searchBooks($query: String!) {
    searchBooks(query: $query) {
      bookId
      title
      authors
      description
      image
      link
    }
  }
`;