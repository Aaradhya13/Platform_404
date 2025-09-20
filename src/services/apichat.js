// // api.js - Platform-404 API utilities for ChatBot
// const BASE_URL = "https://platform-404.onrender.com";

// // API utility class
// class Platform404API {
//   constructor() {
//     this.token = localStorage.getItem("token");
//     this.role = localStorage.getItem("role");
//     this.department = localStorage.getItem("department");
//     this.username = localStorage.getItem("username");
//   }

//   // Common headers for authenticated requests
//   getHeaders() {
//     return {
//       "Content-Type": "application/json",
//       Authorization: `token ${this.token}`,
//     };
//   }

//   // Generic API request method
//   async makeRequest(endpoint, method = "GET", payload = null) {
//     try {
//       const config = {
//         method,
//         headers: this.getHeaders(),
//       };

//       if (payload && (method === "POST" || method === "PUT")) {
//         config.body = JSON.stringify(payload);
//       }

//       const response = await fetch(`${BASE_URL}${endpoint}`, config);
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "API request failed");
//       }

//       return data;
//     } catch (error) {
//       console.error(`API Error (${endpoint}):`, error);
//       throw error;
//     }
//   }

//   // Role-based permission checker
//   hasPermission(action, targetDept = null) {
//     const userRole = this.role?.toLowerCase();
//     const userDept = this.department?.toLowerCase();
//     const target = targetDept?.toLowerCase();

//     // Admin has access to everything
//     if (userRole === "admin") return true;

//     // Supervisor has access to their department
//     if (userRole === "supervisor") {
//       return !target || target === userDept;
//     }

//     // Department-specific permissions
//     switch (action) {
//       case "read":
//         return !target || target === userDept;
//       case "create":
//       case "update":
//         return userRole === "supervisor" && (!target || target === userDept);
//       case "delete":
//         return userRole === "admin" || (userRole === "supervisor" && target === userDept);
//       default:
//         return false;
//     }
//   }

//   // === CLEANING OPERATIONS ===
//   async getCleaningEntries() {
//     if (!this.hasPermission("read", "cleaning")) {
//       throw new Error("Access denied: Insufficient permissions for cleaning data");
//     }
//     return await this.makeRequest("/cleaning/");
//   }

//   async createCleaningEntry(data) {
//     if (!this.hasPermission("create", "cleaning")) {
//       throw new Error("Access denied: Cannot create cleaning entries");
//     }
//     return await this.makeRequest("/cleaning/", "POST", data);
//   }

//   async updateCleaningEntry(data) {
//     if (!this.hasPermission("update", "cleaning")) {
//       throw new Error("Access denied: Cannot update cleaning entries");
//     }
//     return await this.makeRequest("/cleaning/", "PUT", data);
//   }

//   async deleteCleaningEntry(id) {
//     if (!this.hasPermission("delete", "cleaning")) {
//       throw new Error("Access denied: Cannot delete cleaning entries");
//     }
//     return await this.makeRequest("/cleaning/", "DELETE", { id });
//   }

//   async getCleaningLanes() {
//     if (!this.hasPermission("read", "cleaning")) {
//       throw new Error("Access denied: Insufficient permissions for cleaning lanes");
//     }
//     return await this.makeRequest("/cleaning/lanes/");
//   }

//   // === INSPECTION OPERATIONS ===
//   async getInspectionEntries() {
//     if (!this.hasPermission("read", "inspection")) {
//       throw new Error("Access denied: Insufficient permissions for inspection data");
//     }
//     return await this.makeRequest("/inspection/");
//   }

//   async createInspectionEntry(data) {
//     if (!this.hasPermission("create", "inspection")) {
//       throw new Error("Access denied: Cannot create inspection entries");
//     }
//     return await this.makeRequest("/inspection/", "POST", data);
//   }

//   async updateInspectionEntry(data) {
//     if (!this.hasPermission("update", "inspection")) {
//       throw new Error("Access denied: Cannot update inspection entries");
//     }
//     return await this.makeRequest("/inspection/", "PUT", data);
//   }

//   async getJobCards() {
//     if (!this.hasPermission("read", "inspection")) {
//       throw new Error("Access denied: Insufficient permissions for job cards");
//     }
//     return await this.makeRequest("/inspection/jobcards/");
//   }

//   async createJobCard(data) {
//     if (!this.hasPermission("create", "inspection")) {
//       throw new Error("Access denied: Cannot create job cards");
//     }
//     return await this.makeRequest("/inspection/jobcards/", "POST", data);
//   }

//   async updateJobCard(data) {
//     if (!this.hasPermission("update", "inspection")) {
//       throw new Error("Access denied: Cannot update job cards");
//     }
//     return await this.makeRequest("/inspection/jobcards/", "PUT", data);
//   }

//   // === MAINTENANCE OPERATIONS ===
//   async getMaintenanceEntries() {
//     if (!this.hasPermission("read", "maintenance") && !this.hasPermission("read", "rollingstock")) {
//       throw new Error("Access denied: Insufficient permissions for maintenance data");
//     }
//     return await this.makeRequest("/maintainance/");
//   }

//   async createMaintenanceEntry(data) {
//     if (!this.hasPermission("create", "maintenance") && !this.hasPermission("create", "rollingstock")) {
//       throw new Error("Access denied: Cannot create maintenance entries");
//     }
//     return await this.makeRequest("/maintainance/", "POST", data);
//   }

//   async updateMaintenanceEntry(data) {
//     if (!this.hasPermission("update", "maintenance") && !this.hasPermission("update", "rollingstock")) {
//       throw new Error("Access denied: Cannot update maintenance entries");
//     }
//     return await this.makeRequest("/maintainance/", "PUT", data);
//   }

//   // === OPERATIONS ===
//   async getOperationsEntries() {
//     if (!this.hasPermission("read", "operations")) {
//       throw new Error("Access denied: Insufficient permissions for operations data");
//     }
//     return await this.makeRequest("/operations/");
//   }

//   async getTimetable() {
//     if (!this.hasPermission("read", "operations")) {
//       throw new Error("Access denied: Insufficient permissions for timetable");
//     }
//     return await this.makeRequest("/operations/timetable/");
//   }

//   async createTimetableEntry(data) {
//     if (!this.hasPermission("create", "operations")) {
//       throw new Error("Access denied: Cannot create timetable entries");
//     }
//     return await this.makeRequest("/operations/timetable/", "POST", data);
//   }

