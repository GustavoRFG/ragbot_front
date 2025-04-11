"use client";

import { useState } from "react";
import Image from "next/image";

const faqs = [ /* ... (mantém a lista se quiser, mas agora o RAG responde tudo melhor) ... */ ];

export default function Home() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<string | null>(null);

  const sendQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setResponse(null);

    try {
      // const res = await fetch("http://localhost:5001/rag", {
        const res = await fetch("https://0ee3-2804-1b2-11c0-8707-c114-e798-a406-5689.ngrok-free.app/rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      setResponse(data.response || "Desculpe, não consegui encontrar uma resposta para isso.");
    } catch (error) {
      console.error("Erro:", error);
      setResponse("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-600 to-yellow-500 text-white p-6">
      {/* LOGO */}
      <Image src="/logo.png" alt="Chatbot Logo" width={120} height={120} />
      
      <h1 className="text-3xl sm:text-5xl font-bold mt-4 text-center">EducBot - Assistente Escolar</h1>
      <p className="text-lg sm:text-xl text-center mt-2 opacity-90">
        Tire suas dúvidas sobre a escola, horário das aulas, matrícula, atividades ou qualquer outra questão escolar.
      </p>

      <div className="w-full max-w-xl mt-6 flex flex-col items-center">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Exemplo: 'Qual o horário das aulas?'"
          className="w-full p-3 rounded-xl text-black text-lg focus:outline-none bg-gradient-to-r from from-transparent to-transparent border-2 border-gray-400 focus:border-yellow-500 transition"
        />
        <button
          onClick={sendQuestion}
          className="mt-3 px-6 py-3 bg-blue-500 hover:bg-blue-600 transition rounded-xl font-bold"
        >
          Perguntar
        </button>
      </div>

      <div className="w-full max-w-xl mt-6 p-4 bg-white/20 rounded-lg shadow-md">
        {loading ? (
          <p className="text-center text-xl font-semibold">Pensando... ⏳</p>
        ) : response ? (
          <p className="text-lg font-medium whitespace-pre-line">{response}</p>
        ) : (
          <p className="text-center text-lg opacity-70">Aguardando pergunta...</p>
        )}
      </div>

      <footer className="mt-8 text-sm opacity-80">© {new Date().getFullYear()} EducBot - Colégio do Sol</footer>
    </div>
  );
}
