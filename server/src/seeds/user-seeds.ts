import { User } from "../models/user.js";

export const seedUsers = async () => {
  await User.bulkCreate(
    [
      { username: "jessica", password: "password" },
      { username: "netra", password: "password" },
      { username: "talon", password: "password" },
      { username: "luis", password: "password" },
    ],
    { individualHooks: true },
  );
};
