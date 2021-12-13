const {buildSchema} = require('graphql')

module.exports = buildSchema(`
        type User {
            _id: ID!
            user_login: String
            user_email: String!
            user_password: String!
            user_discord: String
            user_address: String
            user_zip: String
            user_city: String
            user_gender: String
            user_role: String!
            user_state: String 
            user_createdEvent: [Event!] 
            user_createdClans: [Clan!]
            user_addedGames: [Game!]
            user_stream: [Stream!]
            createdAt: String!
            updatedAt: String!
            user_isActive: Boolean
            user_isDark: Boolean
        }
        
        type AuthData {
            token: String!
        }
        
        type Event {
            _id: ID!
            event_name: String!
            event_date: String!
            event_desc: String!
            event_score: String
            event_winner: String
            event_creator: User!
            createdAt: String!
            updatedAt: String!
        }
        
      input UpdateEventInput{
            event_name: String
            event_date: String
            event_desc: String
      }
        
        type Clan {
            _id: ID!
            clan_name: String!
            clan_desc: String!
            clan_banner: String!
            clan_discord: String!
            clan_population: Int!
            clan_recrut: String!
            clan_activity: String!
            clan_creator: User!
            createdAt: String!
            updatedAt: String!
        }
        
        type Game {
            _id: ID!
            game_name: String!
            game_desc: String!
            game_pic: String
            game_creator: User!
            createdAt: String!
            updatedAt: String!
        }
        
        type Stream {
            _id: ID!
            stream_url: String!
            stream_support: String!
        }
        
        type Engagement {
            _id: ID!
            engagement_user: User!
            engagement_event: Event!
        }
                
        type UserClan {
            _id: ID!
            user: User!
            clan: Clan!
        }
        
        type UserGame {
            _id: ID!
            user: User!
            game: Game!
        }
        
        type ClanGame {
            _id: ID!
            clan: Clan!
            game: Game!
        }
        
        input UserInput {
            user_login: String!
            user_email: String!
            user_password: String!
        }

        input UserUpdateInput {
            user_login: String
            user_email: String
            user_password: String
            user_discord: String
            user_address: String
            user_zip: String
            user_city: String
            user_gender: String
            user_role: String
            user_state: String 
            updatedAt: String
            user_isActive: Boolean
            user_isDark: Boolean
        }
            
        input EventInput {
            event_name: String!
            event_date: String!
            event_desc: String!
        } 
        
        input ClanInput {
            clan_name: String!
            clan_desc: String!
            clan_banner: String!
            clan_discord: String!
            clan_population: String!
            clan_recrut: String!
            clan_activity: String!
        }
        
        input GameInput {
            game_name: String!
            game_desc: String!
            game_pic: String
        }
        
        input StreamInput {
            stream_url: String!
            stream_support: String!
        }
        
        type RootQuery {
            users: [User!]!
            user(_id: ID!): User!
            confirmUser(token: String!): User
            selectUser(user_email: String!): User!
            events: [Event!]!
            clans: [Clan!]!
            games: [Game!]!
            streams: [Stream!]!
            engagements: [Engagement!]!
            login(user_login: String, user_email: String!, user_password: String!): AuthData!
        }
        
        type RootMutation {
            createUser(userInput: UserInput): User
            createEvent(eventInput: EventInput): Event
            deleteEvent(id: ID!): Event
            updateEvent(id: ID!,updateEventInput: UpdateEventInput): Event
            createGame(gameInput: GameInput): Game
            createStream(streamInput: StreamInput): Stream
            createClan(clanInput: ClanInput): Clan
            joinEvent(eventId: ID!): Engagement!
            joinClan(clanId: ID!): UserClan!
            playGame(gameId: ID!): UserGame!
            joinGame(gameId: ID!): ClanGame!
            cancelClanGame(gameId: ID!): Game!
            cancelJoinStream(streamId: ID!): Stream!
            cancelPlayGame(gameId: ID!): Game!
            cancelJoinClan(clanId: ID!): Clan!
            cancelJoining(engagementId: ID!): Event!
            updateUser(_id: ID!, updateUserInput: UserUpdateInput): User!
            
        }
        
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `)