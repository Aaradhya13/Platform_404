// // import React, { useState } from "react";

// // const ChatBot = () => {
// //   const [open, setOpen] = useState(false);
// //   const [messages, setMessages] = useState([]);
// //   const [input, setInput] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   const role = localStorage.getItem("role") || "guest";
// //   const department = localStorage.getItem("department") || "general";

// //   const sendMessage = async () => {
// //     if (!input.trim()) return;

// //     // Add user message
// //     const userMsg = { sender: "user", text: input };
// //     setMessages((prev) => [...prev, userMsg]);
// //     setInput("");
// //     setLoading(true);

// //     try {
// //       // Call Groq API
// //       const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${import.meta.env.VITE_GROQ_API}`, // <-- Your Groq API Key
// //         },
// //         body: JSON.stringify({
// //           model: "llama-3.1-8b-instant", // fast + cheap model
// //           messages: [
// //             {
// //               role: "system",
// //               content: `You are an assistant for ${role} in ${department}. 
// //               Always give practical and short step-by-step guidance.`,
// //             },
// //             { role: "user", content: input },
// //           ],
// //         }),
// //       });

// //       const data = await res.json();
// //       const botReply =
// //         data.choices?.[0]?.message?.content || "⚠️ Sorry, no reply.";

// //       setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
// //     } catch (err) {
// //       console.error("Chatbot error:", err);
// //       setMessages((prev) => [
// //         ...prev,
// //         { sender: "bot", text: "❌ Error: Could not connect to Groq API." },
// //       ]);
// //     }

// //     setLoading(false);
// //   };

// //   return (
// //     <div className="fixed bottom-4 right-4">
// //       {/* Toggle Button */}
// //       <button
// //         className="bg-blue-600 text-white p-3 rounded-full shadow-lg"
// //         onClick={() => setOpen(!open)}
// //       >
// //         💬
// //       </button>

// //       {/* Chat Window */}
// //       {open && (
// //         <div className="w-80 h-96 bg-white border shadow-lg rounded-lg flex flex-col">
// //           {/* Messages */}
// //           <div className="flex-1 overflow-y-auto p-2">
// //             {messages.map((msg, i) => (
// //               <div
// //                 key={i}
// //                 className={`p-2 my-1 rounded ${
// //                   msg.sender === "user"
// //                     ? "bg-blue-100 text-right"
// //                     : "bg-gray-200 text-left"
// //                 }`}
// //               >
// //                 {msg.text}
// //               </div>
// //             ))}
// //             {loading && (
// //               <div className="p-2 my-1 rounded bg-gray-100 italic">...</div>
// //             )}
// //           </div>

// //           {/* Input */}
// //           <div className="p-2 border-t flex">
// //             <input
// //               className="flex-1 border rounded p-2"
// //               value={input}
// //               onChange={(e) => setInput(e.target.value)}
// //               placeholder="Ask me..."
// //               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
// //             />
// //             <button
// //               onClick={sendMessage}
// //               className="ml-2 bg-blue-600 text-white px-4 rounded"
// //               disabled={loading}
// //             >
// //               Send
// //             </button>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default ChatBot;
// import React, { useState, useEffect, useRef } from "react";
// import { ChatBotTools } from './services/apichat'; // Import the API tools

// const ChatBot = () => {
//   const [open, setOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const messagesEndRef = useRef(null);

//   const role = localStorage.getItem("role") || "guest";
//   const department = localStorage.getItem("department") || "general";
//   const username = localStorage.getItem("username") || "User";
//   const token = localStorage.getItem("token");

//   // Initialize API tools
//   const [tools, setTools] = useState(null);

//   useEffect(() => {
//     // Check authentication
//     if (token && role !== "guest") {
//       setIsAuthenticated(true);
//       setTools(new ChatBotTools());
      
//       // Add welcome message
//       setMessages([{
//         sender: "bot",
//         text: `👋 Hello ${username}! I'm your Sancharam assistant.\n\n🔑 Logged in as: **${role}** in **${department}** department.\n\nI can help you with:\n• Checking schedules and entries\n• Train status updates\n• Job cards and maintenance info\n• Operations data\n\nType "help" to see all available commands!`,
//         timestamp: new Date().toLocaleTimeString()
//       }]);
//     } else {
//       setIsAuthenticated(false);
//       setMessages([{
//         sender: "bot",
//         text: "🔒 Please log in to access Sancharam data.\n\nI'll still be here to help with general questions!",
//         timestamp: new Date().toLocaleTimeString()
//       }]);
//     }
//   }, [token, role, department, username]);

//   // Auto-scroll to bottom of messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     // Add user message
//     const userMsg = { 
//       sender: "user", 
//       text: input, 
//       timestamp: new Date().toLocaleTimeString() 
//     };
//     setMessages((prev) => [...prev, userMsg]);
    
//     const currentInput = input;
//     setInput("");
//     setLoading(true);

//     try {
//       let botReply = "";
      
//       if (isAuthenticated && tools) {
//         // Try to handle query with API tools first
//         try {
//           const apiResponse = await tools.handleUserQuery(currentInput);
//           botReply = apiResponse;
//         } catch (apiError) {
//           console.log("API tools failed, falling back to Groq:", apiError);
//           // If API tools fail, fall back to Groq with context
//           botReply = await getGroqResponse(currentInput, true);
//         }
//       } else {
//         // For unauthenticated users or general queries, use Groq
//         botReply = await getGroqResponse(currentInput, false);
//       }

//       setMessages((prev) => [...prev, { 
//         sender: "bot", 
//         text: botReply,
//         timestamp: new Date().toLocaleTimeString()
//       }]);
      
//     } catch (err) {
//       console.error("Chatbot error:", err);
//       setMessages((prev) => [
//         ...prev,
//         { 
//           sender: "bot", 
//           text: "❌ Sorry, I encountered an error. Please try again or contact support.",
//           timestamp: new Date().toLocaleTimeString()
//         },
//       ]);
//     }

//     setLoading(false);
//   };

//   const getGroqResponse = async (query, hasApiAccess) => {
//     const systemPrompt = hasApiAccess 
//       ? `You are a helpful assistant for Sancharam railway management system. 
//          The user is ${role} in ${department} department.
         
//          If the user asks about:
//          - Data, schedules, entries, status - suggest they use specific commands like "show cleaning data" or "status of train [number]"
//          - General help - provide guidance on available features
//          - Technical questions - provide helpful information
         
//          Keep responses concise and professional. Always suggest specific commands when appropriate.`
//       : `You are a helpful general assistant. The user is not currently logged into Sancharam system.
//          Provide general help and information, but remind them to log in for specific railway data.`;

//     try {
//       const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${import.meta.env.VITE_GROQ_API}`,
//         },
//         body: JSON.stringify({
//           model: "llama-3.1-8b-instant",
//           messages: [
//             { role: "system", content: systemPrompt },
//             { role: "user", content: query },
//           ],
//           max_tokens: 512,
//           temperature: 0.7,
//         }),
//       });

//       const data = await res.json();
//       return data.choices?.[0]?.message?.content || "⚠️ Sorry, I couldn't process that request.";
      
//     } catch (error) {
//       throw new Error("Failed to get response from AI service");
//     }
//   };

//   const clearChat = () => {
//     setMessages(isAuthenticated ? [{
//       sender: "bot",
//       text: `Chat cleared! 🧹\n\nI'm still here to help with Sancharam data.\nType "help" for available commands.`,
//       timestamp: new Date().toLocaleTimeString()
//     }] : [{
//       sender: "bot",
//       text: "Chat cleared! Please log in to access Sancharam features.",
//       timestamp: new Date().toLocaleTimeString()
//     }]);
//   };

