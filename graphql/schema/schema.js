import pkg from "graphql-iso-date";
const { GraphQLDateTime } = pkg;

const typeDefs = `#graphql
scalar JSON
scalar GraphQLDateTime

  type User {
    id: Int!
    name: String!
    email: String!
    picture:String
    status:String
    isActive:Boolean
    createdAt : GraphQLDateTime  # this for demo checking
    messages: [Message]
    conversations:[Conversation]
    token:String
  }
  type Receiver {
    id: Int!
    name: String!
    email: String!
    picture:String
    status:String
    isActive:Boolean
    createdAt : GraphQLDateTime
  }

  type Message {
    id: Int!
    message:String!
    files: JSON
    senderId:Int
    user: User
    conversation:Conversation
  }

  type Conversation {
    id:Int!
    name:String!
    picture:String!
    senderId:Int
    receiverId:Int
    user:User
    message:[Message]
    receiver: User
    isActive:Boolean
  }

  # user get response #


  type Subscription {
    userCreated : String!
    friendRequestAccepted: FriendRequestPayload!
  }
  type FriendRequestPayload {
  senderId: Int!
  receiverId: Int!
}


# ----- Responses send to frontend schema ----

  # ------- Responses for create user ------
  type CreateUserResponses {
    code:Int!
    status:Boolean!
    msg:String!
    data:User
  }
  #---- end----

  # ---------- Response for login user -----------#
 
  # ------- Responses for Message ------#

  type SendMessageResponse {
    code:Int!
    status:Boolean!
    msg:String!
    data:Message
  }
  #---- end----#
    # ------- Responses for Conversation ----------#
    type CreateConversationResponses {
    code:Int!
    status:Boolean!
    msg:String!
    data:Conversation
  }
  #---- end-----#

 # --  union CustomCreateConversationRes = SendMessageResponse | CreateConversationResponses

# --- all Responses end here ---------

#--------- Input data type for input ----
  #----- Input for create user ---
  input CreateUserInput {
    name:String!
    email:String!
    picture:String
    status:String
    password:String!
    confirmPassword:String!
    isActive:Boolean
  }
#--- user input end -----

  #----- Input for message ---
  input CreateMessageInput {
    conversationId:Int!
    message:String!
    files: JSON
  }
#--- message input end -----

  #----- Input for conversation  ---
  input CreateConversationInput {
    name:String
    picture:String
    receiverId:Int!
    isActive:String
  }
#--- conversation input end -----


#------------ Query start -------------
  type getUserResponses {
    code:Int!
    status:Boolean!
    msg:String!
    data:[User]
  }

  type getSingleUserResponses {
    code:Int!
    status:Boolean!
    msg:String!
    data:User
  }

  type getMessageResponses {
    code:Int!
    status:Boolean!
    msg:String!
    data:[Message]
  }

    type getConversationResponses {
    code:Int!
    status:Boolean!
    msg:String!
    data:[Conversation]
  }

  type Query {
    searchUser(searchParam:String) :getUserResponses
    oneUser(id: Int!): getSingleUserResponses
    getConversation:getConversationResponses
    getMessage(conversationId:Int!):getMessageResponses
    
  }
 


  type Mutation {
#- ------------ User section --------
    createUser(input:CreateUserInput!):CreateUserResponses

    updateUser(
      id:Int!
      name:String
      email:String
      picture:String
      status:String
      password:String
      isActive:Boolean
    ):CreateUserResponses

    deleteUser(id:Int!):CreateUserResponses
# ------------ User section end --------
# ------- Message section -----
  
  
   sendMessage(input:CreateMessageInput!) :SendMessageResponse!

    updateMessage(
      id: Int!
      message:String!
      files:JSON
    ): SendMessageResponse

    deleteMessage(id: Int!): SendMessageResponse!
# -------- Message section end -----

#------ Conversation section -----------
     createOpenConversation(input:CreateConversationInput) : CreateConversationResponses

     updateConversation(
      id:Int!
      name:String
      picture:String
      latestMessageId:Int
      isActive:Boolean
     ): CreateConversationResponses

     deleteConversation(id:Int!): CreateConversationResponses

  
# ---------- conversation section end ---------------

#------ user Log in section ---------
 userSignUp(input:CreateUserInput!):CreateUserResponses
    userSignIn(email: String!,password:String!): CreateUserResponses
  }
`;

export default typeDefs;
