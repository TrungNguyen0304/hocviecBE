const cron = require("node-cron");
const { notifyTaskOverdue } = require("../Controller/notification");
const Task = require("../models/task");

function startScheduleCheck() {
  cron.schedule("* * * * *", async () => {
    console.log("Running cron job at", new Date());
    const now = new Date();

    try {
      const overdueTasks = await Task.find({
        status: { $ne: "completed" },
        isCompleted: 0,
        deadline: { $lt: now },
        isOverdueNotified: { $ne: 1 },
        assignedTo: { $ne: null }
      });

      for (const task of overdueTasks) {
        await notifyTaskOverdue({ userId: String(task.assignedTo), task });
        task.isOverdueNotified = 1;
        await task.save();
      }
    } catch (err) {
      console.error(" Error fetching overdue tasks:", err);
    }
  });
}

module.exports = { startScheduleCheck };