//   async updateTimetableEntry(data) {
//     if (!this.hasPermission("update", "operations")) {
//       throw new Error("Access denied: Cannot update timetable entries");
//     }
//     return await this.makeRequest("/operations/timetable/", "PUT", data);
//   }

//   // === ADMIN OPERATIONS ===
//   async getUsers() {
//     if (this.role !== "admin") {
//       throw new Error("Access denied: Admin privileges required");
//     }
//     return await this.makeRequest("/rail-admin/users/");
//   }

//   async getDepartments() {
//     return await this.makeRequest("/rail-admin/departments/");
//   }

//   async getRoles() {
//     return await this.makeRequest("/rail-admin/roles/");
//   }

//   async getLogs() {
//     if (this.role !== "admin") {
//       throw new Error("Access denied: Admin privileges required");
//     }
//     return await this.makeRequest("/rail-admin/logs/");
//   }
// }

// // ChatBot function calling tools based on user queries
// class ChatBotTools {
//   constructor() {
//     this.api = new Platform404API();
//   }

//   // Parse user intent and extract relevant information
//   parseUserIntent(query) {
//     const lowerQuery = query.toLowerCase();
    
//     const intents = {
//       // Data retrieval intents
//       getCleaningData: /(?:show|get|list|fetch|display).*(?:cleaning|clean).*(?:entries|data|schedule|tasks?)/,
//       getInspectionData: /(?:show|get|list|fetch|display).*(?:inspection|inspect).*(?:entries|data|schedule|tasks?)/,
//       getMaintenanceData: /(?:show|get|list|fetch|display).*(?:maintenance|maintain).*(?:entries|data|schedule|tasks?)/,
//       getOperationsData: /(?:show|get|list|fetch|display).*(?:operations?|parking).*(?:entries|data|schedule)/,
//       getTimetable: /(?:show|get|list|fetch|display).*(?:timetable|schedule|time.*table)/,
//       getJobCards: /(?:show|get|list|fetch|display).*(?:job.*cards?|issues?|problems?)/,
      
//       // Status checking
//       checkTrainStatus: /(?:status|where|location).*(?:train|trainset)\s*(\d+)/,
//       checkLaneStatus: /(?:status|available|free).*(?:lanes?|bays?)/,
      
//       // Creation intents
//       createEntry: /(?:create|add|new|schedule).*(?:entry|task|appointment)/,
//       createJobCard: /(?:create|add|new|report).*(?:job.*card|issue|problem)/,
      
//       // General help
//       help: /help|what.*can.*do|commands?|options?/,
//     };

//     for (const [intent, pattern] of Object.entries(intents)) {
//       if (pattern.test(lowerQuery)) {
//         return intent;
//       }
//     }
    
//     return "general";
//   }

//   // Main function calling dispatcher
//   async handleUserQuery(query) {
//     try {
//       const intent = this.parseUserIntent(query);
      
//       switch (intent) {
//         case "getCleaningData":
//           return await this.getCleaningSummary();
          
//         case "getInspectionData":
//           return await this.getInspectionSummary();
          
//         case "getMaintenanceData":
//           return await this.getMaintenanceSummary();
          
//         case "getOperationsData":
//           return await this.getOperationsSummary();
          
//         case "getTimetable":
//           return await this.getTimetableSummary();
          
//         case "getJobCards":
//           return await this.getJobCardsSummary();
          
//         case "checkTrainStatus":
//           const trainMatch = query.match(/train.*?(\d+)/i);
//           if (trainMatch) {
//             return await this.checkTrainStatus(trainMatch[1]);
//           }
//           return "Please specify a train number (e.g., 'status of train 123')";
          
//         case "checkLaneStatus":
//           return await this.getLaneStatusSummary();
          
//         case "help":
//           return this.getHelpMessage();
          
//         default:
//           return await this.getGeneralStatus();
//       }
//     } catch (error) {
//       if (error.message.includes("Access denied")) {
//         return `🚫 ${error.message}\n\nYou are logged in as: ${this.api.role} in ${this.api.department} department.`;
//       }
//       return `❌ Error: ${error.message}`;
//     }
//   }

//   // Helper methods for different data summaries
//   async getCleaningSummary() {
//     const entries = await this.api.getCleaningEntries();
//     const total = entries.length;
//     const inProgress = entries.filter(e => e.enterd && !e.exited).length;
//     const completed = entries.filter(e => e.enterd && e.exited).length;
//     const scheduled = entries.filter(e => !e.enterd).length;

//     return `🧽 **Cleaning Summary:**
// 📊 Total entries: ${total}
// 🚂 In progress: ${inProgress}
// ✅ Completed: ${completed}
// 📅 Scheduled: ${scheduled}

// ${entries.slice(0, 3).map(e => 
//   `• Train ${e.train_id} - Lane ${e.lane} (${e.depot_name}) - ${e.enterd ? 'In Progress' : 'Scheduled'}`
// ).join('\n')}`;
//   }

//   async getInspectionSummary() {
//     const entries = await this.api.getInspectionEntries();
//     const jobCards = await this.api.getJobCards().catch(() => []);
    
//     const total = entries.length;
//     const openIssues = jobCards.filter(j => !j.closed_at).length;
//     const closedIssues = jobCards.filter(j => j.closed_at).length;

//     return `🔍 **Inspection Summary:**
// 📊 Total entries: ${total}
// ⚠️ Open issues: ${openIssues}
// ✅ Resolved issues: ${closedIssues}

// Recent job cards:
// ${jobCards.slice(0, 3).map(j => 
//   `• Train ${j.train}: ${j.description.substring(0, 50)}${j.description.length > 50 ? '...' : ''} - ${j.closed_at ? 'Closed' : 'Open'}`
// ).join('\n')}`;
//   }

//   async getMaintenanceSummary() {
//     const entries = await this.api.getMaintenanceEntries();
//     const total = entries.length;
//     const inProgress = entries.filter(e => e.enterd && !e.exited).length;
//     const scheduled = entries.filter(e => !e.enterd).length;

//     return `🔧 **Maintenance Summary:**
// 📊 Total entries: ${total}
// 🔄 In progress: ${inProgress}
// 📅 Scheduled: ${scheduled}

// ${entries.slice(0, 3).map(e => 
//   `• Train ${e.train_id} - Lane ${e.lane} (${e.depot_name}) - ${e.enterd ? 'Active' : 'Scheduled'}`
// ).join('\n')}`;
//   }

