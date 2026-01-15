import { User } from "../models/userModel.js";

export const createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
};
export const getUserByEmail = async (email) => {
    return await User.findOne({ email });
};
export const getUserById = async (userId) => {
    return await User.findOne({ userId });
};
export const updateUserPassword = async (userId, newPassword) => {
    return await User.updateOne({ userId }, { password: newPassword });
}   ;   
export const deleteUser = async (userId) => {
    return await User.deleteOne({ userId });
};