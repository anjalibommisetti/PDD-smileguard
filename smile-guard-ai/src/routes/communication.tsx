import React from "react";
import { View } from "react-native";
import { MessageSquare, Send, Paperclip, Phone, Video } from "lucide-react";

export default function CommunicationModule() {
  return (
    <div className="flex h-full bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden border-l border-slate-200 dark:border-slate-800">
      {/* Sidebar: Chat List */}
      <div className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {[
            { name: "Prathyusha", msg: "When should I come in?", time: "10:30 AM", unread: 2 },
            { name: "John Doe", msg: "Thanks doctor!", time: "Yesterday", unread: 0 },
            { name: "Sarah Smith", msg: "Attached my old scan.", time: "Mon", unread: 0 },
          ].map((chat, i) => (
            <div
              key={i}
              className={`p-4 border-b border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 ${i === 0 ? "bg-blue-50 dark:bg-blue-900/10" : ""}`}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-slate-900 dark:text-white">{chat.name}</h3>
                <span className="text-xs text-slate-500">{chat.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-500 truncate pr-4">{chat.msg}</p>
                {chat.unread > 0 && (
                  <span className="bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950">
        <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
              P
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Prathyusha</h3>
              <p className="text-xs text-green-500">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              <Video className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[70%] border border-slate-100 dark:border-slate-800">
              <p className="text-slate-800 dark:text-slate-200">
                Hi Doctor, I saw my AI risk score is 94%. Is it serious?
              </p>
              <span className="text-xs text-slate-400 mt-1 block">10:28 AM</span>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[70%] border border-slate-100 dark:border-slate-800">
              <p className="text-slate-800 dark:text-slate-200">When should I come in?</p>
              <span className="text-xs text-slate-400 mt-1 block">10:30 AM</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-full px-4 py-2 border border-slate-200 dark:border-slate-700">
            <button className="p-2 text-slate-400 hover:text-blue-500">
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-transparent focus:outline-none dark:text-white"
            />
            <button className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors">
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