//   const quickCommands = [
//     { label: "Help", command: "help" },
//     { label: "Show Cleaning", command: "show cleaning data" },
//     { label: "Show Timetable", command: "show timetable" },
//     { label: "Job Cards", command: "show job cards" },
//   ];

//   return (
//     <div className="fixed bottom-4 right-4 z-50">
//       {/* Toggle Button */}
//       <button
//         className={`${
//           open ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
//         } text-white p-4 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105`}
//         onClick={() => setOpen(!open)}
//         title={open ? "Close Chat" : "Open Sancharam Assistant"}
//       >
//         {open ? "✕" : "🤖"}
//       </button>

//       {/* Chat Window */}
//       {open && (
//         <div className="w-96 h-[32rem] bg-white border border-gray-300 shadow-2xl rounded-lg flex flex-col mb-4 animate-fade-in">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex justify-between items-center">
//             <div>
//               <h3 className="font-bold text-lg">Sancharam Assistant</h3>
//               <p className="text-sm text-blue-100">
//                 {isAuthenticated ? `${role} • ${department}` : "Not authenticated"}
//               </p>
//             </div>
//             <div className="flex gap-2">
//               <button
//                 onClick={clearChat}
//                 className="text-blue-100 hover:text-white p-1"
//                 title="Clear chat"
//               >
//                 🧹
//               </button>
//             </div>
//           </div>

//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
//             {messages.map((msg, i) => (
//               <div
//                 key={i}
//                 className={`mb-3 ${
//                   msg.sender === "user" ? "text-right" : "text-left"
//                 }`}
//               >
//                 <div
//                   className={`inline-block max-w-[85%] p-3 rounded-lg ${
//                     msg.sender === "user"
//                       ? "bg-blue-600 text-white rounded-br-sm"
//                       : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm"
//                   }`}
//                 >
//                   <div className="whitespace-pre-wrap text-sm leading-relaxed">
//                     {msg.text}
//                   </div>
//                   {msg.timestamp && (
//                     <div className={`text-xs mt-1 ${
//                       msg.sender === "user" ? "text-blue-100" : "text-gray-500"
//                     }`}>
//                       {msg.timestamp}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
            
//             {loading && (
//               <div className="text-left mb-3">
//                 <div className="inline-block bg-gray-200 text-gray-600 p-3 rounded-lg rounded-bl-sm">
//                   <div className="flex items-center gap-2">
//                     <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
//                     <span>Thinking...</span>
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Quick Commands */}
//           {isAuthenticated && (
//             <div className="p-2 border-t border-gray-200 bg-gray-50">
//               <div className="flex flex-wrap gap-1">
//                 {quickCommands.map((cmd, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setInput(cmd.command)}
//                     className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
//                     title={`Click to use: ${cmd.command}`}
//                   >
//                     {cmd.label}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Input Area */}
//           <div className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
//             <div className="flex gap-2">
//               <input
//                 className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder={isAuthenticated ? "Ask me about Sancharam..." : "Ask me anything..."}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !e.shiftKey) {
//                     e.preventDefault();
//                     sendMessage();
//                   }
//                 }}
//                 disabled={loading}
//                 maxLength={500}
//               />
//               <button
//                 onClick={sendMessage}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
//                 disabled={loading || !input.trim()}
//                 title="Send message (Enter)"
//               >
//                 {loading ? "..." : "Send"}
//               </button>
//             </div>
            
//             {/* Character counter */}
//             {input.length > 400 && (
//               <div className="text-xs text-gray-500 mt-1 text-right">
//                 {input.length}/500
//               </div>
//             )}
            
//             {/* Status indicator */}
//             <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
//               <span>
//                 {isAuthenticated ? 
//                   `✅ Connected to Sancharam` : 
//                   `⚠️ Limited access - please log in`
//                 }
//               </span>
//               <span className={`w-2 h-2 rounded-full ${
//                 isAuthenticated ? 'bg-green-500' : 'bg-yellow-500'
//               }`}></span>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Notification badge for new features */}
//       {!open && isAuthenticated && (
//         <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
//           AI
//         </div>
//       )}
      
