import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getAllSchemes } from "../services/api.js";

const SchemeComparisonPage = () => {
  const { t, language } = useLanguage();
  const [schemes, setSchemes] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const all = await getAllSchemes(language);
      setSchemes(all);
      setLoading(false);
    };
    void load();
  }, [language]);

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
      <div className="rounded-3xl bg-white border border-slate-200 p-4 sm:p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900 mb-4">
          {t("compareSchemes")}
        </h1>
        <p className="text-slate-600 mb-6">
          {t("compareDescription")}
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
          <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-6 overflow-hidden">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              {t("comparison")}
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full min-w-[600px] border-collapse text-left text-sm text-slate-700">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="p-4 font-semibold text-slate-900 w-1/4">{t("featureDetails")}</th>
                    {comparisonItems.map((scheme) => (
                      <th key={scheme._id} className="p-4 font-semibold text-slate-900 w-3/8">
                        {scheme.schemeName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-4 font-semibold text-slate-900 bg-slate-50/50">{t("description")}</td>
                    {comparisonItems.map((scheme) => (
                      <td key={scheme._id} className="p-4 align-top">{scheme.description}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-900 bg-slate-50/50">{t("benefits")}</td>
                    {comparisonItems.map((scheme) => (
                      <td key={scheme._id} className="p-4 align-top">
                        <ul className="list-disc pl-4 space-y-1">
                          {scheme.benefits.map((b, idx) => <li key={idx}>{b}</li>)}
                        </ul>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-900 bg-slate-50/50">{t("eligibility")}</td>
                    {comparisonItems.map((scheme) => (
                      <td key={scheme._id} className="p-4 align-top">
                        <ul className="list-disc pl-4 space-y-1">
                          {scheme.eligibility.map((e, idx) => <li key={idx}>{e}</li>)}
                        </ul>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-900 bg-slate-50/50">{t("requiredDocuments")}</td>
                    {comparisonItems.map((scheme) => (
                      <td key={scheme._id} className="p-4 align-top">
                        <ul className="list-disc pl-4 space-y-1">
                          {scheme.requiredDocuments.map((d, idx) => <li key={idx}>{d}</li>)}
                        </ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default SchemeComparisonPage;
