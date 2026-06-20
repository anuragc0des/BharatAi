import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getAllSchemes } from "../services/api.js";

const EligibilityVisualizationPage = () => {
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getAllSchemes();
      setSchemes(data);
      setLoading(false);
    };
    void load();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900 mb-4">
          {t("eligibilityVisualization")}
        </h1>
        <p className="text-slate-600 mb-6">
          {t("eligibilityVisualizationDescription")}
        </p>

        {loading && <p className="text-slate-600">Loading…</p>}

        <div className="space-y-4">
          {schemes.map((scheme) => (
            <div
              key={scheme._id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
            >
              <h2 className="text-xl font-semibold text-slate-900">
                {scheme.schemeName}
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-4 border border-slate-200">
                  <p className="text-sm font-semibold text-slate-900">
                    {t("eligibility")}
                  </p>
                  <ul className="mt-3 list-disc pl-5 text-slate-700 space-y-1">
                    {scheme.eligibility.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-white p-4 border border-slate-200">
                  <p className="text-sm font-semibold text-slate-900">
                    {t("benefits")}
                  </p>
                  <ul className="mt-3 list-disc pl-5 text-slate-700 space-y-1">
                    {scheme.benefits.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default EligibilityVisualizationPage;
