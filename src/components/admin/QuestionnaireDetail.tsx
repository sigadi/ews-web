"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";

type Option = {
  id: string;
  label: string;
  score: number;
};

type Question = {
  id: string;
  text: string;
  order: number;
  options: Option[];
};

export default function QuestionnaireDetail({
  questionnaireId,
}: {
  questionnaireId: string;
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!questionnaireId) return;

    const fetchQuestions = async () => {
      setLoading(true);

      try {
        const q = query(
          collection(db, "questionnaires", questionnaireId, "question"),
          orderBy("order", "asc"),
        );

        const snap = await getDocs(q);
        const data: Question[] = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Question, "id">),
        }));

        setQuestions(data);
      } catch (err) {
        console.error("Fetch questions error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [questionnaireId]);
  

  if (loading) return <div>Loading questions…</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Daftar Pertanyaan
        </h1>
      </div>
      <div>
        <button className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Pertanyaan</span>
        </button>
      </div>

      {/* Questions List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {questions.map((q) => (
            <li
              key={q.id}
              className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
            >
              <div>
                <p className="text-gray-900 font-medium">
                  {q.order}. {q.text}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                  onClick={() => {
                    console.log("edit", q.id);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  onClick={() => {
                    console.log("delete", q.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}

          {questions.length === 0 && (
            <li className="px-6 py-8 text-center text-gray-500">
              Belum ada pertanyaan
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
