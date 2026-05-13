const express = require("express");
const router = express.Router();
const {
    createTask,
    getTasksByHousehold,
    completeTask,
    deleteTask,
} = require("../controllers/taskController");

router.post("/", createTask);
router.get("/:householdId", getTasksByHousehold);
router.patch("/:taskId/complete", completeTask);
router.delete("/:taskId", deleteTask);

module.exports = router;