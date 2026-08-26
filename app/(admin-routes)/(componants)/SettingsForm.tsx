"use client";

import React, { useState, useRef } from "react";
import {
  Save,
  User,
  Briefcase,
  FileText,
  MapPin,
  Mail,
  Upload,
  Loader2,
} from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { setSettings } from "@/app/actions/settings";
import toast from "react-hot-toast";

// Type for Doctor
interface DoctorData {
  id: string;
  name: string;
  title: string;
  yearsExperience: number;
  description: string;
  phone: string;
  email: string | null;
  address: string | null;
  facebookLink: string | null;
  instagramLink: string | null;
  imageUrl: string | null;
}

export default function SettingsForm({ doctor }: { doctor: DoctorData }) {
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============================================
  // CUSTOMIZABLE FIELDS
  // ============================================

  // 1. Main Image
  const [doctorImage, setDoctorImage] = useState(doctor.imageUrl || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(doctor.imageUrl || "");

  // 2. Doctor Name
  const [doctorName, setDoctorName] = useState(doctor.name);

  // 3. Years of Experience (Numeric)
  const [yearsExperience, setYearsExperience] = useState<string>(
    String(doctor.yearsExperience),
  );

  // 4. About Doctor (Description)
  const [aboutDoctor, setAboutDoctor] = useState(doctor.description);
  const [title, setTitle] = useState(doctor.title);

  // 5. Address
  const [address, setAddress] = useState(doctor.address || "");

  // 6. Numbers List (Egyptian format)
  const [phone, setPhone] = useState(doctor.phone);

  // 7. Facebook Link
  const [facebook, setFacebook] = useState(doctor.facebookLink || "");

  // 8. Instagram Link
  const [instagram, setInstagram] = useState(doctor.instagramLink || "");

  // 9. Email
  const [email, setEmail] = useState(doctor.email || "");

  // ============================================
  // IMAGE HANDLING
  // ============================================

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ============================================
  // INPUT VALIDATION
  // ============================================

  const handleYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setYearsExperience(value);
  };

  // ============================================
  // HANDLE SAVE
  // ============================================
  const handleSave = async () => {
    setIsLoading(true);

    const formData = new FormData();
    formData.set("doctorName", doctorName);
    formData.set("yearsExperience", yearsExperience);
    formData.set("email", email);
    formData.set("aboutDoctor", aboutDoctor);
    formData.set("address", address);
    formData.set("phone", phone);
    formData.set("title", title);
    formData.set("facebook", facebook);
    formData.set("instagram", instagram);

    // Add image file if selected
    if (imageFile) {
      formData.set("image", imageFile);
    }

    const result = await setSettings(formData, doctor.id);

    if (result?.error) {
      toast.error(result.error);
      setIsLoading(false);
      return;
    }

    if (result?.success) {
      toast.success("تم حفظ الإعدادات بنجاح! 🎉");
      setSaved(true);
      setIsLoading(false);
      setDoctorImage(imagePreview); // Update main image
      setTimeout(() => setSaved(false), 3000);
    }
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Page Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-black text-[#062657] lg:text-3xl">
              الإعدادات
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              إدارة البيانات الأساسية للطبيب والموقع.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#b91c1c] to-[#991b1b] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {saved ? "تم الحفظ!" : "حفظ التغييرات"}
              </>
            )}
          </button>
        </div>

        <div className="p-6 lg:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
          {/* MAIN IMAGE + DOCTOR NAME */}
          <div className="mb-8 flex flex-col items-center gap-6 border-b border-slate-100 pb-8 sm:flex-row">
            <div className="relative">
              <Avatar className="h-28 w-28 border-4 border-[#cda558]/30">
                <AvatarImage
                  src={imagePreview || doctorImage}
                  alt={doctorName}
                />
                <AvatarFallback className="bg-gradient-to-br from-[#b91c1c] to-[#991b1b] text-white text-4xl font-bold">
                  د
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -left-2 flex gap-1">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white shadow-md transition-colors hover:bg-blue-600"
                  title="تغيير الصورة"
                >
                  <Upload className="h-3.5 w-3.5" />
                </button>
                {imagePreview && (
                  <button
                    onClick={handleRemoveImage}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-colors hover:bg-red-600"
                    title="إزالة الصورة"
                  >
                    ×
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <div className="text-center sm:text-right">
              <h2 className="text-xl font-bold text-[#062657]">{doctorName}</h2>
              <p className="text-sm text-slate-400">{doctor.title}</p>
            </div>
          </div>

          {/* FORM FIELDS */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Doctor Name */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#062657]">
                اسم الطبيب
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-10 text-sm outline-none transition-all focus:border-[#075b9f] focus:bg-white focus:ring-4 focus:ring-[#075b9f]/10"
                />
              </div>
            </div>

            {/* Years of Experience (Numeric) */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#062657]">
                سنوات الخبرة
              </label>
              <div className="relative">
                <Briefcase className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="number"
                  min={0}
                  max={99}
                  value={yearsExperience}
                  onChange={handleYearsChange}
                  placeholder="مثال: 20"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-10 text-sm outline-none transition-all focus:border-[#075b9f] focus:bg-white focus:ring-4 focus:ring-[#075b9f]/10"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#062657]">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  dir="ltr"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-10 text-left text-sm outline-none transition-all focus:border-[#075b9f] focus:bg-white focus:ring-4 focus:ring-[#075b9f]/10"
                />
              </div>
            </div>

            {/* About Doctor (Description) */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#062657]">
                نبذة عن الطبيب
              </label>
              <div className="relative">
                <FileText className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                <Textarea
                  value={aboutDoctor}
                  onChange={(e) => setAboutDoctor(e.target.value)}
                  rows={5}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 pr-10 text-sm outline-none transition-all focus:border-[#075b9f] focus:bg-white focus:ring-4 focus:ring-[#075b9f]/10"
                />
              </div>
            </div>

            {/* Title */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#062657]">
                الدرجة العلمية
              </label>
              <div className="relative">
                <FileText className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-10 text-sm outline-none transition-all focus:border-[#075b9f] focus:bg-white focus:ring-4 focus:ring-[#075b9f]/10"
                />
              </div>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#062657]">
                عنوان العيادة
              </label>
              <div className="relative">
                <MapPin className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-10 text-sm outline-none transition-all focus:border-[#075b9f] focus:bg-white focus:ring-4 focus:ring-[#075b9f]/10"
                />
              </div>
            </div>

            {/* Phone (Egyptian format) */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#062657]">
                رقم الهاتف
              </label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01xxxxxxxxx"
                dir="ltr"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 text-left text-sm outline-none transition-all focus:border-[#075b9f] focus:bg-white focus:ring-4 focus:ring-[#075b9f]/10"
              />
            </div>

            {/* Facebook Link */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#062657]">
                رابط فيسبوك
              </label>
              <div className="relative">
                <FaFacebook className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-600" />
                <Input
                  type="text"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  dir="ltr"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-10 text-left text-sm outline-none transition-all focus:border-[#075b9f] focus:bg-white focus:ring-4 focus:ring-[#075b9f]/10"
                />
              </div>
            </div>

            {/* Instagram Link */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#062657]">
                رابط إنستغرام
              </label>
              <div className="relative">
                <FaInstagram className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pink-600" />
                <Input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  dir="ltr"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-10 text-left text-sm outline-none transition-all focus:border-[#075b9f] focus:bg-white focus:ring-4 focus:ring-[#075b9f]/10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
