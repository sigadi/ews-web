"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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

  // Modal States
  const [isAdding, setIsAdding] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(
    null,
  );

  // Form State
  const [formData, setFormData] = useState<Omit<Question, "id">>({
    text: "",
    order: 1,
    options: [],
  });

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

  const resetForm = () => {
    setFormData({
      text: "",
      order: questions.length + 1,
      options: [
        { id: crypto.randomUUID(), label: "Ya", score: 1 },
        { id: crypto.randomUUID(), label: "Tidak", score: 0 },
      ],
    });
  };

  const handleAddClick = () => {
    resetForm();
    setIsAdding(true);
  };

  const handleEditClick = (q: Question) => {
    setFormData({
      text: q.text,
      order: q.order,
      options: q.options || [],
    });
    setEditingQuestion(q);
  };

  const handleSave = async () => {
    try {
      if (editingQuestion) {
        // Update existing
        const docRef = doc(
          db,
          "questionnaires",
          questionnaireId,
          "question",
          editingQuestion.id,
        );
        await updateDoc(docRef, formData);

        setQuestions((prev) =>
          prev.map((q) =>
            q.id === editingQuestion.id ? { ...q, ...formData } : q,
          ),
        );
      } else {
        // Add new
        const colRef = collection(
          db,
          "questionnaires",
          questionnaireId,
          "question",
        );
        const docRef = await addDoc(colRef, formData);

        setQuestions((prev) => [...prev, { id: docRef.id, ...formData }]);
      }
      setIsAdding(false);
      setEditingQuestion(null);
    } catch (error) {
      console.error("Error saving question:", error);
      alert("Gagal menyimpan pertanyaan");
    }
  };

  const handleDelete = async () => {
    if (!deletingQuestionId) return;

    try {
      await deleteDoc(
        doc(
          db,
          "questionnaires",
          questionnaireId,
          "question",
          deletingQuestionId,
        ),
      );
      setQuestions((prev) => prev.filter((q) => q.id !== deletingQuestionId));
      setDeletingQuestionId(null);
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Gagal menghapus pertanyaan");
    }
  };

  const updateOption = (id: string, field: keyof Option, value: any) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((opt) =>
        opt.id === id ? { ...opt, [field]: value } : opt,
      ),
    }));
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [
        ...prev.options,
        { id: crypto.randomUUID(), label: "", score: 0 },
      ],
    }));
  };

  const removeOption = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((opt) => opt.id !== id),
    }));
  };

  if (loading) return <div>Loading questions...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Daftar Pertanyaan
        </h1>
      </div>
      <div>
        <Button
          onClick={handleAddClick}
          className="bg-teal-600 text-white hover:bg-teal-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Pertanyaan
        </Button>
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
                <div className="mt-1 flex gap-2">
                  {q.options?.map((opt) => (
                    <span
                      key={opt.id}
                      className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600"
                    >
                      {opt.label} ({opt.score})
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                  onClick={() => handleEditClick(q)}
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  onClick={() => setDeletingQuestionId(q.id)}
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

      {/* Add/Edit Dialog */}
      <Dialog
        open={isAdding || !!editingQuestion}
        onOpenChange={(open) => {
          if (!open) {
            setIsAdding(false);
            setEditingQuestion(null);
          }
        }}
      >
        <DialogContent className="bg-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isAdding ? "Tambah Pertanyaan" : "Edit Pertanyaan"}
            </DialogTitle>
            <DialogDescription>
              Isi detail pertanyaan di bawah ini.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="order" className="text-right">
                Urutan
              </Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="text" className="text-right">
                Pertanyaan
              </Label>
              <Textarea
                id="text"
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
                className="col-span-3"
              />
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <Label>Opsi Jawaban</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Tambah Opsi
                </Button>
              </div>

              <div className="space-y-3">
                {formData.options.map((opt, index) => (
                  <div key={opt.id} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <Input
                        placeholder="Label (e.g., Ya)"
                        value={opt.label}
                        onChange={(e) =>
                          updateOption(opt.id, "label", e.target.value)
                        }
                      />
                    </div>
                    <div className="w-24">
                      <Input
                        type="number"
                        placeholder="Skor"
                        value={opt.score}
                        onChange={(e) =>
                          updateOption(
                            opt.id,
                            "score",
                            parseFloat(e.target.value),
                          )
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => removeOption(opt.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAdding(false);
                setEditingQuestion(null);
              }}
            >
              Batal
            </Button>
            <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700">
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog
        open={!!deletingQuestionId}
        onOpenChange={(open) => !open && setDeletingQuestionId(null)}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Pertanyaan ini akan dihapus
              permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="text-white bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
