import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function subscribeDashboard(callback: (data: any) => void) {
  const usersRef = collection(db, "users");
  const schedulesRef = collection(db, "schedules");

  const unsubUsers = onSnapshot(usersRef, usersSnap => {
    const userCount = usersSnap.size;

    const unsubSchedules = onSnapshot(schedulesRef, schSnap => {
      callback({
        stats: [
          {
            label: "Total Pengguna",
            value: userCount,
            icon: "Users",
          },
        ],
        recentSchedules: schSnap.docs.map(d => ({
          id: d.id,
          ...d.data(),
        })),
      });
    });

    return () => unsubSchedules();
  });

  return () => unsubUsers();
}
