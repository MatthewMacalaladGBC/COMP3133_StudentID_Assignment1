import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Employee from "../models/Employee.js";
import cloudinary from "../config/cloudinary.js";

const resolvers = {

    Query: {

        login: async (_, { username, email, password }) => {
            if (!username && !email) throw new Error("Username or email required");

            const user = await User.findOne(
                username ? { username } : {email}
            );

            if (!user) throw new Error("User not found");

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) throw new Error("Incorrect password");

            return {
                message: "Login successful!",
                user
            };
        },

        getAllEmployees: async () => {
            return await Employee.find();
        },

        getEmployeeById: async (_, { id }) => {
            const employee = await Employee.findById(id);

            if (!employee) throw new Error("Employee not found");
        
            return employee;
        },

        searchEmployee: async (_, { designation, department }) => {
            if (!designation && !department) throw new Error("Provide a designation or department");

            const filter = {};
            if (designation) filter.designation = designation;
            if (department) filter.department = department;

            return await Employee.find(filter);
        }

    },

    Mutation: {

        signup: async (_, { username, email, password }) => {
            const existingUser = await User.findOne({
                $or: [{ email }, { username }]
            });

            if (existingUser) throw new Error("User with given username and/or email already exists");

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            const newUser = new User({
                username,
                email,
                password: hashedPassword
            });

            await newUser.save();

            return {
                message: "User successfully registered!",
                user: newUser
            };
        },

        addEmployee: async (_, args) => {
            if (args.salary < 1000) throw new Error("Salary must be at least 1000");

            const existingEmployee = await Employee.findOne({ email: args.email });
            if (existingEmployee) throw new Error("Employee email already exists");

            let imageUrl = null;

            if (args.employee_photo) {
                const uploadResponse = await cloudinary.uploader.upload(
                    args.employee_photo,
                    { folder: "employees" }
                );
                imageUrl = uploadResponse.secure_url;
            }

            const newEmployee = new Employee({
                ...args,
                employee_photo: imageUrl
            });

            await newEmployee.save();

            return newEmployee;
        },

        updateEmployee: async (_, { id, ...updates }) => {
            if (updates.salary < 1000 ) throw new Error("Salary must be at least 1000");

            if (updates.employee_photo) {
                const uploadResponse = await cloudinary.uploader.upload(
                    updates.employee_photo,
                    { folder: "employees" }
                );
                updates.employee_photo = uploadResponse.secure_url;
            }

            const updatedEmployee = await Employee.findByIdAndUpdate(
                id,
                updates,
                { new: true }
            );

            if (!updatedEmployee) throw new Error("Employee not found");

            return updatedEmployee;
        },

        deleteEmployee: async (_, { id }) => {
            const employee = await Employee.findById(id);
            if (!employee) throw new Error("Employee not found");

            await Employee.findByIdAndDelete(id);

            return {
                message: "Employee deleted successfully!"
            }
        }

    }
};

export default resolvers;