//       <style jsx>{`
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fade-in {
//           animation: fade-in 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ChatBot;
// import React, { useState, useEffect, useRef } from "react";
// import { ChatBotTools } from './services/apichat'; // Import the API tools

// // Quick Commands Dropdown Component
// const QuickCommandsDropdown = ({ quickCommands, role, department, setInput }) => {
//   const [isOpen, setIsOpen] = useState(false);
  
//   return (
//     <div className="p-4 border-t-2 bg-gradient-to-r from-gray-50 to-gray-100 relative"
//          style={{ borderColor: '#24B6C9' }}>
      
//       {/* Dropdown Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full bg-white border-2 px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between shadow-md hover:shadow-lg transform hover:scale-105 font-bold"
//         style={{ 
//           borderColor: '#24B6C9',
//           color: '#24B6C9'
//         }}
//         onMouseEnter={(e) => {
//           e.target.style.background = '#24B6C9';
//           e.target.style.color = 'white';
//         }}
//         onMouseLeave={(e) => {
//           e.target.style.background = 'white';
//           e.target.style.color = '#24B6C9';
//         }}
//       >
//         <div className="flex items-center gap-2">
//           <span className="text-lg">⚡</span>
//           <span className="text-sm">Quick Commands ({role})</span>
//         </div>
//         <span className={`text-lg transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
//           ▼
//         </span>
//       </button>

//       {/* Dropdown Content */}
//       {isOpen && (
//         <div className="absolute right-0 top-16 w-80 bg-white border-2 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto animate-dropdown"
//              style={{ borderColor: '#24B6C9' }}>
          
//           {/* Header */}
//           <div className="p-3 border-b-2 text-center font-bold text-sm"
//                style={{ 
//                  background: '#24B6C9',
//                  color: 'white',
//                  borderColor: '#24B6C9'
//                }}>
//             {department} Department Commands
//           </div>

//           {/* Commands List */}
//           <div className="p-2">
//             {quickCommands.map((cmd, i) => (
//               <button
//                 key={i}
//                 onClick={() => {
//                   setInput(cmd.command);
//                   setIsOpen(false);
//                 }}
//                 className="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 hover:shadow-md font-medium mb-1"
//                 style={{ color: '#24B6C9' }}
//                 title={`Click to use: ${cmd.command}`}
//                 onMouseEnter={(e) => {
//                   e.target.style.background = '#24B6C9';
//                   e.target.style.color = 'white';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.target.style.background = 'transparent';
//                   e.target.style.color = '#24B6C9';
//                 }}
//               >
//                 <span className="text-lg w-6 text-center">{cmd.icon}</span>
//                 <div className="flex-1">
//                   <div className="font-bold text-sm">{cmd.label}</div>
//                   <div className="text-xs opacity-70 font-normal">{cmd.command}</div>
//                 </div>
//               </button>
//             ))}
//           </div>

//           {/* Role indicator */}
//           <div className="p-3 border-t-2 text-center text-xs font-bold"
//                style={{ 
//                  color: '#24B6C9',
//                  borderColor: '#24B6C9',
//                  background: 'rgba(36, 182, 201, 0.1)'
//                }}>
//             {role === "admin" && "👑 Full System Access"} 
//             {role === "supervisor" && "🔑 Department Management"}
//             {role !== "admin" && role !== "supervisor" && "👀 Department View Access"}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const ChatBot = () => {
//   const [open, setOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const messagesEndRef = useRef(null);

//   const role = localStorage.getItem("role") || "guest";
//   const department = localStorage.getItem("department") || "general";
//   const username = localStorage.getItem("username") || "User";
//   const token = localStorage.getItem("token");

//   // Initialize API tools
//   const [tools, setTools] = useState(null);

//   useEffect(() => {
//     // Check authentication
//     if (token && role !== "guest") {
//       setIsAuthenticated(true);
//       setTools(new ChatBotTools());
      
//       // Add welcome message
//       setMessages([{
//         sender: "bot",
//         text: `👋 Hello ${username}! I'm your Sancharam assistant.\n\n🔑 Logged in as: **${role}** in **${department}** department.\n\nI can help you with:\n• Checking schedules and entries\n• Train status updates\n• Job cards and maintenance info\n• Operations data\n\nType "help" to see all available commands!`,
//         timestamp: new Date().toLocaleTimeString()
//       }]);
//     } else {
//       setIsAuthenticated(false);
//       setMessages([{
//         sender: "bot",
//         text: "🔒 Please log in to access Sancharam data.\n\nI'll still be here to help with general questions!",
//         timestamp: new Date().toLocaleTimeString()
//       }]);
//     }
//   }, [token, role, department, username]);

//   // Auto-scroll to bottom of messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     // Add user message
//     const userMsg = { 
//       sender: "user", 
//       text: input, 
//       timestamp: new Date().toLocaleTimeString() 
//     };
//     setMessages((prev) => [...prev, userMsg]);
    
//     const currentInput = input;
//     setInput("");
//     setLoading(true);

//     try {
//       let botReply = "";
      
//       if (isAuthenticated && tools) {
//         // Try to handle query with API tools first
//         try {
//           const apiResponse = await tools.handleUserQuery(currentInput);
//           botReply = apiResponse;
//         } catch (apiError) {
//           console.log("API tools failed, falling back to Groq:", apiError);
//           // If API tools fail, fall back to Groq with context
//           botReply = await getGroqResponse(currentInput, true);
//         }
//       } else {
//         // For unauthenticated users or general queries, use Groq
//         botReply = await getGroqResponse(currentInput, false);
//       }

//       setMessages((prev) => [...prev, { 
//         sender: "bot", 
//         text: botReply,
//         timestamp: new Date().toLocaleTimeString()
//       }]);
      
//     } catch (err) {
//       console.error("Chatbot error:", err);
//       setMessages((prev) => [
//         ...prev,
//         { 
//           sender: "bot", 
//           text: "❌ Sorry, I encountered an error. Please try again or contact support.",
//           timestamp: new Date().toLocaleTimeString()
//         },
//       ]);
//     }

//     setLoading(false);
//   };

//   const getGroqResponse = async (query, hasApiAccess) => {
//     const systemPrompt = hasApiAccess 

//       ? `You are a helpful assistant for Sancharam railway management system. 
//          The user is ${role} in ${department} department.
         
//          If the user asks about:
//          - Data, schedules, entries, status - suggest they use specific commands like "show cleaning data" or "status of train [number]"
//          - General help - provide guidance on available features
//          - Technical questions - provide helpful information
         
//          Keep responses concise and professional. Always suggest specific commands when appropriate.`
//       : `You are a helpful general assistant. The user is not currently logged into Sancharam system.
//          Provide general help and information, but remind them to log in for specific railway data.`;

//     try {
//       const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${import.meta.env.VITE_GROQ_API}`,
//         },
//         body: JSON.stringify({
//           model: "openai/gpt-oss-20b",
//           messages: [
//             { role: "system", content: systemPrompt },
//             { role: "user", content: query },
//           ],
//           max_tokens: 512,
//           temperature: 0.7,
//         }),
//       });

//       const data = await res.json();
//       return data.choices?.[0]?.message?.content || "⚠️ Sorry, I couldn't process that request.";
      
//     } catch (error) {
//       throw new Error("Failed to get response from AI service");
//     }
//   };

//   const clearChat = () => {
//     setMessages(isAuthenticated ? [{
//       sender: "bot",
//       text: `Chat cleared! 🧹\n\nI'm still here to help with Sancharam data.\nType "help" for available commands.`,
//       timestamp: new Date().toLocaleTimeString()
//     }] : [{
//       sender: "bot",
//       text: "Chat cleared! Please log in to access Sancharam features.",
//       timestamp: new Date().toLocaleTimeString()
//     }]);
//   };

//   // Dynamic quick commands based on role and department
//   const getQuickCommands = () => {
//     const commands = [];
    
//     // Always available commands
//     commands.push({ label: "Help", command: "help", icon: "❓" });
//     commands.push({ label: "Status", command: "system status", icon: "📊" });

//     // Role-based commands
//     if (role === "admin") {
//       // Admin gets access to everything
//       commands.push(
//         { label: "All Cleaning", command: "show cleaning data", icon: "🧽" },
//         { label: "All Inspections", command: "show inspection entries", icon: "🔍" },
//         { label: "All Maintenance", command: "show maintenance data", icon: "🔧" },
//         { label: "Operations", command: "show operations data", icon: "🚉" },
//         { label: "Timetable", command: "show timetable", icon: "📅" },
//         { label: "Job Cards", command: "show job cards", icon: "🎫" },
//         { label: "Users", command: "show users", icon: "👥" },
//         { label: "System Logs", command: "show logs", icon: "📋" }
//       );
//     } else if (role === "supervisor") {
//       // Supervisor gets department-specific + some cross-department read access
//       const dept = department.toLowerCase();
      
//       if (dept === "cleaning") {
//         commands.push(
//           { label: "My Cleaning", command: "show cleaning data", icon: "🧽" },
//           { label: "Cleaning Lanes", command: "show cleaning lanes", icon: "🛤️" },
//           { label: "Create Entry", command: "create cleaning entry", icon: "➕" }
//         );
//       }
      
//       if (dept === "inspection") {
//         commands.push(
//           { label: "Inspections", command: "show inspection entries", icon: "🔍" },
//           { label: "Job Cards", command: "show job cards", icon: "🎫" },
//           { label: "Create Issue", command: "create job card", icon: "⚠️" },
//           { label: "Inspection Lanes", command: "show inspection lanes", icon: "🛤️" }
//         );
//       }
      
//       if (dept === "maintenance" || dept === "rollingstock") {
//         commands.push(
//           { label: "Maintenance", command: "show maintenance data", icon: "🔧" },
//           { label: "Maintenance Lanes", command: "show maintenance lanes", icon: "🛤️" },
//           { label: "Schedule Work", command: "create maintenance entry", icon: "📝" }
//         );
//       }
      
//       if (dept === "operations") {
//         commands.push(
//           { label: "Operations", command: "show operations data", icon: "🚉" },
//           { label: "Timetable", command: "show timetable", icon: "📅" },
//           { label: "Edit Schedule", command: "update timetable", icon: "✏️" },
//           { label: "Parking Lanes", command: "show operations lanes", icon: "🅿️" }
//         );
//       }
      
//       // All supervisors can check train status and basic timetable
//       commands.push(
//         { label: "Train Status", command: "check train status", icon: "🚂" },
//         { label: "Today's Schedule", command: "show today timetable", icon: "📋" }
//       );
      
//     } else {
//       // Regular users get read-only access to their department
//       const dept = department.toLowerCase();
      
//       if (dept === "cleaning") {
//         commands.push(
//           { label: "Cleaning Schedule", command: "show cleaning data", icon: "🧽" },
//           { label: "My Tasks", command: "show my cleaning tasks", icon: "📝" }
//         );
//       }
      
//       if (dept === "inspection") {
//         commands.push(
//           { label: "Inspections", command: "show inspection entries", icon: "🔍" },
//           { label: "Job Cards", command: "show job cards", icon: "🎫" }
//         );
//       }
      
//       if (dept === "maintenance" || dept === "rollingstock") {
//         commands.push(
//           { label: "Maintenance", command: "show maintenance data", icon: "🔧" },
//           { label: "Work Orders", command: "show my maintenance tasks", icon: "📋" }
//         );
//       }
      
//       if (dept === "operations") {
//         commands.push(
//           { label: "Today's Timetable", command: "show timetable", icon: "📅" },
//           { label: "Train Locations", command: "show train locations", icon: "📍" }
//         );
//       }
      
//       // All users can check basic status
//       commands.push(
//         { label: "Check Train", command: "status of train", icon: "🚂" },
//         { label: "Lane Status", command: "check lane status", icon: "🛤️" }
//       );
//     }

//     // Limit to most relevant 8 commands to avoid UI clutter
//     return commands.slice(0, 8);
//   };

//   const quickCommands = getQuickCommands();

//   return (
//     <div className="fixed bottom-40 right-6 z-50">
//       {/* Toggle Button - Made bigger */}
//       <button
//         className={`group relative ${
//           open ? 'bg-white border-2 border-[#24B6C9]' : 'bg-[#24B6C9]'
//         } text-${open ? '[#24B6C9]' : 'white'} p-5 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl`}
//         onClick={() => setOpen(!open)}
//         title={open ? "Close Chat" : "Open Sancharam Assistant"}
//         style={{
//           background: open ? 'white' : '#24B6C9',
//           color: open ? '#24B6C9' : 'white',
//           borderColor: '#24B6C9',
//           width: '70px',
//           height: '70px'
//         }}
//       >
//         <div className="text-2xl font-bold">
//           {open ? "✕" : "🤖"}
//         </div>
//       </button>

//       {/* Chat Window - Made bigger and positioned higher */}
//       {open && (
//         <div className="w-[32rem] h-[42rem] bg-white border-2 rounded-2xl flex flex-col mb-6 animate-fade-in shadow-2xl overflow-hidden" 
//              style={{ borderColor: '#24B6C9' }}>
//           {/* Header */}
//           <div className="text-white p-5 flex justify-between items-center relative overflow-hidden"
//                style={{ background: '#24B6C9' }}>
//             {/* Background Pattern */}
//             <div className="absolute inset-0 opacity-10">
//               <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-white transform -translate-x-16 -translate-y-16"></div>
//               <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full bg-white transform translate-x-12 translate-y-12"></div>
//             </div>
            
//             <div className="relative z-10">
//               <h3 className="font-bold text-xl tracking-wide">Sancharam Assistant</h3>
//               <p className="text-sm opacity-90 mt-1">
//                 {isAuthenticated ? `${role} • ${department}` : "Not authenticated"}
//               </p>
//             </div>
//             <div className="flex gap-3 relative z-10">
//               <button
//                 onClick={clearChat}
//                 className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all duration-200 transform hover:scale-105"
//                 title="Clear chat"
//               >
//                 <span className="text-lg">🧹</span>
//               </button>
//             </div>
//           </div>

//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-gray-50 to-white">
//             {messages.map((msg, i) => (
//               <div
//                 key={i}
//                 className={`mb-4 ${
//                   msg.sender === "user" ? "text-right" : "text-left"
//                 }`}
//               >
//                 <div
//                   className={`inline-block max-w-[85%] p-4 rounded-2xl transition-all duration-200 hover:shadow-md ${
//                     msg.sender === "user"
//                       ? "text-white rounded-br-md shadow-lg"
//                       : "bg-white border-2 rounded-bl-md shadow-md hover:shadow-lg"
//                   }`}
//                   style={{
//                     background: msg.sender === "user" ? '#24B6C9' : 'white',
//                     borderColor: msg.sender === "bot" ? '#24B6C9' : 'transparent',
//                     color: msg.sender === "user" ? 'white' : '#333'
//                   }}
//                 >
//                   <div className="whitespace-pre-wrap text-sm leading-relaxed font-medium">
//                     {msg.text}
//                   </div>
//                   {msg.timestamp && (
//                     <div className={`text-xs mt-2 font-normal ${
//                       msg.sender === "user" ? "text-white opacity-80" : "opacity-60"
//                     }`}
//                          style={{ color: msg.sender === "user" ? 'rgba(255,255,255,0.8)' : '#666' }}>
//                       {msg.timestamp}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
            
//             {loading && (
//               <div className="text-left mb-4">
//                 <div className="inline-block bg-white border-2 p-4 rounded-2xl rounded-bl-md shadow-md"
//                      style={{ borderColor: '#24B6C9' }}>
//                   <div className="flex items-center gap-3">
//                     <div className="animate-spin w-5 h-5 border-2 rounded-full"
//                          style={{ 
//                            borderColor: '#24B6C9', 
//                            borderTopColor: 'transparent' 
//                          }}></div>
//                     <span style={{ color: '#24B6C9' }} className="font-medium">Thinking...</span>
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Quick Commands Dropdown - Dynamic based on role */}
//           {isAuthenticated && quickCommands.length > 0 && (
//             <QuickCommandsDropdown 
//               quickCommands={quickCommands}
//               role={role}
//               department={department}
//               setInput={setInput}
//             />
//           )}

