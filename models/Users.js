module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    userName: { type: DataTypes.STRING },
  });

  return Users;
};
