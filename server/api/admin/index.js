import express from "express";
import categoryRoute from "./category/index.js";
import controlsRoute from "./controls/index.js";
import usersRoute from "./users/index.js";
const router = express.Router();

router.use("/category", categoryRoute);
router.use("/controls", controlsRoute);
router.use("/usersList", usersRoute);
export default router;