//           {/* Input Area */}
//           <div className="p-5 border-t-2 bg-white"
//                style={{ borderColor: '#24B6C9' }}>
//             <div className="flex gap-3">
//               <input
//                 className="flex-1 border-2 rounded-xl p-4 text-sm focus:outline-none focus:ring-4 focus:ring-opacity-30 transition-all duration-200 font-medium"
//                 style={{ 
//                   borderColor: '#24B6C9',
//                   focusRingColor: '#24B6C9'
//                 }}
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder={isAuthenticated ? "Ask me about Sancharam..." : "Ask me anything..."}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !e.shiftKey) {
//                     e.preventDefault();
//                     sendMessage();
//                   }
//                 }}
//                 disabled={loading}
//                 maxLength={500}
//                 onFocus={(e) => {
//                   e.target.style.boxShadow = `0 0 0 4px rgba(36, 182, 201, 0.3)`;
//                 }}
//                 onBlur={(e) => {
//                   e.target.style.boxShadow = 'none';
//                 }}
//               />
//               <button
//                 onClick={sendMessage}
//                 className="text-white px-6 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-bold transform hover:scale-105 hover:shadow-lg"
//                 style={{ 
//                   background: loading || !input.trim() ? '#ccc' : '#24B6C9'
//                 }}
//                 disabled={loading || !input.trim()}
//                 title="Send message (Enter)"
//               >
//                 {loading ? "..." : "Send"}
//               </button>
//             </div>
            
//             {/* Character counter */}
//             {input.length > 400 && (
//               <div className="text-xs mt-2 text-right font-medium"
//                    style={{ color: '#24B6C9' }}>
//                 {input.length}/500
//               </div>
//             )}
            
//             {/* Status indicator */}
//             <div className="flex justify-between items-center mt-3 text-xs">
//               <span className="font-medium"
//                     style={{ color: '#24B6C9' }}>
//                 {isAuthenticated ? 
//                   `✅ Connected to Sancharam` : 
//                   `⚠️ Limited access - please log in`
//                 }
//               </span>
//               <span className={`w-3 h-3 rounded-full animate-pulse ${
//                 isAuthenticated ? '' : ''
//               }`}
//                     style={{ 
//                       background: isAuthenticated ? '#24B6C9' : '#ffa500'
//                     }}></span>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Notification badge for new features */}
//       {!open && isAuthenticated && (
//         <div className="absolute -top-2 -left-2 text-white text-xs rounded-full w-8 h-8 flex items-center justify-center animate-bounce font-bold shadow-lg"
//              style={{ background: '#24B6C9' }}>
//           AI
//         </div>
//       )}
      
//       <style jsx>{`
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: translateY(20px) scale(0.95);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0) scale(1);
//           }
//         }
        
