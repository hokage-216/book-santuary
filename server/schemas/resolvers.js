const { User } = require('../models');
const {signToken} = require('../utils/auth');
const axios = require('axios');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findById(context.user._id);
      }
      throw new Error('You must be logged in to perform this action.');
    },
    searchBooks: async (parent, { query }, context) => {
        try {
          const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
          if (response.data.items){
            return response.data.items.map(book => ({
              bookId: book.id,
              title: book.volumeInfo.title,
              authors: book.volumeInfo.authors || ['No author to display'],
              description: book.volumeInfo.description || 'No description available',
              image: book.volumeInfo.imageLinks?.thumbnail || '',
              link: book.volumeInfo.infoLink
            }));
          }
          return [];
        } catch (error) {
          console.error("Failed to fetch books:", error);
          throw new Error('Failed to fetch books.');
        }
      }
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user || !user.isCorrectPassword(password)) {
        throw new Error('No user found with this email address.');
      }

      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (parent, { authors, description, bookId, image, link, title }, context) => {
      if (context.user) {
        console.log(context.user);
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          {
            $addToSet: {
              savedBooks: { authors, description, bookId, image, link, title },
            },
          },
          { new: true }
        );
        console.log(updatedUser);
        return updatedUser;
      }
      throw new Error('You need to be logged in to save a book.');
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          {
            $pull: {
              savedBooks: { bookId: bookId },
            },
          },
          { new: true }
        );
        return updatedUser;
      }
      throw new Error('You need to be logged in to remove a book.');
    },
  },
}

module.exports = resolvers;
