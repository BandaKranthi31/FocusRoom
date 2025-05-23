import User from "../models/user.model.js"

export const getUsers = () => User.find()
export const getUserById = (id) => User.findById(id)
export const getUserByUsername = (username) => User.findOne({ username })
export const getUserByEmail = (email) => User.findOne({ email })
export const createUser = (values) => new User(values).save().then((user) => user.toObject())