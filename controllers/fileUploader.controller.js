let methods = {
  uploadFile: async (req, res) => {
    try {
      let files = req.files;
      let file = files.file;
      
    } catch (error) {
      console.log(`error is ${error}`);
      res.status();
    }
  },
};

module.exports = methods;
