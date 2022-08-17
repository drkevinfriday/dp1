const { User, Thought } = require('../models');
const { AuthenticationError } = require('apollo-server-express')
const { signToken }= require('../utils/auth')
const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
              const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
                .populate('thoughts')
                .populate('friends');
          
              return userData;
            }
          
            throw new AuthenticationError('Not logged in');
          },
        // get all thoughts by username or all thoughts
        thoughts: async (parent, { username }) => {
            const params = username ? { username } : {};
            return Thought.find(params).sort({ createdAt: -1 });
          },
        //   get single thought by id
        thought: async (parent, {_id})=>{
            return Thought.findOne({_id});
        },
        // get all users
        users: async () => {
            return User.find()
            .select('-__v -password')
            .populate('friends')
            .populate('thoughts');
        },
        // get a user by username
        user: async (parent, { username }) => {
            return User.findOne({ username })
            .select('-__v -password')
            .populate('friends')
            .populate('thoughts');
        },
        
    },
    Mutation: {
        addUser: async(parents,args)=>{
            const user = await User.create(args);
            const token = signToken(user)

            return {token, user};

        },
        login: async (parents,{email, password})=>{
            const user = await User.findOne({email});

            if (!user) {
                throw new AuthenticationError('Incorrect credentails')
            }

            const correctPW = await user.isCorrectPassword(password);
            if (!correctPW) {
                throw new AuthenticationError('Incorrect credentails')
            }


            const token = signToken(user)
            return {token, user};
        }
    }
  };


module.exports= resolvers