"use client";

import { useChat } from "@ai-sdk/react";
export default function ButcherAssistantPage() {
  // استخدام useChat للتعامل مع الـ Streaming بسهولة
  const { messages, sendMessage,resumeStream,} = useChat({
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="space-y-4 mb-8">
        {messages.map((m) => (
          <div key={m.id} className={`p-4 rounded-lg ${m.role === 'user' ? 'bg-blue-100' : 'bg-green-100 text-right'}`}>
            <span className="font-bold">{m.role === 'user' ? 'أنت: ' : 'خبير اللحوم: '}</span>
            {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <input
          className="w-full p-4 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          value={input}
          placeholder="اسأل عن أفضل قطعيات اللحم اليوم..."
          onChange={handleInputChange}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute left-2 top-2 bottom-2 bg-black text-white px-6 rounded-lg disabled:opacity-50"
        >
          {isLoading ? "جاري التحضير..." : "إرسال"}
        </button>
      </form>
    </div>
  );
}