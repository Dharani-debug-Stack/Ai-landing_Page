import React, { useState } from "react";
import axios from "axios";
import { Loader2, Copy, Sparkles, Eye, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const [idea, setIdea] = useState("");
  const [category, setCategory] = useState("AI SaaS");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const superPrompt = (idea, category) => `
You are a world-class front-end designer. Create a **realistic, production-quality website** in pure **HTML + Tailwind CSS** for a ${category} product called "${idea}". 

The website should look **like a real startup or SaaS company site**, not a demo.

Requirements:
1. Structure:
   - **Navbar:** logo, nav links, call-to-action button.
   - **Hero Section:** catchy headline, short subtext, and a strong CTA button.
   - **Features Section:** 3–4 elegant cards with icons, short titles, and descriptions.
   - **Testimonials Section:** 2–3 user testimonials with name, role, and quote.
   - **Pricing Section:** 2–3 pricing cards with plan names, prices, and features.
   - **Call-to-Action (CTA) Section:** a bold invitation to try or sign up.
   - **Footer:** logo, quick links, and social icons.

2. Design Style:
   - Use **Tailwind CSS** only (no inline styles or JS).
   - Choose a **modern SaaS aesthetic**: rounded corners, clean spacing, and balanced layout.
   - Use **beautiful gradients**, subtle shadows, and pastel or muted colors.
   - Typography: readable sans-serif (e.g., Inter, Poppins, or Open Sans).
   - All images should use **placeholder URLs** (like via Unsplash).

3. Responsiveness:
   - The layout must work seamlessly on mobile, tablet, and desktop.
   - Use responsive classes (e.g., grid-cols-1 md:grid-cols-3).

4. Output:
   - Output only **valid HTML code** (no Markdown or explanations).
   - The HTML should be ready to copy and open in a browser.

Goal:
Create a website that feels like a **real, professional, fully built product landing page**, suitable for a live SaaS or startup website.
`;


  const handleGenerate = async () => {
    if (!idea.trim()) {
      alert("Please enter a product idea!");
      return;
    }

    setLoading(true);
    setResult("");
    setErrorMsg("");

    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-3.5-turbo",
          messages: [{ role: "user", content: superPrompt(idea, category) }],
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_APIKEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      setResult(response.data?.choices?.[0]?.message?.content || "No result");
    } catch (error) {
      console.error(error);
      setErrorMsg(
        error.response?.status === 401
          ? "Unauthorized: API key is missing or cannot be used from frontend."
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyHTML = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-white to-indigo-100 dark:from-gray-900 dark:to-black text-gray-800 dark:text-gray-100 transition-all duration-500">
      {/* Header */}
      <header className="p-4 shadow-sm bg-white/70 dark:bg-white/5 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-bold text-purple-700 dark:text-purple-400">
            <Sparkles className="w-6 h-6" />
            <span>AI PageCraft</span>
          </div>
          <button
            onClick={() =>
              document.documentElement.classList.toggle("dark")
            }
            className="text-sm text-gray-500 dark:text-gray-400 border px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Toggle Theme
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-3xl bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8"
        >
          <h1 className="text-3xl font-extrabold text-center mb-4 text-purple-700 dark:text-purple-400">
            Generate Stunning Landing Pages in Seconds 🚀
          </h1>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
            Just type your product idea and AI will create a beautiful, ready-to-use HTML landing page.
          </p>

          {/* Inputs */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter your Product idea (e.g. AI Resume Builder)"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400 focus:outline-none bg-white dark:bg-gray-900 shadow-sm"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
            />

            <select
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400 bg-white dark:bg-gray-900 shadow-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="AI SaaS">AI SaaS</option>
              <option value="Productivity Tools">Productivity Tools</option>
              <option value="Startup">Startup</option>
              <option value="E-Commerce">E-Commerce</option>
            </select>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition-all"
            >
              {loading ? (
                <span className="flex justify-center items-center gap-2">
                  <Loader2 className="animate-spin" size={20} /> Generating...
                </span>
              ) : (
                "✨ Generate Landing Page"
              )}
            </motion.button>
          </div>

          {/* Error */}
          {errorMsg && (
            <p className="text-red-500 font-medium mt-4 text-center">{errorMsg}</p>
          )}

          {/* Result */}
          {result && (
            <div className="mt-8 bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-inner">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Generated HTML Preview</h2>
                <div className="flex gap-2">
                  <button
                    onClick={copyHTML}
                    className="flex items-center gap-2 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-all"
                  >
                    <Copy size={18} />
                    {copied ? "Copied!" : "Copy HTML"}
                  </button>

                  <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition-all"
                  >
                    <Eye size={18} /> View Full
                  </button>
                </div>
              </div>

              <div
                className="bg-white dark:bg-gray-900 p-4 rounded-xl border overflow-y-auto max-h-[60vh]"
                dangerouslySetInnerHTML={{ __html: result }}
              />
            </div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
        Made with 💜 by <span className="font-semibold text-purple-600">Dharani</span> | © 2025 AI PageCraft
      </footer>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-6xl h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-red-500"
              >
                <X size={24} />
              </button>

              <div dangerouslySetInnerHTML={{ __html: result }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
