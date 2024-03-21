import express from "express";


const router = express.Router();

// A dummy route which will simply return the text "Hello, World".
// router.get("/api/hello", (req, res) => {
//   return res.send("Hello, World");
// });
// TODO: add routes here
router.get("/api/hello", (req, res) => {
      return res.send("Hello, World");
    });
export default router;