//   async getOperationsSummary() {
//     const entries = await this.api.getOperationsEntries();
//     const total = entries.length;
//     const parked = entries.filter(e => e.enterd && !e.exited).length;

//     return `🚉 **Operations Summary:**
// 📊 Total parking entries: ${total}
// 🚂 Currently parked: ${parked}

// ${entries.slice(0, 3).map(e => 
//   `• Train ${e.train_id} - Lane ${e.lane} (${e.depot_name}) - ${e.enterd ? 'Parked' : 'Scheduled'}`
// ).join('\n')}`;
//   }

//   async getTimetableSummary() {
//     const timetable = await this.api.getTimetable();
//     const today = new Date().toISOString().split('T')[0];
//     const todayEntries = Object.values(timetable).flat().filter(entry => 
//       entry.date.startsWith(today)
//     );

//     return `📅 **Timetable Summary:**
// 🚂 Today's schedules: ${todayEntries.length}

// ${todayEntries.slice(0, 5).map(t => 
//   `• Train ${t.train_number}: ${t.starting_point} → ${t.ending_point} (${new Date(t.starting_time).toLocaleTimeString()})`
// ).join('\n')}`;
//   }

//   async getJobCardsSummary() {
//     const jobCards = await this.api.getJobCards();
//     const open = jobCards.filter(j => !j.closed_at).length;
//     const recent = jobCards.slice(0, 5);

//     return `🎫 **Job Cards Summary:**
// ⚠️ Open issues: ${open}
// 📝 Total cards: ${jobCards.length}

// Recent issues:
// ${recent.map(j => 
//   `• Train ${j.train}: ${j.description.substring(0, 60)}${j.description.length > 60 ? '...' : ''} - ${j.closed_at ? '✅ Closed' : '🔴 Open'}`
// ).join('\n')}`;
//   }

//   async checkTrainStatus(trainId) {
//     try {
//       const [cleaning, inspection, maintenance, operations] = await Promise.allSettled([
//         this.api.getCleaningEntries().catch(() => []),
//         this.api.getInspectionEntries().catch(() => []),
//         this.api.getMaintenanceEntries().catch(() => []),
//         this.api.getOperationsEntries().catch(() => []),
//       ]);

//       const allEntries = [
//         ...(cleaning.value || []).map(e => ({...e, type: 'Cleaning'})),
//         ...(inspection.value || []).map(e => ({...e, type: 'Inspection'})),
//         ...(maintenance.value || []).map(e => ({...e, type: 'Maintenance'})),
//         ...(operations.value || []).map(e => ({...e, type: 'Operations'})),
//       ];

//       const trainEntries = allEntries.filter(e => e.train_id == trainId);
      
//       if (trainEntries.length === 0) {
//         return `🚂 Train ${trainId}: No active or scheduled activities found.`;
//       }

//       const active = trainEntries.filter(e => e.enterd && !e.exited);
//       const scheduled = trainEntries.filter(e => !e.enterd);

//       return `🚂 **Train ${trainId} Status:**
// ${active.length > 0 ? 
//   `🔄 Current activity: ${active[0].type} in Lane ${active[0].lane} at ${active[0].depot_name}` : 
//   '✅ No active operations'
// }

// 📅 Scheduled activities: ${scheduled.length}
// ${scheduled.slice(0, 3).map(e => 
//   `• ${e.type} - Lane ${e.lane} (${new Date(e.scheduledStart).toLocaleDateString()})`
// ).join('\n')}`;
//     } catch (error) {
//       return `❌ Could not fetch status for Train ${trainId}: ${error.message}`;
//     }
//   }

//   getHelpMessage() {
//     const userRole = this.api.role;
//     const userDept = this.api.department;

//     return `🤖 **ChatBot Help** (${userRole} - ${userDept})

// **Available Commands:**
// • "Show cleaning data" - Get cleaning schedule summary
// • "Show inspection entries" - Get inspection activities  
// • "Show maintenance data" - Get maintenance schedule
// • "Show operations data" - Get parking/operations info
// • "Show timetable" - Get today's train schedule
// • "Show job cards" - Get inspection issues
// • "Status of train [number]" - Check specific train status
// • "Check lane status" - Get lane availability

// **Examples:**
// • "What's the status of train 123?"
// • "Show me today's cleaning schedule"
// • "Any open job cards?"
// • "Show maintenance entries"

// **Your Access Level:** ${userRole}
// **Department:** ${userDept}
// ${userRole === 'admin' ? '👑 Full system access' : 
//   userRole === 'supervisor' ? '🔑 Department management access' : 
//   '👀 Department read access'}`;
//   }

//   async getGeneralStatus() {
//     try {
//       const summaries = [];
      
//       // Try to get data based on user's role and department
//       if (this.api.hasPermission("read", "cleaning")) {
//         const cleaning = await this.api.getCleaningEntries().catch(() => []);
//         summaries.push(`🧽 Cleaning: ${cleaning.length} entries`);
//       }
      
//       if (this.api.hasPermission("read", "inspection")) {
//         const inspection = await this.api.getInspectionEntries().catch(() => []);
//         summaries.push(`🔍 Inspection: ${inspection.length} entries`);
//       }
      
//       if (this.api.hasPermission("read", "maintenance")) {
//         const maintenance = await this.api.getMaintenanceEntries().catch(() => []);
//         summaries.push(`🔧 Maintenance: ${maintenance.length} entries`);
//       }
      
//       if (this.api.hasPermission("read", "operations")) {
//         const operations = await this.api.getOperationsEntries().catch(() => []);
//         summaries.push(`🚉 Operations: ${operations.length} entries`);
//       }

//       return `📊 **System Overview:**
// ${summaries.join('\n')}

// 💡 Ask me specific questions like:
// • "Show cleaning data"
// • "Status of train 123"
// • "Show job cards"
// • Type "help" for more commands`;
      
//     } catch (error) {
//       return `🤖 I'm here to help! Type "help" to see what I can do for you.`;
//     }
//   }
// }

// // Export the classes
// export { Platform404API, ChatBotTools };

// // Usage in ChatBot component:
// // import { ChatBotTools } from './api.js';
// // const tools = new ChatBotTools();
// // const response = await tools.handleUserQuery(userInput);
// api.js - Platform-404 API utilities for ChatBot
const BASE_URL = "https://platform-404.onrender.com";

