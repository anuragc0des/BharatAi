import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import { createUserProfile } from "../services/api.js";

const initialForm = {
  name: "",
  age: "",
  gender: "",
  state: "",
  education: "",
  occupation: "",
  annualIncome: "",
  category: "",
  studentStatus: "No",
  farmerStatus: "No",
  entrepreneurStatus: "No",
  employmentStatus: "",
};

const ProfilePage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const user = await createUserProfile({
        ...form,
        age: Number(form.age),
        annualIncome: Number(form.annualIncome),
      });
      navigate(`/recommendations?userId=${user._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900 mb-4">
          {t("profile")}
        </h1>
        <p className="text-slate-600 mb-6">{t("welcomeDescription")}</p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { name: "name", label: t("name"), type: "text" },
              { name: "age", label: t("age"), type: "number" },
              { name: "gender", label: t("gender"), type: "text" },
              { name: "state", label: t("state"), type: "text" },
              { name: "education", label: t("education"), type: "text" },
              { name: "occupation", label: t("occupation"), type: "text" },
              {
                name: "annualIncome",
                label: t("annualIncome"),
                type: "number",
              },
              { name: "category", label: t("socialCategory"), type: "text" },
              {
                name: "employmentStatus",
                label: t("employmentStatus"),
                type: "text",
              },
            ].map((field) => (
              <label
                key={field.name}
                className="block text-sm font-medium text-slate-700"
              >
                {field.label}
                <input
                  name={field.name}
                  type={field.type}
                  value={form[field.name]}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </label>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { name: "studentStatus", label: t("studentStatus") },
              { name: "farmerStatus", label: t("farmerStatus") },
              { name: "entrepreneurStatus", label: t("entrepreneurStatus") },
            ].map((field) => (
              <label
                key={field.name}
                className="block text-sm font-medium text-slate-700"
              >
                {field.label}
                <select
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </label>
            ))}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving…" : t("submitProfile")}
          </button>
        </form>
      </div>
    </main>
  );
};

export default ProfilePage;
