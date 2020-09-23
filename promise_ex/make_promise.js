const wait1seconds = new Promise((resolve, reject) => {
  reject("에러!!!");
});

wait1seconds
  .then(() => {
    console.log("찍고난후");
  })
  .catch((err) => {
    console.log(err);
  });