//         @keyframes dropdown {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         .animate-fade-in {
//           animation: fade-in 0.4s cubic-bezier(0.4, 0, 0.2, 1);
//         }
        
//         .animate-dropdown {
//           animation: dropdown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ChatBot;
// import React, { useState, useEffect, useRef } from "react";
// import { ChatBotTools } from './services/apichat'; // Import the API tools

// // Quick Commands Dropdown Component
// const QuickCommandsDropdown = ({ quickCommands, role, department, setInput }) => {
//   const [isOpen, setIsOpen] = useState(false);
  
//   return (
//     <div className="p-4 border-t-2 bg-gradient-to-r from-gray-50 to-gray-100 relative"
//          style={{ borderColor: '#24B6C9' }}>
      
//       {/* Dropdown Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full bg-white border-2 px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between shadow-md hover:shadow-lg transform hover:scale-105 font-bold"
//         style={{ 
//           borderColor: '#24B6C9',
//           color: '#24B6C9'
//         }}
//         onMouseEnter={(e) => {
//           e.target.style.background = '#24B6C9';
//           e.target.style.color = 'white';
//         }}
//         onMouseLeave={(e) => {
//           e.target.style.background = 'white';
//           e.target.style.color = '#24B6C9';
//         }}
//       >
//         <div className="flex items-center gap-2">
//           <span className="text-lg">⚡</span>
//           <span className="text-sm">Quick Commands ({role})</span>
//         </div>
//         <span className={`text-lg transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
//           ▼
//         </span>
//       </button>

//       {/* Dropdown Content */}
//       {isOpen && (
//         <div className="absolute right-0 top-16 w-80 bg-white border-2 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto animate-dropdown"
//              style={{ borderColor: '#24B6C9' }}>
          
//           {/* Header */}
//           <div className="p-3 border-b-2 text-center font-bold text-sm"
//                style={{ 
//                  background: '#24B6C9',
//                  color: 'white',
//                  borderColor: '#24B6C9'
//                }}>
//             {department} Department Commands
//           </div>

//           {/* Commands List */}
//           <div className="p-2">
//             {quickCommands.map((cmd, i) => (
//               <button
//                 key={i}
//                 onClick={() => {
//                   setInput(cmd.command);
//                   setIsOpen(false);
//                 }}
//                 className="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 hover:shadow-md font-medium mb-1"
//                 style={{ color: '#24B6C9' }}
//                 title={`Click to use: ${cmd.command}`}
//                 onMouseEnter={(e) => {
//                   e.target.style.background = '#24B6C9';
//                   e.target.style.color = 'white';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.target.style.background = 'transparent';
//                   e.target.style.color = '#24B6C9';
//                 }}
//               >
//                 <span className="text-lg w-6 text-center">{cmd.icon}</span>
//                 <div className="flex-1">
//                   <div className="font-bold text-sm">{cmd.label}</div>
//                   <div className="text-xs opacity-70 font-normal">{cmd.command}</div>
//                 </div>
//               </button>
//             ))}
//           </div>

//           {/* Role indicator */}
//           <div className="p-3 border-t-2 text-center text-xs font-bold"
//                style={{ 
//                  color: '#24B6C9',
//                  borderColor: '#24B6C9',
//                  background: 'rgba(36, 182, 201, 0.1)'
//                }}>
//             {role === "admin" && "👑 Full System Access"} 
//             {role === "supervisor" && "🔑 Department Management"}
//             {role !== "admin" && role !== "supervisor" && "👀 Department View Access"}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const ChatBot = () => {
//   const [open, setOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const messagesEndRef = useRef(null);

//   const role = localStorage.getItem("role") || "guest";
//   const department = localStorage.getItem("department") || "general";
//   const username = localStorage.getItem("username") || "User";
//   const token = localStorage.getItem("token");
//   const path = window.location.pathname;

//   // Initialize API tools
//   const [tools, setTools] = useState(null);

//   useEffect(() => {
//     // Check authentication
//     if (token && role !== "guest") {
//       setIsAuthenticated(true);
//       setTools(new ChatBotTools());
      
//       // Add welcome message
//       setMessages([{
//         sender: "bot",
//         text: `👋 Hello ${username}! I'm your Sancharam assistant.\n\n🔑 Logged in as: **${role}** in **${department}** department.\n\nI can help you with:\n• Checking schedules and entries\n• Train status updates\n• Job cards and maintenance info\n• Operations data\n\nType "help" to see all available commands!`,
//         timestamp: new Date().toLocaleTimeString()
//       }]);
//     } else {
//       setIsAuthenticated(false);
//       setMessages([{
//         sender: "bot",
//         text: "🔒 Please log in to access Sancharam data.\n\nI'll still be here to help with general questions!",
//         timestamp: new Date().toLocaleTimeString()
//       }]);
//     }
//   }, [token, role, department, username]);

//   // Auto-scroll to bottom of messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     // Add user message
//     const userMsg = { 
//       sender: "user", 
//       text: input, 
//       timestamp: new Date().toLocaleTimeString() 
//     };
//     setMessages((prev) => [...prev, userMsg]);
    
//     const currentInput = input;
//     setInput("");
//     setLoading(true);

//     try {
//       let botReply = "";
      
//       if (isAuthenticated && tools) {
//         // Try to handle query with API tools first
//         try {
//           const apiResponse = await tools.handleUserQuery(currentInput);
//           botReply = apiResponse;
//         } catch (apiError) {
//           console.log("API tools failed, falling back to Groq:", apiError);
//           // If API tools fail, fall back to Groq with context
//           botReply = await getGroqResponse(currentInput, true);
//         }
//       } else {
//         // For unauthenticated users or general queries, use Groq
//         botReply = await getGroqResponse(currentInput, false);
//       }

//       setMessages((prev) => [...prev, { 
//         sender: "bot", 
//         text: botReply,
//         timestamp: new Date().toLocaleTimeString()
//       }]);
      
//     } catch (err) {
//       console.error("Chatbot error:", err);
//       setMessages((prev) => [
//         ...prev,
//         { 
//           sender: "bot", 
//           text: "❌ Sorry, I encountered an error. Please try again or contact support.",
//           timestamp: new Date().toLocaleTimeString()
//         },
//       ]);
//     }

//     setLoading(false);
//   };

//   const getGroqResponse = async (query, hasApiAccess) => {
//     const systemPrompt = hasApiAccess 

