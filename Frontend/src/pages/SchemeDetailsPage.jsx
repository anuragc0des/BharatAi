import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getSchemeById } from "../services/api.js";

const SchemeDetailsPage = () => {
  const { t } = useLanguage();
  const { schemeId } = useParams();
  const [scheme, setScheme] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadScheme = async () => {
      setLoading(true);
      try {
        const data = await getSchemeById(schemeId);
        setScheme(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    void loadScheme();
  }, [schemeId]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-red-600">
        {error}
      </div>
    );
  }

  if (!scheme) {
    return null;
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <Link
          to="/schemes"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← {t("backToSchemes")}
        </Link>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">
          {scheme.schemeName}
        </h1>
        <p className="mt-3 text-slate-600">{scheme.description}</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="font-semibold text-slate-900">{t("benefits")}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              {scheme.benefits.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="font-semibold text-slate-900">{t("eligibility")}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              {scheme.eligibility.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="font-semibold text-slate-900">
              {t("requiredDocuments")}
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              {scheme.requiredDocuments.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="font-semibold text-slate-900">
              {t("applicationProcess")}
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              {scheme.applicationProcess.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-8">
          <a
            href={scheme.officialLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            {t("officialLink")}
          </a>
        </div>
      </div>
    </main>
  );
};

export default SchemeDetailsPage;
