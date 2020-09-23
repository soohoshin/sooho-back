const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define("Comments", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: { type: DataTypes.TEXT, allowNull: false },
  });

  Comments.associate = (models) => {
    Comments.belongsTo(models.Products, { foreignKey: "productId" });
  };

  Comments.prototype.dateFormat = (date) => moment(date).format("YYYY-MM-DD");

  return Comments;
};