//       ? `You are a helpful assistant for Sancharam railway management system. 
//          The user is ${role} in ${department} department.
         
//          If the user asks about:
//          - Data, schedules, entries, status - suggest they use specific commands like "show cleaning data" or "status of train [number]"
//          - General help - provide guidance on available features
//          - Technical questions - provide helpful information
         
//          Keep responses concise and professional. Always suggest specific commands when appropriate.`
//       : `You are a helpful general assistant. The user is not currently logged into Sancharam system.
//          Provide general help and information, but remind them to log in for specific railway data.`;

//     try {
//       const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${import.meta.env.VITE_GROQ_API}`,
//         },
//         body: JSON.stringify({
//           model: "openai/gpt-oss-20b",
//           messages: [
//             { role: "system", content: systemPrompt },
//             { role: "user", content: query },
//           ],
//           max_tokens: 512,
//           temperature: 0.7,
//         }),
//       });

//       const data = await res.json();
//       return data.choices?.[0]?.message?.content || "⚠️ Sorry, I couldn't process that request.";
      
//     } catch (error) {
//       throw new Error("Failed to get response from AI service");
//     }
//   };

//   const clearChat = () => {
//     setMessages(isAuthenticated ? [{
//       sender: "bot",
//       text: `Chat cleared! 🧹\n\nI'm still here to help with Sancharam data.\nType "help" for available commands.`,
//       timestamp: new Date().toLocaleTimeString()
//     }] : [{
//       sender: "bot",
//       text: "Chat cleared! Please log in to access Sancharam features.",
//       timestamp: new Date().toLocaleTimeString()
//     }]);
//   };

//   // Dynamic quick commands based on role and department
//   const getQuickCommands = () => {
//     const commands = [];
    
//     // Always available commands
//     commands.push({ label: "Help", command: "help", icon: "❓" });
//     commands.push({ label: "Status", command: "system status", icon: "📊" });

//     // Role-based commands
//     if (role === "admin") {
//       // Admin gets access to everything
//       commands.push(
//         { label: "All Cleaning", command: "show cleaning data", icon: "🧽" },
//         { label: "All Inspections", command: "show inspection entries", icon: "🔍" },
//         { label: "All Maintenance", command: "show maintenance data", icon: "🔧" },
//         { label: "Operations", command: "show operations data", icon: "🚉" },
//         { label: "Timetable", command: "show timetable", icon: "📅" },
//         { label: "Job Cards", command: "show job cards", icon: "🎫" },
//         { label: "Users", command: "show users", icon: "👥" },
//         { label: "System Logs", command: "show logs", icon: "📋" }
//       );
//     } else if (role === "supervisor") {
//       // Supervisor gets department-specific + some cross-department read access
//       const dept = department.toLowerCase();
      
//       if (dept === "cleaning") {
//         commands.push(
//           { label: "My Cleaning", command: "show cleaning data", icon: "🧽" },
//           { label: "Cleaning Lanes", command: "show cleaning lanes", icon: "🛤️" },
//           { label: "Create Entry", command: "create cleaning entry", icon: "➕" }
//         );
//       }
      
//       if (dept === "inspection") {
//         commands.push(
//           { label: "Inspections", command: "show inspection entries", icon: "🔍" },
//           { label: "Job Cards", command: "show job cards", icon: "🎫" },
//           { label: "Create Issue", command: "create job card", icon: "⚠️" },
//           { label: "Inspection Lanes", command: "show inspection lanes", icon: "🛤️" }
//         );
//       }
      
//       if (dept === "maintenance" || dept === "rollingstock") {
//         commands.push(
//           { label: "Maintenance", command: "show maintenance data", icon: "🔧" },
//           { label: "Maintenance Lanes", command: "show maintenance lanes", icon: "🛤️" },
//           { label: "Schedule Work", command: "create maintenance entry", icon: "📝" }
//         );
//       }
      
//       if (dept === "operations") {
//         commands.push(
//           { label: "Operations", command: "show operations data", icon: "🚉" },
//           { label: "Timetable", command: "show timetable", icon: "📅" },
//           { label: "Edit Schedule", command: "update timetable", icon: "✏️" },
//           { label: "Parking Lanes", command: "show operations lanes", icon: "🅿️" }
//         );
//       }
      
//       // All supervisors can check train status and basic timetable
//       commands.push(
//         { label: "Train Status", command: "check train status", icon: "🚂" },
//         { label: "Today's Schedule", command: "show today timetable", icon: "📋" }
//       );
      
//     } else {
//       // Regular users get read-only access to their department
//       const dept = department.toLowerCase();
      
//       if (dept === "cleaning") {
//         commands.push(
//           { label: "Cleaning Schedule", command: "show cleaning data", icon: "🧽" },
//           { label: "My Tasks", command: "show my cleaning tasks", icon: "📝" }
//         );
//       }
      
//       if (dept === "inspection") {
//         commands.push(
//           { label: "Inspections", command: "show inspection entries", icon: "🔍" },
//           { label: "Job Cards", command: "show job cards", icon: "🎫" }
//         );
//       }
      
//       if (dept === "maintenance" || dept === "rollingstock") {
//         commands.push(
//           { label: "Maintenance", command: "show maintenance data", icon: "🔧" },
//           { label: "Work Orders", command: "show my maintenance tasks", icon: "📋" }
//         );
//       }
      
//       if (dept === "operations") {
//         commands.push(
//           { label: "Today's Timetable", command: "show timetable", icon: "📅" },
//           { label: "Train Locations", command: "show train locations", icon: "📍" }
//         );
//       }
      
//       // All users can check basic status
//       commands.push(
//         { label: "Check Train", command: "status of train", icon: "🚂" },
//         { label: "Lane Status", command: "check lane status", icon: "🛤️" }
//       );
//     }

//     // Limit to most relevant 8 commands to avoid UI clutter
//     return commands.slice(0, 8);
//   };

//   const quickCommands = getQuickCommands();
// if(path === "/" || path === "/login") {
//   return null; // Don't render the ChatBot on these paths
// }
//   return (
//     <div className="fixed bottom-40 right-6 z-50">
//       {/* Toggle Button - Made bigger */}
//       <button
//         className={`group relative ${
//           open ? 'bg-white border-2 border-[#24B6C9]' : 'bg-[#24B6C9]'
//         } text-${open ? '[#24B6C9]' : 'white'} p-5 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl`}
//         onClick={() => setOpen(!open)}
//         title={open ? "Close Chat" : "Open Sancharam Assistant"}
//         style={{
//           background: open ? 'white' : '#24B6C9',
//           color: open ? '#24B6C9' : 'white',
//           borderColor: '#24B6C9',
//           width: '70px',
//           height: '70px'
//         }}
//       >
//         <div className="text-2xl font-bold">
//           {open ? "✕" : "🤖"}
//         </div>
//       </button>

//       {/* Chat Window - Made bigger and positioned higher */}
//       {open && (
//         <div className="w-[32rem] h-[42rem] bg-white border-2 rounded-2xl flex flex-col mb-6 animate-fade-in shadow-2xl overflow-hidden" 
//              style={{ borderColor: '#24B6C9' }}>
//           {/* Header */}
//           <div className="text-white p-5 flex justify-between items-center relative overflow-hidden"
//                style={{ background: '#24B6C9' }}>
//             {/* Background Pattern */}
//             <div className="absolute inset-0 opacity-10">
//               <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-white transform -translate-x-16 -translate-y-16"></div>
//               <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full bg-white transform translate-x-12 translate-y-12"></div>
//             </div>
            
