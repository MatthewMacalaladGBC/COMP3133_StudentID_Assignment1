import { gql } from "graphql-tag";

const typeDefs = gql`

    type User {
        id: ID!
        username: String!
        email: String!
        created_at: String
        updated_at: String
    }

    type Employee {
        id: ID!
        first_name: String!
        last_name: String!
        email: String!
        gender: String
        designation: String!
        salary: Float!
        date_of_joining: String!
        department: String!
        employee_photo: String
        created_at: String
        updated_at: String
    }

    type AuthResponse {
        message: String!
        user: User
    }

    type DeleteResponse {
        message: String!
    }

    type Query {
        login(username: String, email: String, password: String!): AuthResponse
        getAllEmployees: [Employee]
        getEmployeeById(id: ID!): Employee
        searchEmployee(designation: String, department: String): [Employee]
    }

    type Mutation {
        signup(username: String!, email: String!, password: String!): AuthResponse

        addEmployee(
        first_name: String!
        last_name: String!
        email: String!
        gender: String
        designation: String!
        salary: Float!
        date_of_joining: String!
        department: String!
        employee_photo: String
        ): Employee

        updateEmployee(
        id: ID!
        first_name: String
        last_name: String
        email: String
        gender: String
        designation: String
        salary: Float
        date_of_joining: String
        department: String
        employee_photo: String
        ): Employee

        deleteEmployee(id: ID!): DeleteResponse
    }
`;

export default typeDefs;