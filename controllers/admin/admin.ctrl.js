const models = require("../../models");

exports.get_products = (_, res) => {
  //   res.render(
  //     "admin/products.html",
  //     { message: "hello" } // message 란 변수를 템플릿으로 내보낸다.
  //   );
  models.Products.findAll({}).then((productList) => {
    res.render("admin/products.html", { productList: productList });
    console.log(productList);
  });
};

exports.get_products_write = (_, res) => {
  res.render("admin/write.html");
};

exports.post_products_write = (req, res) => {
  //   res.send(req.body);
  const data = {
    ...req.body,
    productImg: req.file.path,
  };
  console.log("body!!!!!!!!!", data);
  models.Products.create(data).then(() => {
    res.redirect("/admin/products");
  });
};

exports.get_products_detail = (req, res) => {
  // req.params.id

  models.Products.findByPk(req.params.productId).then((product) => {
    res.render("admin/detail.html", { product });
  });
};

exports.get_products_edit = (req, res) => {
  console.log(req.params.productId);
  models.Products.findByPk(req.params.productId).then((product) => {
    console.log(product);
    res.render("admin/write.html", { product });
  });
};

exports.post_products_edit = (req, res) => {
  const data = {
    ...req.body,
    productImg: req.file.path,
  };
  models.Products.update(data, {
    where: { productId: req.params.productId },
  }).then(() => {
    res.redirect("/admin/products/detail/" + req.params.productId);
  });
};

exports.get_products_delete = (req, res) => {
  models.Products.destroy({
    where: { productId: req.params.productId },
  }).then(() => {
    res.redirect("/admin/products");
  });
};

// page

// exports.get_pages = (req, res) => {
//   let pageNum = req.query.page;
//   let offset = 0;
//   const limit = 5;
//   let type = "";
//   let searchName = "%%";
//   if (type) {
//     type = req.query.type;
//   }
//   if (searchName) {
//     searchName = `%${req.query.searchName}%`;
//   }
//   if (pageNum > 1) {
//     offset = limit * (pageNum - 1);
//   }

//   models.Pages.findAndCountAll({
//     offset: offset,
//     limit: limit,
//     // where: {
//     //   [type]: {
//     //     [Op.like]: searchName,
//     //   },
//     // },
//     order: [["id", "desc"]],
//   }).then((PageList) => {
//     res.render("admin/page.html", {
//       PageList: PageList.rows,
//       NavCount: Math.ceil(PageList.count / limit),
//     });
//   });
// };

exports.get_pages = async (req, res) => {
  let pageNum = req.query.page;
  let type = req.query.type;
  let searchName = req.query.searchName;
  let whereCondition = ``;
  let offset = 0;
  const limit = 4;
  const pageBlockSize = 5;
  if (type && searchName) {
    whereCondition = `where ${type} like '%${searchName}%'`;
  }

  if (pageNum > 1) {
    offset = limit * (pageNum - 1);
  } else {
    req.query.page = 1;
  }

  let [totalCount] = await models.sequelize.query(
    `
      select count(*) as cnt from Pages ${whereCondition} ;
    `,
    {
      type: models.sequelize.QueryTypes.SELECT,
    }
  );

  let _totalCount = Math.ceil(totalCount.cnt / limit);

  const pageList = await models.sequelize.query(
    `
        select * from Pages ${whereCondition} order by id desc limit :limit offset :offset ;
      `,
    {
      type: models.sequelize.QueryTypes.SELECT,
      replacements: { limit, offset },
    }
  );
  res.render("admin/page.html", {
    PageList: pageList,
    pageTotalCount: _totalCount,
    dataTotalCount: totalCount.cnt,
    param: req.query,
    beforePage: Number(req.query.page) - 1,
    beforePageBlock: Number(req.query.page) - 5,
    nextPage: Number(req.query.page) + 1,
    nextPageBlock: Number(req.query.page) + 5,
    limit: limit,
    pageBlockSize: pageBlockSize,
  });
  console.log(pageList);
};

// ajax
exports.get_ajax = async (_, res) => {
  // const data = await models.Products.findAll({});
  // return res.json(data);
  res.render(
    "admin/ajax.html",
    { message: "hello" } // message 란 변수를 템플릿으로 내보낸다.
  );
};