// API utility class
class Platform404API {
  constructor() {
    this.token = localStorage.getItem("token");
    this.role = localStorage.getItem("role");
    this.department = localStorage.getItem("department");
    this.username = localStorage.getItem("username");
  }

  // Common headers for authenticated requests
  getHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `token ${this.token}`,
    };
  }

  // Generic API request method
  async makeRequest(endpoint, method = "GET", payload = null) {
    try {
      const config = {
        method,
        headers: this.getHeaders(),
      };

      if (payload && (method === "POST" || method === "PUT")) {
        config.body = JSON.stringify(payload);
      }

      const response = await fetch(`${BASE_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "API request failed");
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Role-based permission checker
  hasPermission(action, targetDept = null) {
    const userRole = this.role?.toLowerCase();
    const userDept = this.department?.toLowerCase();
    const target = targetDept?.toLowerCase();

    // Admin has access to everything
    if (userRole === "admin") return true;

    // Supervisor has access to their department
    if (userRole === "supervisor") {
      return !target || target === userDept;
    }

    // Department-specific permissions
    switch (action) {
      case "read":
        return !target || target === userDept;
      case "create":
      case "update":
        return userRole === "supervisor" && (!target || target === userDept);
      case "delete":
        return userRole === "admin" || (userRole === "supervisor" && target === userDept);
      default:
        return false;
    }
  }

  // === CLEANING OPERATIONS ===
  async getCleaningEntries() {
    if (!this.hasPermission("read", "cleaning")) {
      throw new Error("Access denied: Insufficient permissions for cleaning data");
    }
    return await this.makeRequest("/cleaning/");
  }

  async createCleaningEntry(data) {
    if (!this.hasPermission("create", "cleaning")) {
      throw new Error("Access denied: Cannot create cleaning entries");
    }
    return await this.makeRequest("/cleaning/", "POST", data);
  }

  async updateCleaningEntry(data) {
    if (!this.hasPermission("update", "cleaning")) {
      throw new Error("Access denied: Cannot update cleaning entries");
    }
    return await this.makeRequest("/cleaning/", "PUT", data);
  }

  async deleteCleaningEntry(id) {
    if (!this.hasPermission("delete", "cleaning")) {
      throw new Error("Access denied: Cannot delete cleaning entries");
    }
    return await this.makeRequest("/cleaning/", "DELETE", { id });
  }

  async getCleaningLanes() {
    if (!this.hasPermission("read", "cleaning")) {
      throw new Error("Access denied: Insufficient permissions for cleaning lanes");
    }
    return await this.makeRequest("/cleaning/lanes/");
  }

  // === INSPECTION OPERATIONS ===
  async getInspectionEntries() {
    if (!this.hasPermission("read", "inspection")) {
      throw new Error("Access denied: Insufficient permissions for inspection data");
    }
    return await this.makeRequest("/inspection/");
  }

  async createInspectionEntry(data) {
    if (!this.hasPermission("create", "inspection")) {
      throw new Error("Access denied: Cannot create inspection entries");
    }
    return await this.makeRequest("/inspection/", "POST", data);
  }

  async updateInspectionEntry(data) {
    if (!this.hasPermission("update", "inspection")) {
      throw new Error("Access denied: Cannot update inspection entries");
    }
    return await this.makeRequest("/inspection/", "PUT", data);
  }

  async getJobCards() {
    if (!this.hasPermission("read", "inspection")) {
      throw new Error("Access denied: Insufficient permissions for job cards");
    }
    return await this.makeRequest("/inspection/jobcards/");
  }

  async createJobCard(data) {
    if (!this.hasPermission("create", "inspection")) {
      throw new Error("Access denied: Cannot create job cards");
    }
    return await this.makeRequest("/inspection/jobcards/", "POST", data);
  }

  async updateJobCard(data) {
    if (!this.hasPermission("update", "inspection")) {
      throw new Error("Access denied: Cannot update job cards");
    }
    return await this.makeRequest("/inspection/jobcards/", "PUT", data);
  }

  // === MAINTENANCE OPERATIONS ===
  async getMaintenanceEntries() {
    if (!this.hasPermission("read", "maintenance") && !this.hasPermission("read", "rollingstock")) {
      throw new Error("Access denied: Insufficient permissions for maintenance data");
    }
    return await this.makeRequest("/maintainance/");
  }

  async createMaintenanceEntry(data) {
    if (!this.hasPermission("create", "maintenance") && !this.hasPermission("create", "rollingstock")) {
      throw new Error("Access denied: Cannot create maintenance entries");
    }
    return await this.makeRequest("/maintainance/", "POST", data);
  }

  async updateMaintenanceEntry(data) {
    if (!this.hasPermission("update", "maintenance") && !this.hasPermission("update", "rollingstock")) {
      throw new Error("Access denied: Cannot update maintenance entries");
    }
    return await this.makeRequest("/maintainance/", "PUT", data);
  }

  // === OPERATIONS ===
  async getOperationsEntries() {
    if (!this.hasPermission("read", "operations")) {
      throw new Error("Access denied: Insufficient permissions for operations data");
    }
    return await this.makeRequest("/operations/");
  }

  async getTimetable() {
    if (!this.hasPermission("read", "operations")) {
      throw new Error("Access denied: Insufficient permissions for timetable");
    }
    return await this.makeRequest("/operations/timetable/");
  }

  async createTimetableEntry(data) {
    if (!this.hasPermission("create", "operations")) {
      throw new Error("Access denied: Cannot create timetable entries");
    }
    return await this.makeRequest("/operations/timetable/", "POST", data);
  }

  async updateTimetableEntry(data) {
    if (!this.hasPermission("update", "operations")) {
      throw new Error("Access denied: Cannot update timetable entries");
    }
    return await this.makeRequest("/operations/timetable/", "PUT", data);
  }

  // === ADMIN OPERATIONS ===
  async getUsers() {
    if (this.role !== "admin") {
      throw new Error("Access denied: Admin privileges required");
    }
    return await this.makeRequest("/rail-admin/users/");
  }

  async getDepartments() {
    return await this.makeRequest("/rail-admin/departments/");
  }

  async getRoles() {
    return await this.makeRequest("/rail-admin/roles/");
  }

  async getLogs() {
    if (this.role !== "admin") {
      throw new Error("Access denied: Admin privileges required");
    }
    return await this.makeRequest("/rail-admin/logs/");
  }
}

// ChatBot function calling tools based on user queries
class ChatBotTools {
  constructor() {
    this.api = new Platform404API();
  }

  // Parse user intent and extract relevant information
  parseUserIntent(query) {
    const lowerQuery = query.toLowerCase();
    
    const intents = {
      // Data retrieval intents - department specific
      getCleaningData: /(?:show|get|list|fetch|display).*(?:cleaning|clean).*(?:entries|data|schedule|tasks?)/,
      getInspectionData: /(?:show|get|list|fetch|display).*(?:inspection|inspect).*(?:entries|data|schedule|tasks?)/,
      getMaintenanceData: /(?:show|get|list|fetch|display).*(?:maintenance|maintain).*(?:entries|data|schedule|tasks?)/,
      getOperationsData: /(?:show|get|list|fetch|display).*(?:operations?|parking).*(?:entries|data|schedule)/,
      getTimetable: /(?:show|get|list|fetch|display).*(?:timetable|schedule|time.*table)/,
      getJobCards: /(?:show|get|list|fetch|display).*(?:job.*cards?|issues?|problems?)/,
      
      // Lane management
      getCleaningLanes: /(?:show|get|list).*(?:cleaning).*(?:lanes?|bays?)/,
      getInspectionLanes: /(?:show|get|list).*(?:inspection).*(?:lanes?|bays?)/,
      getMaintenanceLanes: /(?:show|get|list).*(?:maintenance).*(?:lanes?|bays?)/,
      getOperationsLanes: /(?:show|get|list).*(?:operations?|parking).*(?:lanes?|bays?)/,
      
      // Status checking
      checkTrainStatus: /(?:status|where|location).*(?:train|trainset)\s*(\d+)/,
      checkLaneStatus: /(?:status|available|free).*(?:lanes?|bays?)/,
      checkTrainGeneral: /(?:check|status).*(?:train)/,
      getSystemStatus: /(?:system|overall).*(?:status|overview)/,
      
      // Today specific queries
      getTodayTimetable: /(?:today|today's).*(?:timetable|schedule)/,
      getMyTasks: /(?:my|assigned).*(?:tasks?|work|jobs?)/,
      getTrainLocations: /(?:train).*(?:locations?|where)/,
      
      // Creation intents
      createCleaningEntry: /(?:create|add|new|schedule).*(?:cleaning).*(?:entry|task|appointment)/,
      createInspectionEntry: /(?:create|add|new|schedule).*(?:inspection).*(?:entry|task|appointment)/,
      createMaintenanceEntry: /(?:create|add|new|schedule).*(?:maintenance).*(?:entry|task|appointment)/,
      createJobCard: /(?:create|add|new|report).*(?:job.*card|issue|problem)/,
      updateTimetable: /(?:update|edit|modify).*(?:timetable|schedule)/,
      
      // Admin specific
      getUsers: /(?:show|get|list).*(?:users?|staff|employees?)/,
      getLogs: /(?:show|get|list).*(?:logs?|history|audit)/,
      
      // General help
      help: /help|what.*can.*do|commands?|options?/,
    };

    for (const [intent, pattern] of Object.entries(intents)) {
      if (pattern.test(lowerQuery)) {
        return intent;
      }
    }
    
    return "general";
  }

  // Main function calling dispatcher
  async handleUserQuery(query) {
    try {
      const intent = this.parseUserIntent(query);
      
      switch (intent) {
        case "getCleaningData":
          return await this.getCleaningSummary();
          
        case "getInspectionData":
          return await this.getInspectionSummary();
          
        case "getMaintenanceData":
          return await this.getMaintenanceSummary();
          
        case "getOperationsData":
          return await this.getOperationsSummary();
          
        case "getTimetable":
        case "getTodayTimetable":
          return await this.getTimetableSummary();
          
        case "getJobCards":
          return await this.getJobCardsSummary();

        // Lane management
        case "getCleaningLanes":
          return await this.getLanesSummary("cleaning");
        case "getInspectionLanes":
          return await this.getLanesSummary("inspection");
        case "getMaintenanceLanes":
          return await this.getLanesSummary("maintenance");
        case "getOperationsLanes":
          return await this.getLanesSummary("operations");
          
        case "checkTrainStatus":
          const trainMatch = query.match(/train.*?(\d+)/i);
          if (trainMatch) {
            return await this.checkTrainStatus(trainMatch[1]);
          }
          return "Please specify a train number (e.g., 'status of train 123')";

        case "checkTrainGeneral":
          return "Please specify a train number (e.g., 'status of train 123')";
          
        case "checkLaneStatus":
          return await this.getLaneStatusSummary();

        case "getSystemStatus":
          return await this.getSystemOverview();

        case "getMyTasks":
          return await this.getMyTasksSummary();

        case "getTrainLocations":
          return await this.getTrainLocationsSummary();

        // Admin functions
        case "getUsers":
          return await this.getUsersSummary();

        case "getLogs":
          return await this.getLogsSummary();

        // Creation helpers
        case "createCleaningEntry":
          return this.getCreationGuide("cleaning");
        case "createInspectionEntry":
          return this.getCreationGuide("inspection");
        case "createMaintenanceEntry":
          return this.getCreationGuide("maintenance");
        case "createJobCard":
          return this.getCreationGuide("jobcard");
        case "updateTimetable":
          return this.getCreationGuide("timetable");
          
        case "help":
          return this.getHelpMessage();
          
        default:
          return await this.getGeneralStatus();
      }
    } catch (error) {
      if (error.message.includes("Access denied")) {
        return `🚫 ${error.message}\n\nYou are logged in as: **${this.api.role}** in **${this.api.department}** department.`;
      }
      return `❌ Error: ${error.message}`;
    }
  }

  // Helper methods for different data summaries
  async getCleaningSummary() {
    const entries = await this.api.getCleaningEntries();
    const total = entries.length;
    const inProgress = entries.filter(e => e.enterd && !e.exited).length;
    const completed = entries.filter(e => e.enterd && e.exited).length;
    const scheduled = entries.filter(e => !e.enterd).length;

    return `🧽 **Cleaning Summary:**
📊 Total entries: ${total}
🚂 In progress: ${inProgress}
✅ Completed: ${completed}
📅 Scheduled: ${scheduled}

${entries.slice(0, 3).map(e => 
  `• Train ${e.train_id} - Lane ${e.lane} (${e.depot_name}) - ${e.enterd ? 'In Progress' : 'Scheduled'}`
).join('\n')}`;
  }

  async getInspectionSummary() {
    const entries = await this.api.getInspectionEntries();
    const jobCards = await this.api.getJobCards().catch(() => []);
    
    const total = entries.length;
    const openIssues = jobCards.filter(j => !j.closed_at).length;
    const closedIssues = jobCards.filter(j => j.closed_at).length;

    return `🔍 **Inspection Summary:**
📊 Total entries: ${total}
⚠️ Open issues: ${openIssues}
✅ Resolved issues: ${closedIssues}

Recent job cards:
${jobCards.slice(0, 3).map(j => 
  `• Train ${j.train}: ${j.description.substring(0, 50)}${j.description.length > 50 ? '...' : ''} - ${j.closed_at ? 'Closed' : 'Open'}`
).join('\n')}`;
  }

  async getMaintenanceSummary() {
    const entries = await this.api.getMaintenanceEntries();
    const total = entries.length;
    const inProgress = entries.filter(e => e.enterd && !e.exited).length;
    const scheduled = entries.filter(e => !e.enterd).length;

    return `🔧 **Maintenance Summary:**
📊 Total entries: ${total}
🔄 In progress: ${inProgress}
📅 Scheduled: ${scheduled}

${entries.slice(0, 3).map(e => 
  `• Train ${e.train_id} - Lane ${e.lane} (${e.depot_name}) - ${e.enterd ? 'Active' : 'Scheduled'}`
).join('\n')}`;
  }

  async getOperationsSummary() {
    const entries = await this.api.getOperationsEntries();
    const total = entries.length;
    const parked = entries.filter(e => e.enterd && !e.exited).length;

    return `🚉 **Operations Summary:**
📊 Total parking entries: ${total}
🚂 Currently parked: ${parked}

${entries.slice(0, 3).map(e => 
  `• Train ${e.train_id} - Lane ${e.lane} (${e.depot_name}) - ${e.enterd ? 'Parked' : 'Scheduled'}`
).join('\n')}`;
  }

  async getTimetableSummary() {
    const timetable = await this.api.getTimetable();
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = Object.values(timetable).flat().filter(entry => 
      entry.date.startsWith(today)
    );

    return `📅 **Timetable Summary:**
🚂 Today's schedules: ${todayEntries.length}

${todayEntries.slice(0, 5).map(t => 
  `• Train ${t.train_number}: ${t.starting_point} → ${t.ending_point} (${new Date(t.starting_time).toLocaleTimeString()})`
).join('\n')}`;
  }

  async getJobCardsSummary() {
    const jobCards = await this.api.getJobCards();
    const open = jobCards.filter(j => !j.closed_at).length;
    const recent = jobCards.slice(0, 5);

    return `🎫 **Job Cards Summary:**
⚠️ Open issues: ${open}
📝 Total cards: ${jobCards.length}

Recent issues:
${recent.map(j => 
  `• Train ${j.train}: ${j.description.substring(0, 60)}${j.description.length > 60 ? '...' : ''} - ${j.closed_at ? '✅ Closed' : '🔴 Open'}`
).join('\n')}`;
  }

  async checkTrainStatus(trainId) {
    try {
      const [cleaning, inspection, maintenance, operations] = await Promise.allSettled([
        this.api.getCleaningEntries().catch(() => []),
        this.api.getInspectionEntries().catch(() => []),
        this.api.getMaintenanceEntries().catch(() => []),
        this.api.getOperationsEntries().catch(() => []),
      ]);

      const allEntries = [
        ...(cleaning.value || []).map(e => ({...e, type: 'Cleaning'})),
        ...(inspection.value || []).map(e => ({...e, type: 'Inspection'})),
        ...(maintenance.value || []).map(e => ({...e, type: 'Maintenance'})),
        ...(operations.value || []).map(e => ({...e, type: 'Operations'})),
      ];

      const trainEntries = allEntries.filter(e => e.train_id == trainId);
      
      if (trainEntries.length === 0) {
        return `🚂 Train ${trainId}: No active or scheduled activities found.`;
      }

      const active = trainEntries.filter(e => e.enterd && !e.exited);
      const scheduled = trainEntries.filter(e => !e.enterd);

      return `🚂 **Train ${trainId} Status:**
${active.length > 0 ? 
  `🔄 Current activity: ${active[0].type} in Lane ${active[0].lane} at ${active[0].depot_name}` : 
  '✅ No active operations'
}

📅 Scheduled activities: ${scheduled.length}
${scheduled.slice(0, 3).map(e => 
  `• ${e.type} - Lane ${e.lane} (${new Date(e.scheduledStart).toLocaleDateString()})`
).join('\n')}`;
    } catch (error) {
      return `❌ Could not fetch status for Train ${trainId}: ${error.message}`;
    }
  }

  // Additional helper methods for new dynamic commands
  async getLanesSummary(type) {
    let lanes = [];
    switch(type) {
      case "cleaning":
        lanes = await this.api.getCleaningLanes();
        break;
      case "inspection":
        lanes = await this.api.makeRequest("/inspection/lanes/");
        break;
      case "maintenance":
        lanes = await this.api.makeRequest("/maintainance/lanes/");
        break;
      case "operations":
        lanes = await this.api.makeRequest("/operations/lanes/");
        break;
    }

    return `🛤️ **${type.charAt(0).toUpperCase() + type.slice(1)} Lanes:**
📊 Total lanes: ${lanes.length}

${lanes.map(lane => 
  `• Lane ${lane.bay_number || lane.lane_number} - ${lane.depot_name}`
).join('\n')}`;
  }

  async getLaneStatusSummary() {
    try {
      const [cleaningLanes, inspectionLanes, maintenanceLanes, operationsLanes] = await Promise.allSettled([
        this.api.getCleaningLanes().catch(() => []),
        this.api.makeRequest("/inspection/lanes/").catch(() => []),
        this.api.makeRequest("/maintainance/lanes/").catch(() => []),
        this.api.makeRequest("/operations/lanes/").catch(() => []),
      ]);

      const totalLanes = {
        cleaning: cleaningLanes.value?.length || 0,
        inspection: inspectionLanes.value?.length || 0,
        maintenance: maintenanceLanes.value?.length || 0,
        operations: operationsLanes.value?.length || 0,
      };

      return `🛤️ **Lane Status Overview:**
🧽 Cleaning lanes: ${totalLanes.cleaning}
🔍 Inspection lanes: ${totalLanes.inspection}
🔧 Maintenance lanes: ${totalLanes.maintenance}
🚉 Operations lanes: ${totalLanes.operations}

💡 For detailed lane info, try "show [department] lanes"`;
    } catch (error) {
      return `🛤️ **Lane Status:** Unable to fetch lane information. Check specific departments.`;
    }
  }

  async getSystemOverview() {
    const summaries = [];
    
    try {
      if (this.api.hasPermission("read", "cleaning")) {
        const cleaning = await this.api.getCleaningEntries().catch(() => []);
        const active = cleaning.filter(e => e.enterd && !e.exited).length;
        summaries.push(`🧽 Cleaning: ${cleaning.length} total, ${active} active`);
      }
      
      if (this.api.hasPermission("read", "inspection")) {
        const inspection = await this.api.getInspectionEntries().catch(() => []);
        const jobCards = await this.api.getJobCards().catch(() => []);
        const openIssues = jobCards.filter(j => !j.closed_at).length;
        summaries.push(`🔍 Inspection: ${inspection.length} entries, ${openIssues} open issues`);
      }
      
      if (this.api.hasPermission("read", "maintenance")) {
        const maintenance = await this.api.getMaintenanceEntries().catch(() => []);
        const active = maintenance.filter(e => e.enterd && !e.exited).length;
        summaries.push(`🔧 Maintenance: ${maintenance.length} total, ${active} active`);
      }
      
      if (this.api.hasPermission("read", "operations")) {
        const operations = await this.api.getOperationsEntries().catch(() => []);
        const parked = operations.filter(e => e.enterd && !e.exited).length;
        summaries.push(`🚉 Operations: ${operations.length} total, ${parked} parked`);
      }

      return `📊 **System Overview:**
${summaries.join('\n')}

🕒 Last updated: ${new Date().toLocaleTimeString()}
👤 Your access: ${this.api.role} (${this.api.department})`;
      
    } catch (error) {
      return `📊 **System Status:** Unable to fetch complete overview\n💡 Try specific department commands`;
    }
  }

  async getMyTasksSummary() {
    const userDept = this.api.department?.toLowerCase();
    let myTasks = [];

    try {
      switch(userDept) {
        case "cleaning":
          const cleaning = await this.api.getCleaningEntries();
          myTasks = cleaning.filter(e => !e.exited).slice(0, 5);
          return `📝 **My Cleaning Tasks:**
${myTasks.length > 0 ? 
  myTasks.map(t => `• Train ${t.train_id} - Lane ${t.lane} ${t.enterd ? '(In Progress)' : '(Scheduled)'}`).join('\n') :
  '✅ No active cleaning tasks'
}`;

        case "maintenance":
        case "rollingstock":
          const maintenance = await this.api.getMaintenanceEntries();
          myTasks = maintenance.filter(e => !e.exited).slice(0, 5);
          return `🔧 **My Maintenance Tasks:**
${myTasks.length > 0 ? 
  myTasks.map(t => `• Train ${t.train_id} - Lane ${t.lane} ${t.enterd ? '(In Progress)' : '(Scheduled)'}`).join('\n') :
  '✅ No active maintenance tasks'
}`;

        case "inspection":
          const inspection = await this.api.getInspectionEntries();
          const jobCards = await this.api.getJobCards();
          const openCards = jobCards.filter(j => !j.closed_at).slice(0, 3);
          return `🔍 **My Inspection Tasks:**
Active inspections: ${inspection.filter(e => !e.exited).length}
Open job cards: ${openCards.length}

${openCards.map(j => `• Train ${j.train}: ${j.description.substring(0, 40)}...`).join('\n')}`;

        default:
          return `📝 **My Tasks:** Please specify your department or use specific commands like "show cleaning data"`;
      }
    } catch (error) {
      return `📝 **My Tasks:** Unable to fetch tasks. Try: "show ${userDept} data"`;
    }
  }

  async getTrainLocationsSummary() {
    try {
      const [cleaning, inspection, maintenance, operations] = await Promise.allSettled([
        this.api.getCleaningEntries().catch(() => []),
        this.api.getInspectionEntries().catch(() => []),
        this.api.getMaintenanceEntries().catch(() => []),
        this.api.getOperationsEntries().catch(() => []),
      ]);

      const allActive = [
        ...(cleaning.value || []).filter(e => e.enterd && !e.exited).map(e => ({...e, location: 'Cleaning'})),
        ...(inspection.value || []).filter(e => e.enterd && !e.exited).map(e => ({...e, location: 'Inspection'})),
        ...(maintenance.value || []).filter(e => e.enterd && !e.exited).map(e => ({...e, location: 'Maintenance'})),
        ...(operations.value || []).filter(e => e.enterd && !e.exited).map(e => ({...e, location: 'Parked'})),
      ];

      return `📍 **Current Train Locations:**
🚂 Active trains: ${allActive.length}

${allActive.slice(0, 8).map(t => 
  `• Train ${t.train_id}: ${t.location} - Lane ${t.lane} (${t.depot_name})`
).join('\n')}

${allActive.length > 8 ? `\n... and ${allActive.length - 8} more trains` : ''}`;

    } catch (error) {
      return `📍 **Train Locations:** Unable to fetch current locations. Check individual departments.`;
    }
  }

  async getUsersSummary() {
    const users = await this.api.getUsers();
    const activeUsers = users.filter(u => u.active).length;
    const byDept = users.reduce((acc, user) => {
      const dept = user.Department?.name || 'Unknown';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});

    return `👥 **Users Summary:**
👤 Total users: ${users.length}
✅ Active users: ${activeUsers}

**By Department:**
${Object.entries(byDept).map(([dept, count]) => `• ${dept}: ${count} users`).join('\n')}

**Recent Users:**
${users.slice(0, 5).map(u => 
  `• ${u.username} (${u.designation?.name || 'No role'} - ${u.Department?.name || 'No dept'})`
).join('\n')}`;
  }

  async getLogsSummary() {
    const logs = await this.api.getLogs();
    const recent = logs.slice(0, 10);

    return `📋 **System Logs:**
📊 Total log entries: ${logs.length}

**Recent Activity:**
${recent.map(log => 
  `• ${log.user.username}: ${log.action} (${new Date(log.timestamp).toLocaleString()})`
).join('\n')}`;
  }

  getCreationGuide(type) {
    const guides = {
      cleaning: `🧽 **Create Cleaning Entry Guide:**

**Required Information:**
• Lane number
• Train ID
• Scheduled start time
• Scheduled end time

**Example:** "Schedule cleaning for train 15 in lane 2 from 10:00 AM to 12:00 PM"

**Note:** You need Supervisor+ permissions for your department.`,

      inspection: `🔍 **Create Inspection Entry Guide:**

**Required Information:**
• Lane number
• Train ID  
• Scheduled start time
• Scheduled end time

**Example:** "Schedule inspection for train 20 in lane 1 tomorrow at 2:00 PM"

**Note:** You need Supervisor+ permissions for inspection department.`,

      maintenance: `🔧 **Create Maintenance Entry Guide:**

**Required Information:**
• Lane number
• Train ID
• Scheduled start time  
• Scheduled end time

**Example:** "Schedule maintenance for train 8 in lane 3 next Monday at 9:00 AM"

**Note:** You need Supervisor+ permissions for maintenance department.`,

      jobcard: `🎫 **Create Job Card Guide:**

**Required Information:**
• Train ID
• Description of issue
• Photo (optional)

**Example:** "Report brake issue on train 12 with photo"

**Note:** Available to inspection department staff.`,

      timetable: `📅 **Update Timetable Guide:**

**Required Information:**
• Date
• Train number
• Starting point & time
• Ending point & time
• Train assignment

**Example:** "Update schedule for train 100 on Monday from Depot A to Depot B"

**Note:** Operations supervisors can update timetables.`
    };

    return guides[type] || "Creation guide not available for this item.";
  }

  getHelpMessage() {
    const userRole = this.api.role;
    const userDept = this.api.department;

    let commands = [];
    
    // Role-specific help
    if (userRole === 'admin') {
      commands = [
        '• "show cleaning data" - All cleaning activities',
        '• "show inspection entries" - All inspection activities', 
        '• "show maintenance data" - All maintenance activities',
        '• "show operations data" - All parking/operations',
        '• "show timetable" - Complete train schedules',
        '• "show job cards" - All inspection issues',
        '• "show users" - User management',
        '• "show logs" - System activity logs',
        '• "system status" - Complete overview',
        '• "status of train [number]" - Specific train tracking'
      ];
    } else if (userRole === 'supervisor') {
      const dept = userDept?.toLowerCase();
      commands.push('• "system status" - Overview of your access');
      commands.push('• "status of train [number]" - Track any train');
      commands.push('• "my tasks" - Your department tasks');
      
      if (dept === 'cleaning') {
        commands.push('• "show cleaning data" - Your cleaning schedule');
        commands.push('• "show cleaning lanes" - Available lanes');
        commands.push('• "create cleaning entry" - Schedule new task');
      } else if (dept === 'inspection') {
        commands.push('• "show inspection entries" - Your inspections');
        commands.push('• "show job cards" - Inspection issues');
        commands.push('• "create job card" - Report new issue');
        commands.push('• "show inspection lanes" - Available lanes');
      } else if (dept === 'maintenance' || dept === 'rollingstock') {
        commands.push('• "show maintenance data" - Your maintenance schedule');
        commands.push('• "show maintenance lanes" - Available lanes');
        commands.push('• "create maintenance entry" - Schedule work');
      } else if (dept === 'operations') {
        commands.push('• "show operations data" - Parking/operations');
        commands.push('• "show timetable" - Train schedules');
        commands.push('• "update timetable" - Modify schedules');
        commands.push('• "show operations lanes" - Parking lanes');
      }
    } else {
      // Regular user
      const dept = userDept?.toLowerCase();
      commands.push('• "status of train [number]" - Check train status');
      commands.push('• "my tasks" - Your assigned work');
      commands.push('• "check lane status" - Lane availability');
      
      if (dept === 'cleaning') {
        commands.push('• "show cleaning data" - Cleaning schedules');
      } else if (dept === 'inspection') {
        commands.push('• "show inspection entries" - Inspection work');
        commands.push('• "show job cards" - Current issues');
      } else if (dept === 'maintenance' || dept === 'rollingstock') {
        commands.push('• "show maintenance data" - Maintenance work');
      } else if (dept === 'operations') {
        commands.push('• "show timetable" - Today\'s schedules');
        commands.push('• "show train locations" - Where trains are');
      }
    }

    return `🤖 **ChatBot Help** (${userRole} - ${userDept})

**Available Commands:**
${commands.join('\n')}

**Examples:**
• "What's the status of train 123?"
• "Show me my tasks"
• "Any open job cards?"
• "System status"

**Quick Tips:**
• Use natural language - I'll understand!
• Try the quick command buttons below
• Ask specific questions for better results

**Your Access Level:** ${userRole}
**Department:** ${userDept}
${userRole === 'admin' ? '👑 Full system access' : 
  userRole === 'supervisor' ? '🔑 Department management access' : 
  '👀 Department view access'}`;
  }

  async getGeneralStatus() {
    try {
      const summaries = [];
      
      // Try to get data based on user's role and department
      if (this.api.hasPermission("read", "cleaning")) {
        const cleaning = await this.api.getCleaningEntries().catch(() => []);
        summaries.push(`🧽 Cleaning: ${cleaning.length} entries`);
      }
      
      if (this.api.hasPermission("read", "inspection")) {
        const inspection = await this.api.getInspectionEntries().catch(() => []);
        summaries.push(`🔍 Inspection: ${inspection.length} entries`);
      }
      
      if (this.api.hasPermission("read", "maintenance")) {
        const maintenance = await this.api.getMaintenanceEntries().catch(() => []);
        summaries.push(`🔧 Maintenance: ${maintenance.length} entries`);
      }
      
      if (this.api.hasPermission("read", "operations")) {
        const operations = await this.api.getOperationsEntries().catch(() => []);
        summaries.push(`🚉 Operations: ${operations.length} entries`);
      }

      return `📊 **System Overview:**
${summaries.join('\n')}

💡 Ask me specific questions like:
• "Show cleaning data"
• "Status of train 123"
• "Show job cards"
• Type "help" for more commands`;
      
    } catch (error) {
      return `🤖 I'm here to help! Type "help" to see what I can do for you.`;
    }
  }
}

// Export the classes
export { Platform404API, ChatBotTools };