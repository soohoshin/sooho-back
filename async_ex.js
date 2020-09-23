const models = require("./models");

async function getProducts() {
  try {
    const products1 = await models.Products.findByPk(1);
    const products3 = await models.Products.findByPk(3);

    console.log(products1.dataValues.id);
    console.log(products3.dataValues);
  } catch (err) {
    console.log(err);
  }
}

getProducts();
