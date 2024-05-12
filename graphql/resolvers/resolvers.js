import databaseModel from "../../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const { User, Post } = databaseModel;

const resolvers = {
  User: {
    async posts(user) {
      return user.getPosts();
    },
  },
  Post: {
    async user(post) {
      return post.getUser();
    },
  },
  Query: {
    oneUser(root, { id }, contextValue, info) {
      return User.findOne({
        where: { id: id },
      })
        .then((user) => {
          return user;
        })
        .catch((error) => error);
    },
    allUser(root, args, contextValue, info) {
      // console.log("context", context.models.User);
      return User.findAll()
        .then((user) => {
          return user;
        })
        .catch((error) => error);
    },
    allPosts(root, args, contextValue, info) {
      return Post.findAll()
        .then((posts) => {
          return posts;
        })
        .catch((error) => error);
    },
    onePost(root, { id }, contextValue, info) {
      return Post.findOne({
        where: { id: id },
      })
        .then((post) => {
          return post;
        })
        .catch((error) => error);
    },
    manyPost(root, { id }, contextValue, info) {
      return User.findOne({
        where: { id: id },
        include: [{ model: Post }],
      })
        .then((post) => {
          return post;
        })
        .catch((error) => error);
    },
  },
  Mutation: {
    async createUser(root, args, contextValue, info) {
      try {
        // console.log("context", contextValue);
        // if (!contextValue.userAuthentication.userId) {
        //   return {
        //     code: 401,
        //     status: false,
        //     ack: 0,
        //     message: contextValue.userAuthentication.message,
        //   };
        // }

        if (args.input.password !== args.input.confirmPassword) {
          return {
            code: 400,
            status: false,
            ack: 0,
            message: "User password is mismatch",
          };
        }
        const hashPassword = bcrypt.hash(args.input.password, 10);
        args.input.password = await hashPassword;
        const createdUser = await User.create(args.input);
        return {
          code: 201,
          status: true,
          ack: 1,
          message: "Successfully created",
          data: createdUser,
        };
      } catch (error) {
        return {
          code: 500,
          status: false,
          ack: 0,
          message: "Server Error",
          data: error.message,
        };
      }
    },
    createPost(
      root,
      { userId, title, subtitle, description },
      contextValue,
      info
    ) {
      return Post.create({
        userId: userId,
        title: title,
        subtitle: subtitle,
        description: description,
      })
        .then((post) => post)
        .catch((error) => error);
    },
    updatePost(root, { id, title, subtitle, description }, contextValue, info) {
      let content = {};
      if (title) {
        content.title = title;
      }
      if (subtitle) {
        content.subtitle = subtitle;
      }
      if (description) {
        content.description = description;
      }

      return Post.findOne({ where: { id: id } })
        .then((found) => {
          return found
            .update(content)
            .then((updated) => updated)
            .catch((error) => error);
        })
        .catch((error) => error);
    },
    deletePost(root, { id }, contextValue, info) {
      return Post.findOne({
        where: { id: id },
      })
        .then((post) => {
          return post
            .destroy()
            .then(() => post)
            .catch((error) => error);
        })
        .catch((error) => error);
    },
  },
};
export default resolvers;
