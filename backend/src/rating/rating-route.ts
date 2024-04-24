import express from "express";
import * as Rating from "./rating-controller";

const router = express.Router();

router.get("/getRatingByAnswer/:answerId", Rating.getRatingByAnswer);
router.get("/getRatingByComment/:commentId", Rating.getRatingByComment);
router.get("/getRating/:ratingId", Rating.getRating);
router.put("/updateRating/:ratingId", Rating.updateRating);
router.delete("/deleteRating/:ratingId", Rating.deleteRating);


export default router;
