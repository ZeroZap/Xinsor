// YOLO Learning Configuration
export const yoloConfig = {
  // Learning schedule
  intervalMinutes: 5,
  autoStart: true,
  
  // Learning focus
  focusArea: "all", // all, basic, intermediate, advanced, expert
  
  // Output options
  logToConsole: true,
  logToFile: true,
  generateReports: true,
  
  // Notifications
  enableNotifications: false,
  webhookUrl: "",
  
  // Progress persistence
  saveProgress: true,
  progressFile: "./docs/yolo_progress.json",
  
  // YOLO learning topics
  topics: [
    { id: 1, name: "YOLO Architecture", level: "basic", duration: 5 },
    { id: 2, name: "Anchor Boxes & IoU", level: "basic", duration: 5 },
    { id: 3, name: "Loss Functions", level: "intermediate", duration: 5 },
    { id: 4, name: "Data Augmentation", level: "intermediate", duration: 5 },
    { id: 5, name: "Model Optimization", level: "advanced", duration: 5 },
    { id: 6, name: "Custom Dataset Training", level: "advanced", duration: 5 },
    { id: 7, name: "Real-time Deployment", level: "advanced", duration: 5 },
    { id: 8, name: "YOLOv8/v9/v10 Features", level: "expert", duration: 5 }
  ]
};
