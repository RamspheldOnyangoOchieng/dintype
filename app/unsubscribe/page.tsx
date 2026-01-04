"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const translations = {
  en: {
    unsubscribe: "Unsubscribe",
    success: "You have been successfully unsubscribed from our marketing emails.",
    home: "Go to Home page",
  },
};

export default function UnsubscribePage() {
  const t = translations.en;
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-[#232323] rounded-xl shadow-lg w-full max-w-md flex flex-col items-center justify-center p-10">
        <div className="mb-6">
          <Image src="/favicon.png" alt="Pocketlove" width={48} height={48} />
        </div>
        <h2 className="text-2xl font-bold mb-4">{t.unsubscribe}</h2>
        <p className="text-gray-300 text-center mb-8">{t.success}</p>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground w-full py-3 font-semibold"
          onClick={() => router.push("/")}
        >
          {t.home}
        </Button>
      </div>
    </div>
  );
}
