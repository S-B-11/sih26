import React from "react";
import { History, X, Clock, MessageSquare, Trash2, ArrowRight } from "lucide-react";

export function SessionDrawer({ isOpen, onClose, messages, onSelectHistoricalQuery, onReset }) {
  if (!isOpen) return null;

  const historicalQueries = messages.filter((m) => m.sender === "user");

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-slate-950 border-l border-cyan-500/30 h-full p-4 flex flex-col shadow-2xl animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Query Session History
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Query list */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
          {historicalQueries.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50 text-cyan-400" />
              <p>No query history recorded yet in this session.</p>
            </div>
          ) : (
            historicalQueries.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSelectHistoricalQuery(item.text);
                  onClose();
                }}
                className="p-3 rounded-xl glass-card hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1 font-mono">
                  <span>Session Query #{idx + 1}</span>
                  <span>{item.timestamp}</span>
                </div>
                <p className="text-xs text-slate-200 group-hover:text-cyan-300 font-medium line-clamp-2">
                  "{item.text}"
                </p>
                <div className="flex items-center justify-end mt-1 text-[10px] text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="mr-1">Reload Query</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onReset}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-red-950/60 text-red-300 border border-red-500/30 text-xs font-semibold hover:bg-red-900 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>

          <span className="text-[10px] text-slate-500 font-mono">
            ORCA Local DB Cache
          </span>
        </div>
      </div>
    </div>
  );
}
