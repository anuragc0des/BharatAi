import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getSavedSchemes } from "../services/dashboardApi.js";

const DashboardPage = () => {
  const { t } = useLanguage();
  const [savedSchemes, setSavedSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSaved = async () => {
      setLoading(true);
      try {
        const schemes = await getSavedSchemes();
        setSavedSchemes(schemes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    void loadSaved();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900 mb-4">
          {t("dashboard")}
        </h1>
        <p className="text-slate-600 mb-6">{t("dashboardDescription")}</p>

        {loading && <p className="text-slate-600">Loading saved schemes…</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && savedSchemes.length === 0 && (
          <p className="text-slate-600">{t("emptySavedSchemes")}</p>
        )}

        <div className="space-y-6">
          {savedSchemes.map((scheme) => (
            <article
              key={scheme._id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
            >
              <h2 className="text-xl font-semibold text-slate-900">
                {scheme.schemeName}
              </h2>
              <p className="mt-2 text-slate-600">{scheme.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {scheme.benefits.slice(0, 3).map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-white px-3 py-1 text-sm text-slate-700 border border-slate-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
