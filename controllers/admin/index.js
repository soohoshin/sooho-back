const { Router } = require("express");
const router = Router();
const ctrl = require("./admin.ctrl");
const multer = require("multer");
const path = require("path");

// const upload = multer({dest:'uploads/'});
const upload = multer({
  storage: multer.diskStorage({
    // set a localstorage destination
    //   어떤이름으로 저장할지가 들어있다.

    //위치 지정
    destination: (req, file, done) => {
      done(null, "uploads/");
    },
    //지정
    // convert a file name
    filename: (req, file, done) => {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
      // cb(null, new Date().valueOf() + path.extname(file.originalname));
    },
  }),
  //   limits: { fileSize: 5 * 1024 * 1024 },
});

router.get("/products", ctrl.get_products);

router.get("/products/write", ctrl.get_products_write);

router.post(
  "/products/write",
  upload.single("productImg"),
  ctrl.post_products_write
);

router.get("/products/detail/:productId", ctrl.get_products_detail);

router.get("/products/edit/:productId", ctrl.get_products_edit);

router.post(
  "/products/edit/:productId",
  upload.single("productImg"),
  ctrl.post_products_edit
);

router.get("/products/delete/:productId", ctrl.get_products_delete);

//page

router.get("/page", ctrl.get_pages);

//ajax

router.get("/ajax", ctrl.get_ajax);

module.exports = router;
