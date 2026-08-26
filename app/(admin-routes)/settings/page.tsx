import { prisma } from "@/lib/prisma";
import SettingsForm from "../(componants)/SettingsForm";

const SettingsPage = async () => {
  // Fetch doctor
  const doctor = await prisma.doctor.findFirst();

  if (!doctor) {
    return (
      <div className="min-h-screen bg-slate-50 p-10 text-center">
        <p className="text-red-500">⚠️ لم يتم العثور على طبيب.</p>
      </div>
    );
  }

  return <SettingsForm doctor={doctor} />;
};

export default SettingsPage;