//             <div className="relative z-10">
//               <h3 className="font-bold text-xl tracking-wide">Sancharam Assistant</h3>
//               <p className="text-sm opacity-90 mt-1">
//                 {isAuthenticated ? `${role} • ${department}` : "Not authenticated"}
//               </p>
//             </div>
//             <div className="flex gap-3 relative z-10">
//               <button
//                 onClick={clearChat}
//                 className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all duration-200 transform hover:scale-105"
//                 title="Clear chat"
//               >
//                 <span className="text-lg">🧹</span>
//               </button>
//             </div>
//           </div>

//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-gray-50 to-white">
//             {messages.map((msg, i) => (
//               <div
//                 key={i}
//                 className={`mb-4 ${
//                   msg.sender === "user" ? "text-right" : "text-left"
//                 }`}
//               >
//                 <div
//                   className={`inline-block max-w-[85%] p-4 rounded-2xl transition-all duration-200 hover:shadow-md ${
//                     msg.sender === "user"
//                       ? "text-white rounded-br-md shadow-lg"
//                       : "bg-white border-2 rounded-bl-md shadow-md hover:shadow-lg"
//                   }`}
//                   style={{
//                     background: msg.sender === "user" ? '#24B6C9' : 'white',
//                     borderColor: msg.sender === "bot" ? '#24B6C9' : 'transparent',
//                     color: msg.sender === "user" ? 'white' : '#333'
//                   }}
//                 >
//                   <div className="whitespace-pre-wrap text-sm leading-relaxed font-medium">
//                     {msg.text}
//                   </div>
//                   {msg.timestamp && (
//                     <div className={`text-xs mt-2 font-normal ${
//                       msg.sender === "user" ? "text-white opacity-80" : "opacity-60"
//                     }`}
//                          style={{ color: msg.sender === "user" ? 'rgba(255,255,255,0.8)' : '#666' }}>
//                       {msg.timestamp}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
            
//             {loading && (
//               <div className="text-left mb-4">
//                 <div className="inline-block bg-white border-2 p-4 rounded-2xl rounded-bl-md shadow-md"
//                      style={{ borderColor: '#24B6C9' }}>
//                   <div className="flex items-center gap-3">
//                     <div className="animate-spin w-5 h-5 border-2 rounded-full"
//                          style={{ 
//                            borderColor: '#24B6C9', 
//                            borderTopColor: 'transparent' 
//                          }}></div>
//                     <span style={{ color: '#24B6C9' }} className="font-medium">Thinking...</span>
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Quick Commands Dropdown - Dynamic based on role */}
//           {isAuthenticated && quickCommands.length > 0 && (
//             <QuickCommandsDropdown 
//               quickCommands={quickCommands}
//               role={role}
//               department={department}
//               setInput={setInput}
//             />
//           )}

//           {/* Input Area */}
//           <div className="p-5 border-t-2 bg-white"
//                style={{ borderColor: '#24B6C9' }}>
//             <div className="flex gap-3">
//               <input
//                 className="flex-1 border-2 rounded-xl p-4 text-sm focus:outline-none focus:ring-4 focus:ring-opacity-30 transition-all duration-200 font-medium"
//                 style={{ 
//                   borderColor: '#24B6C9',
//                   focusRingColor: '#24B6C9'
//                 }}
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder={isAuthenticated ? "Ask me about Sancharam..." : "Ask me anything..."}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !e.shiftKey) {
//                     e.preventDefault();
//                     sendMessage();
//                   }
//                 }}
//                 disabled={loading}
//                 maxLength={500}
//                 onFocus={(e) => {
//                   e.target.style.boxShadow = `0 0 0 4px rgba(36, 182, 201, 0.3)`;
//                 }}
//                 onBlur={(e) => {
//                   e.target.style.boxShadow = 'none';
//                 }}
//               />
//               <button
//                 onClick={sendMessage}
//                 className="text-white px-6 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-bold transform hover:scale-105 hover:shadow-lg"
//                 style={{ 
//                   background: loading || !input.trim() ? '#ccc' : '#24B6C9'
//                 }}
//                 disabled={loading || !input.trim()}
//                 title="Send message (Enter)"
//               >
//                 {loading ? "..." : "Send"}
//               </button>
//             </div>
            
//             {/* Character counter */}
//             {input.length > 400 && (
//               <div className="text-xs mt-2 text-right font-medium"
//                    style={{ color: '#24B6C9' }}>
//                 {input.length}/500
//               </div>
//             )}
            
//             {/* Status indicator */}
//             <div className="flex justify-between items-center mt-3 text-xs">
//               <span className="font-medium"
//                     style={{ color: '#24B6C9' }}>
//                 {isAuthenticated ? 
//                   `✅ Connected to Sancharam` : 
//                   `⚠️ Limited access - please log in`
//                 }
//               </span>
//               <span className={`w-3 h-3 rounded-full animate-pulse ${
//                 isAuthenticated ? '' : ''
//               }`}
//                     style={{ 
//                       background: isAuthenticated ? '#24B6C9' : '#ffa500'
//                     }}></span>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Notification badge for new features */}
//       {!open && isAuthenticated && (
//         <div className="absolute -top-2 -left-2 text-white text-xs rounded-full w-8 h-8 flex items-center justify-center animate-bounce font-bold shadow-lg"
//              style={{ background: '#24B6C9' }}>
//           AI
//         </div>
//       )}
      
//       <style jsx>{`
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: translateY(20px) scale(0.95);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0) scale(1);
//           }
//         }
        
//         @keyframes dropdown {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         .animate-fade-in {
//           animation: fade-in 0.4s cubic-bezier(0.4, 0, 0.2, 1);
//         }
        
//         .animate-dropdown {
//           animation: dropdown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ChatBot;
import React, { useState, useEffect, useRef } from "react";
import { ChatBotTools } from './services/apichat'; // Import the API tools

