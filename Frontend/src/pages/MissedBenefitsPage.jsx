import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getAllSchemes } from "../services/api.js";

const MissedBenefitsPage = () => {
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
          {t("missedBenefits")}
        </h1>
        <p className="text-slate-600 mb-6">{t("missedBenefitsDescription")}</p>

        {loading && <p className="text-slate-600">Loading…</p>}

        <div className="space-y-4">
          {schemes.slice(0, 3).map((scheme) => (
            <div
              key={scheme._id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
            >
              <h2 className="text-xl font-semibold text-slate-900">
                {scheme.schemeName}
              </h2>
              <p className="mt-2 text-slate-600">{scheme.description}</p>
              <p className="mt-4 text-slate-700">{t("missedBenefitExample")}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default MissedBenefitsPage;
