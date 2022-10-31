import { makeExecutableSchema } from '@graphql-tools/schema'
import gql from 'graphql-tag'

const typeDefs = gql`
  scalar DateTime

  scalar Json

  type Mutation {
    createOrganizationCollection(name: String!, slug: String): Organization
    inviteToOrganizationCollection(
      emails: [String]!
      organizationId: String!
      role: String
    ): Boolean
    removeUserFromOrganizationCollection(
      organizationId: String!
      userId: String!
    ): Boolean
    updateOrganizationCollection(id: String!, name: String!, email: String): Organization
    updateUserCollection(id: String!, name: String, email: String): User
    updateMemberRolesCollection(
      userId: String!
      organizationId: String!
      roles: [String]!
    ): OrganizationMember
    createContactCollection(name: String!): Contact
    addActivityCommentCollection(id: String!, comment: String!): Activity
    deleteActivityCommentCollection(id: String!): Boolean
  }

  type Organization {
    id: String!
    name: String!
    slug: String!
    plan: String
    email: String
    logo: String
    members(
      after: UserWhereUniqueInput
      before: UserWhereUniqueInput
      first: Int
      last: Int
    ): [OrganizationMember!]!
  }

  enum SubscriptionStatus {
    active
    trialing
    past_due
    paused
    canceled
  }

  type Subscription {
    id: String!
    organizationCollection: Organization!
    plan: String!
    status: SubscriptionStatus!
    startedAt: DateTime
    trialEndsAt: DateTime
    createdAt: DateTime
    updatedAt: DateTime
  }

  type OrganizationMember {
    id: String!
    user: User!
    organizationCollection: Organization
    roles: [String]!
  }

  input OrganizationWhereUniqueInput {
    id: String
    slug: String
  }

  type Query {
    currentUserCollection: User
    organizationCollection(id: String, slug: String): Organization
    organizationsCollection: [Organization]
    subscriptionCollection(slug: String): Subscription
    contactsCollection(type: String): [Contact]
    contactCollection(id: String): Contact
    activitiesCollection(contactId: String): [Activity!]
  }

  type User {
    email: String!
    id: String!
    name: String
    status: String
    avatar: String
    organizations(
      after: OrganizationWhereUniqueInput
      before: OrganizationWhereUniqueInput
      first: Int
      last: Int
    ): [Organization!]!
  }

  input UserWhereUniqueInput {
    email: String
    id: String
  }

  type Contact {
    id: String!
    email: String!
    firstName: String
    lastName: String
    fullName: String
    status: String
    type: String
    tags: [String]
    createdAt: DateTime
    updatedAt: DateTime
  }

  enum ActivityType {
    action
    update
    comment
  }

  type Activity {
    id: String!
    user: User!
    type: ActivityType!
    data: Json
    date: DateTime
    createdAt: DateTime
    updatedAt: DateTime
  }
`

export const schema = makeExecutableSchema({ typeDefs: typeDefs as any })