// Quick Commands Dropdown Component
const QuickCommandsDropdown = ({ quickCommands, role, department, setInput }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-t border-gray-200 bg-gray-50">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
      >
        <div className="flex items-center gap-2">
          <span className="text-blue-500">⚡</span>
          <span className="text-sm font-medium text-gray-700">Quick Commands</span>
          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">{role}</span>
        </div>
        <span className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="border-t border-gray-200 bg-white max-h-48 overflow-y-auto">
          <div className="p-2 space-y-1">
            {quickCommands.map((cmd, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(cmd.command);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center gap-3 group"
                title={`Click to use: ${cmd.command}`}
              >
                <span className="text-lg">{cmd.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600">{cmd.label}</div>
                  <div className="text-xs text-gray-500 truncate">{cmd.command}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const messagesEndRef = useRef(null);

  const role = localStorage.getItem("role") || "guest";
  const department = localStorage.getItem("department") || "general";
  const username = localStorage.getItem("username") || "User";
  const token = localStorage.getItem("token");
  const path = window.location.pathname;

  // Initialize API tools
  const [tools, setTools] = useState(null);

  // Don't render on login or home page
  if (path === "/" || path === "/login") {
    return null;
  }

  useEffect(() => {
    // Check authentication
    if (token && role !== "guest") {
      setIsAuthenticated(true);
      setTools(new ChatBotTools());
      
      // Add welcome message
      setMessages([{
        sender: "bot",
        text: `Hello ${username}! I'm your Sancharam assistant.\n\nLogged in as: ${role} in ${department} department.\n\nI can help you with:\n• Checking schedules and entries\n• Train status updates\n• Job cards and maintenance info\n• Operations data\n\nType "help" to see all available commands!`,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } else {
      setIsAuthenticated(false);
      setMessages([{
        sender: "bot",
        text: "Please log in to access Sancharam data.\n\nI'll still be here to help with general questions!",
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  }, [token, role, department, username]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMsg = { 
      sender: "user", 
      text: input, 
      timestamp: new Date().toLocaleTimeString() 
    };
    setMessages((prev) => [...prev, userMsg]);
    
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      let botReply = "";
      
      if (isAuthenticated && tools) {
        // Try to handle query with API tools first
        try {
          const apiResponse = await tools.handleUserQuery(currentInput);
          botReply = apiResponse;
        } catch (apiError) {
          console.log("API tools failed, falling back to Groq:", apiError);
          // If API tools fail, fall back to Groq with context
          botReply = await getGroqResponse(currentInput, true);
        }
      } else {
        // For unauthenticated users or general queries, use Groq
        botReply = await getGroqResponse(currentInput, false);
      }

      setMessages((prev) => [...prev, { 
        sender: "bot", 
        text: botReply,
        timestamp: new Date().toLocaleTimeString()
      }]);
      
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((prev) => [
        ...prev,
        { 
          sender: "bot", 
          text: "Sorry, I encountered an error. Please try again or contact support.",
          timestamp: new Date().toLocaleTimeString()
        },
      ]);
    }

    setLoading(false);
  };

  const getGroqResponse = async (query, hasApiAccess) => {
    const systemPrompt = hasApiAccess 
      ? `You are a helpful assistant for Sancharam railway management system. 
         The user is ${role} in ${department} department.
         
         If the user asks about:
         - Data, schedules, entries, status - suggest they use specific commands like "show cleaning data" or "status of train [number]"
         - General help - provide guidance on available features
         - Technical questions - provide helpful information
         
         Keep responses concise and professional. Always suggest specific commands when appropriate.`
      : `You are a helpful general assistant. The user is not currently logged into Sancharam system.
         Provide general help and information, but remind them to log in for specific railway data.`;

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: query },
          ],
          max_tokens: 512,
          temperature: 0.7,
        }),
      });

      const data = await res.json();
      return data.choices?.[0]?.message?.content || "Sorry, I couldn't process that request.";
      
    } catch (error) {
      throw new Error("Failed to get response from AI service");
    }
  };

  const clearChat = () => {
    setMessages(isAuthenticated ? [{
      sender: "bot",
      text: `Chat cleared!\n\nI'm still here to help with Sancharam data.\nType "help" for available commands.`,
      timestamp: new Date().toLocaleTimeString()
    }] : [{
      sender: "bot",
      text: "Chat cleared! Please log in to access Sancharam features.",
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  // Dynamic quick commands based on role and department
  const getQuickCommands = () => {
    const commands = [];
    
    // Always available commands
    commands.push({ label: "Help", command: "help", icon: "❓" });
    commands.push({ label: "Status", command: "system status", icon: "📊" });

    // Role-based commands
    if (role === "admin") {
      commands.push(
        { label: "All Cleaning", command: "show cleaning data", icon: "🧽" },
        { label: "All Inspections", command: "show inspection entries", icon: "🔍" },
        { label: "All Maintenance", command: "show maintenance data", icon: "🔧" },
        { label: "Operations", command: "show operations data", icon: "🚉" },
        { label: "Timetable", command: "show timetable", icon: "📅" },
        { label: "Job Cards", command: "show job cards", icon: "🎫" }
      );
    } else if (role === "supervisor") {
      const dept = department.toLowerCase();
      
      if (dept === "cleaning") {
        commands.push(
          { label: "My Cleaning", command: "show cleaning data", icon: "🧽" },
          { label: "Create Entry", command: "create cleaning entry", icon: "➕" }
        );
      }
      
      if (dept === "inspection") {
        commands.push(
          { label: "Inspections", command: "show inspection entries", icon: "🔍" },
          { label: "Job Cards", command: "show job cards", icon: "🎫" }
        );
      }
      
      if (dept === "maintenance" || dept === "rollingstock") {
        commands.push(
          { label: "Maintenance", command: "show maintenance data", icon: "🔧" },
          { label: "Schedule Work", command: "create maintenance entry", icon: "📝" }
        );
      }
      
      if (dept === "operations") {
        commands.push(
          { label: "Operations", command: "show operations data", icon: "🚉" },
          { label: "Timetable", command: "show timetable", icon: "📅" }
        );
      }
      
      commands.push({ label: "Train Status", command: "check train status", icon: "🚂" });
      
    } else {
      const dept = department.toLowerCase();
      
      if (dept === "cleaning") {
        commands.push({ label: "Cleaning Schedule", command: "show cleaning data", icon: "🧽" });
      }
      
      if (dept === "inspection") {
        commands.push({ label: "Inspections", command: "show inspection entries", icon: "🔍" });
      }
      
      if (dept === "maintenance" || dept === "rollingstock") {
        commands.push({ label: "Maintenance", command: "show maintenance data", icon: "🔧" });
      }
      
      if (dept === "operations") {
        commands.push({ label: "Timetable", command: "show timetable", icon: "📅" });
      }
      
      commands.push({ label: "Check Train", command: "status of train", icon: "🚂" });
    }

    return commands.slice(0, 6);
  };

  const quickCommands = getQuickCommands();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className={`
            w-14 h-14 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110
            flex items-center justify-center text-xl font-bold
            ${open 
              ? 'bg-white text-blue-600 border-2 border-blue-600' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }
          `}
          title={open ? "Close Chat" : "Open Sancharam Assistant"}
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
        </button>

        {/* Status Indicator */}
        {isAuthenticated && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>

      {/* Chat Window */}
      {open && (
        <div className="absolute bottom-16 right-0 w-96 h-[32rem] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transform transition-all duration-300 animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-white text-lg">Sancharam Assistant</h3>
                <p className="text-blue-100 text-sm">
                  {isAuthenticated ? `${role} • ${department}` : "Not authenticated"}
                </p>
              </div>
              <button
                onClick={clearChat}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors duration-200"
                title="Clear chat"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`
                    max-w-[85%] p-3 rounded-2xl shadow-sm
                    ${msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
                    }
                  `}
                >
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.text}
                  </div>
                  {msg.timestamp && (
                    <div className={`
                      text-xs mt-2 
                      ${msg.sender === "user" ? "text-blue-100" : "text-gray-500"}
                    `}>
                      {msg.timestamp}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-md shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <span className="text-gray-600 text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Commands */}
          {isAuthenticated && quickCommands.length > 0 && (
            <QuickCommandsDropdown 
              quickCommands={quickCommands}
              role={role}
              department={department}
              setInput={setInput}
            />
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isAuthenticated ? "Ask me about Sancharam..." : "Ask me anything..."}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={loading}
                maxLength={500}
              />
              <button
                onClick={sendMessage}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200
                  ${loading || !input.trim() 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                  }
                `}
                disabled={loading || !input.trim()}
                title="Send message (Enter)"
              >
                {loading ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
            
            {/* Character counter and status */}
            <div className="flex justify-between items-center mt-2 text-xs">
              <span className="text-gray-500">
                {isAuthenticated ? "🟢 Connected" : "🟡 Limited access"}
              </span>
              {input.length > 400 && (
                <span className="text-gray-500">{input.length}/500</span>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default ChatBot;