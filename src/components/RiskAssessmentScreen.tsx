import { useState } from "react";
import { ChevronRight, CheckCircle, Circle, AlertTriangle } from "lucide-react";

export function RiskAssessmentScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      id: 0,
      question: "Berapa usia Anda saat ini?",
      options: ["Di bawah 20 tahun", "20-30 tahun", "31-45 tahun", "Di atas 45 tahun"]
    },
    {
      id: 1,
      question: "Apakah Anda sudah pernah melakukan tes Pap smear atau IVA?",
      options: ["Belum pernah", "Dalam 1 tahun terakhir", "1-3 tahun lalu", "Lebih dari 3 tahun lalu"]
    },
    {
      id: 2,
      question: "Apakah Anda merokok?",
      options: ["Tidak pernah", "Mantan perokok", "Kadang-kadang", "Rutin merokok"]
    },
    {
      id: 3,
      question: "Apakah ada riwayat kanker serviks dalam keluarga?",
      options: ["Tidak ada", "Ya, keluarga jauh", "Ya, ibu/saudara kandung", "Tidak yakin"]
    },
    {
      id: 4,
      question: "Apakah Anda sudah mendapatkan vaksin HPV?",
      options: ["Sudah lengkap", "Sebagian", "Belum pernah", "Tidak tahu"]
    },
    {
      id: 5,
      question: "Apakah Anda bersedia melakukan skrining IVA jika diperlukan?",
      options: ["Ya, sangat bersedia", "Ya, bersedia", "Masih ragu", "Perlu konsultasi dulu"]
    }
  ];

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentStep]: answer });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateRisk = () => {
    // Simple risk calculation based on answers
    const riskFactors = Object.values(answers).filter(answer => 
      answer.includes("Belum pernah") || 
      answer.includes("Rutin merokok") ||
      answer.includes("ibu/saudara")
    ).length;

    if (riskFactors >= 3) return "tinggi";
    if (riskFactors >= 1) return "sedang";
    return "rendah";
  };

  if (showResult) {
    const riskLevel = calculateRisk();
    const riskColors = {
      tinggi: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
      sedang: { bg: "bg-warning-50", text: "text-warning-600", border: "border-warning-200" },
      rendah: { bg: "bg-success-50", text: "text-success-600", border: "border-success-200" }
    };

    const colors = riskColors[riskLevel as keyof typeof riskColors];

    return (
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-md mx-auto">
          <div className={`${colors.bg} ${colors.border} border-2 rounded-3xl p-8 text-center`}>
            <div className={`w-20 h-20 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <AlertTriangle className={`w-10 h-10 ${colors.text}`} />
            </div>
            <h2 className="text-gray-900 mb-2">Hasil Penilaian Risiko</h2>
            <p className={`${colors.text} mb-6 capitalize`}>
              Risiko {riskLevel}
            </p>
            <p className="text-gray-600 mb-8">
              {riskLevel === "tinggi" && "Kami merekomendasikan Anda untuk segera berkonsultasi dengan dokter untuk pemeriksaan lebih lanjut."}
              {riskLevel === "sedang" && "Beberapa faktor risiko teridentifikasi. Pertimbangkan untuk melakukan pemeriksaan rutin."}
              {riskLevel === "rendah" && "Risiko Anda rendah, tetapi tetap penting untuk melakukan pemeriksaan rutin."}
            </p>
          </div>

          <div className="space-y-3 mt-6">
            <button className="w-full bg-primary-600 text-white py-4 rounded-2xl hover:bg-primary-700 transition-colors">
              Buat Janji Konsultasi
            </button>
            <button 
              onClick={() => {
                setShowResult(false);
                setCurrentStep(0);
                setAnswers({});
              }}
              className="w-full bg-white text-primary-600 py-4 rounded-2xl border-2 border-primary-600 hover:bg-primary-50 transition-colors"
            >
              Ulangi Penilaian
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="flex-1 flex flex-col">
      {/* Progress Header */}
      <div className="px-6 pt-6 pb-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-900">Penilaian Risiko</h3>
          <span className="text-sm text-gray-500">
            {currentStep + 1} dari {questions.length}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-600 transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-md mx-auto">
          <h2 className="text-gray-900 mb-8">
            {questions[currentStep].question}
          </h2>

          <div className="space-y-3">
            {questions[currentStep].options.map((option, index) => {
              const isSelected = answers[currentStep] === option;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center gap-3 ${
                    isSelected
                      ? "border-primary-600 bg-primary-50"
                      : "border-gray-200 bg-white hover:border-primary-300"
                  }`}
                >
                  {isSelected ? (
                    <CheckCircle className="w-6 h-6 text-primary-600 flex-shrink-0" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  )}
                  <span className={isSelected ? "text-gray-900" : "text-gray-700"}>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="px-6 py-4 bg-white border-t border-gray-200">
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={handlePrevious}
              className="flex-1 py-3 rounded-2xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Kembali
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!answers[currentStep]}
            className={`flex-1 py-3 rounded-2xl transition-colors flex items-center justify-center gap-2 ${
              answers[currentStep]
                ? "bg-primary-600 text-white hover:bg-primary-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {currentStep === questions.length - 1 ? "Lihat Hasil" : "Lanjut"}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}