import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getAllSchemes } from "../services/api.js";

const SchemeComparisonPage = () => {
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const all = await getAllSchemes();
      setSchemes(all);
      setLoading(false);
    };
    void load();
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id].slice(-2),
    );
  };

  const comparisonItems = schemes.filter((scheme) =>
    selected.includes(scheme._id),
  );

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900 mb-4">
          {t("compareSchemes")}
        </h1>
        <p className="text-slate-600 mb-6">
          Select up to two schemes to compare core details.
        </p>

        {loading && <p className="text-slate-600">Loading…</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          {schemes.map((scheme) => (
            <button
              key={scheme._id}
              type="button"
              onClick={() => toggleSelect(scheme._id)}
              className={`rounded-3xl border p-5 text-left ${
                selected.includes(scheme._id)
                  ? "border-slate-900 bg-slate-100"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <h2 className="text-xl font-semibold text-slate-900">
                {scheme.schemeName}
              </h2>
              <p className="mt-2 text-slate-600">{scheme.description}</p>
            </button>
          ))}
        </div>

        {comparisonItems.length > 0 && (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              {t("comparison")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {comparisonItems.map((scheme) => (
                <div
                  key={scheme._id}
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <h3 className="text-lg font-semibold text-slate-900">
                    {scheme.schemeName}
                  </h3>
                  <p className="mt-2 text-slate-600">{scheme.description}</p>
                  <div className="mt-4 space-y-3 text-sm text-slate-700">
                    <div>
                      <p className="font-semibold">Benefits</p>
                      <p>{scheme.benefits.join(", ")}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Eligibility</p>
                      <p>{scheme.eligibility.join(", ")}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Docs</p>
                      <p>{scheme.requiredDocuments.join(", ")}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default SchemeComparisonPage;
