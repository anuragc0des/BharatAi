import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getChatHistory, sendChatMessage } from "../services/api.js";

const ChatPage = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const userId = "demo-user";

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getChatHistory(userId);
        setMessages(history);
      } catch {
        setMessages([]);
      }
    };
    void fetchHistory();
  }, [userId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    if (!question.trim()) return;

    setLoading(true);
    try {
      const answer =
        "This is a demo response. Replace with Gemini integration when ready.";
      await sendChatMessage({ userId, question, answer });
      setMessages((prev) => [
        { question, answer, timestamp: new Date().toISOString() },
        ...prev,
      ]);
      setQuestion("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900 mb-4">
          {t("chat")}
        </h1>
        <p className="text-slate-600 mb-6">{t("placeholderFeedback")}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            {t("askQuestion")}
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder={t("typeQuestion")}
              rows={4}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t("send")}
          </button>
        </form>

        <div className="mt-10 space-y-4">
          {messages.map((item, index) => (
            <div
              key={`${item.timestamp}-${index}`}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
            >
              <p className="text-sm font-medium text-slate-700">
                Q: {item.question}
              </p>
              <p className="mt-3 text-slate-900">A: {item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default ChatPage;
