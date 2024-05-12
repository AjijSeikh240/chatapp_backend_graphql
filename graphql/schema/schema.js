const typeDefs = `#graphql
type User {
  id: Int!
  name: String!
  email: String!
  posts: [Post]!
}

type Post {
  id: Int!
  title: String!
  subtitle: String!
  description: String!
  user: User!
}

# use of interface 
interface Character {
  id: Int!
  name: String!
  email: String!
  Posts: [Post]
}
type Users implements Character {
  id: Int!
  name: String!
  email: String!
  Posts: [Post]
}
# end interface section

# ------- Responses for create user -------
 type CreateUserResponses {
     code:Int!
     status:Boolean!
     ack:Int!
     message:String!
     data:User
 }
# ------------ end responses ----

# ----------- Input for create user -------
  input CreateUserInput {
    name:String!
    email:String!
    password:String!
    confirmPassword:String!
    isActive:Boolean
  }
# --------- end user Input -------------
type Query {
  oneUser(id: Int!): User
  allUser: [User!]!
  allPosts: [Post!]!
  onePost(id: Int!): Post
  manyPost(id: Int!): Users
}

type Mutation {
  createUser(input:CreateUserInput): CreateUserResponses!

  createPost(
    userId: Int!
    title: String!
    subtitle: String!
    description: String!
  ): Post!

  updatePost(
    id: Int!
    title: String
    subtitle: String
    description: String
  ): Post!

  deletePost(id: Int!): Post!

  userLogin(email:String!,password:String!) : User
}
`;
export default typeDefs;
