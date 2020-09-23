module.exports = (sequelize, DataTypes) => {
  const Pages = sequelize.define(
    "Pages",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: DataTypes.STRING },
      content: { type: DataTypes.STRING },
    },
    { timestamps: false }
  );

  return Pages;
};
