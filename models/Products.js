const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define("Products", {
    productId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING },
    price: { type: DataTypes.INTEGER },
    description: { type: DataTypes.TEXT },
    productImg: { type: DataTypes.STRING },
  });

  Products.associate = (models) => {
    Products.hasMany(models.Comments, {
      foreignKey: "productId",
      as: "comment",
    });
  };

  Products.prototype.dateFormat = (date) => moment(date).format("YYYY-MM-DD");

  return Products;
};
