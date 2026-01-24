import { useState } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  ChevronRight,
  CheckCircle,
  Hospital,
  Info,
} from "lucide-react";

interface SchedulingScreenProps {
  onScheduleComplete?: () => void;
}

export function SchedulingScreen({ onScheduleComplete }: SchedulingScreenProps) {
  const [step, setStep] = useState(1);
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const facilities = [
    {
      id: "1",
      name: "RS Umum Daerah Kota",
      address: "Jl. Kesehatan No. 123, Jakarta Pusat",
      distance: "2.5 km",
      available: true,
    },
    {
      id: "2",
      name: "Puskesmas Menteng",
      address: "Jl. Cikini Raya No. 45, Jakarta Pusat",
      distance: "1.8 km",
      available: true,
    },
    {
      id: "3",
      name: "Klinik Pratama Sehat",
      address: "Jl. Sudirman No. 67, Jakarta Selatan",
      distance: "4.2 km",
      available: true,
    },
  ];

  const availableDates = [
    { date: "2024-12-10", day: "Sen", slots: 8 },
    { date: "2024-12-11", day: "Sel", slots: 5 },
    { date: "2024-12-12", day: "Rab", slots: 12 },
    { date: "2024-12-13", day: "Kam", slots: 10 },
    { date: "2024-12-14", day: "Jum", slots: 6 },
  ];

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "13:00", "13:30", "14:00", "14:30",
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete booking
      if (onScheduleComplete) {
        onScheduleComplete();
      }
    }
  };

  const canProceed = () => {
    if (step === 1) return selectedFacility !== null;
    if (step === 2) return selectedDate !== null;
    if (step === 3) return selectedTime !== null;
    return false;
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Progress Header */}
      <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-200">
        <h2 className="text-gray-900 mb-4">Jadwal Skrining IVA</h2>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center">
              <div
                className={`w-full h-2 rounded-full ${
                  s <= step ? "bg-primary-600" : "bg-gray-200"
                }`}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <span className={step >= 1 ? "text-primary-600" : "text-gray-400"}>
            Fasilitas
          </span>
          <span className={step >= 2 ? "text-primary-600" : "text-gray-400"}>
            Tanggal
          </span>
          <span className={step >= 3 ? "text-primary-600" : "text-gray-400"}>
            Waktu
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Step 1: Select Facility */}
        {step === 1 && (
          <div className="px-6 py-6">
            <div className="bg-primary-50 rounded-2xl p-4 mb-6 border border-primary-100">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-primary-900 text-sm mb-1">
                    Tentang Skrining IVA
                  </h4>
                  <p className="text-primary-800 text-xs">
                    Skrining IVA adalah pemeriksaan visual untuk mendeteksi dini
                    perubahan pada leher rahim. Prosedur cepat dan tidak
                    menyakitkan.
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-gray-900 mb-4">Pilih Fasilitas Kesehatan</h3>
            <div className="space-y-3">
              {facilities.map((facility) => (
                <button
                  key={facility.id}
                  onClick={() => setSelectedFacility(facility.id)}
                  className={`w-full bg-white rounded-2xl p-4 border-2 transition-all text-left ${
                    selectedFacility === facility.id
                      ? "border-primary-600 shadow-md"
                      : "border-gray-200 hover:border-primary-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        selectedFacility === facility.id
                          ? "bg-primary-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <Hospital
                        className={`w-6 h-6 ${
                          selectedFacility === facility.id
                            ? "text-primary-600"
                            : "text-gray-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-900 mb-1">{facility.name}</h4>
                      <p className="text-gray-600 text-xs mb-2">
                        {facility.address}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {facility.distance}
                        </span>
                        <span className="text-xs text-success-600 bg-success-50 px-2 py-0.5 rounded">
                          Tersedia
                        </span>
                      </div>
                    </div>
                    {selectedFacility === facility.id && (
                      <CheckCircle className="w-6 h-6 text-primary-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Date */}
        {step === 2 && (
          <div className="px-6 py-6">
            <h3 className="text-gray-900 mb-4">Pilih Tanggal</h3>
            <div className="bg-white rounded-2xl p-4 mb-6 border border-gray-100">
              <div className="grid grid-cols-5 gap-2">
                {availableDates.map((dateInfo) => {
                  const date = new Date(dateInfo.date);
                  const day = date.getDate();
                  const isSelected = selectedDate === dateInfo.date;

                  return (
                    <button
                      key={dateInfo.date}
                      onClick={() => setSelectedDate(dateInfo.date)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        isSelected
                          ? "border-primary-600 bg-primary-50"
                          : "border-gray-200 bg-white hover:border-primary-300"
                      }`}
                    >
                      <div className="text-center">
                        <p
                          className={`text-xs mb-1 ${
                            isSelected ? "text-primary-600" : "text-gray-500"
                          }`}
                        >
                          {dateInfo.day}
                        </p>
                        <p
                          className={`mb-1 ${
                            isSelected ? "text-primary-600" : "text-gray-900"
                          }`}
                        >
                          {day}
                        </p>
                        <p className="text-xs text-gray-500">
                          {dateInfo.slots} slot
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-warning-50 rounded-2xl p-4 border border-warning-100">
              <p className="text-warning-800 text-xs">
                <strong>Catatan:</strong> Disarankan untuk melakukan skrining
                IVA di luar periode menstruasi untuk hasil optimal.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Select Time */}
        {step === 3 && (
          <div className="px-6 py-6">
            <h3 className="text-gray-900 mb-4">Pilih Waktu</h3>
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((time) => {
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? "border-primary-600 bg-primary-50"
                        : "border-gray-200 bg-white hover:border-primary-300"
                    }`}
                  >
                    <Clock
                      className={`w-5 h-5 mx-auto mb-1 ${
                        isSelected ? "text-primary-600" : "text-gray-400"
                      }`}
                    />
                    <p
                      className={`text-sm text-center ${
                        isSelected ? "text-primary-600" : "text-gray-900"
                      }`}
                    >
                      {time}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Summary */}
            {selectedTime && (
              <div className="bg-white rounded-2xl p-4 mt-6 border border-gray-200">
                <h4 className="text-gray-900 mb-3">Ringkasan Jadwal</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fasilitas:</span>
                    <span className="text-gray-900">
                      {
                        facilities.find((f) => f.id === selectedFacility)
                          ?.name
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tanggal:</span>
                    <span className="text-gray-900">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Waktu:</span>
                    <span className="text-gray-900">{selectedTime}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Kembali
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex-1 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 ${
              canProceed()
                ? "bg-primary-600 text-white hover:bg-primary-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {step === 3 ? "Konfirmasi Jadwal" : "Lanjut"}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
