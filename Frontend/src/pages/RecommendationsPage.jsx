import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import {
  createRecommendations,
  getRecommendationsByUser,
} from "../services/api.js";

const RecommendationsPage = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!userId) {
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await getRecommendationsByUser(userId);
        if (data.length === 0) {
          await createRecommendations(userId);
          const refreshed = await getRecommendationsByUser(userId);
          setRecommendations(refreshed);
        } else {
          setRecommendations(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    void loadRecommendations();
  }, [userId]);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900 mb-4">
          {t("recommendedSchemes")}
        </h1>

        {loading && <p className="text-slate-600">Loading…</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !userId && (
          <p className="text-slate-600">{t("noRecommendations")}</p>
        )}

        <div className="space-y-6">
          {recommendations.map((rec) => (
            <article
              key={rec.id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {rec.scheme.schemeName}
                  </h2>
                  <p className="mt-2 text-slate-600">
                    {rec.scheme.description}
                  </p>
                </div>
                <div className="rounded-full bg-white border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800">
                  Match {rec.matchScore}%
                </div>
              </div>
              <p className="mt-4 text-slate-700">{rec.explanation}</p>
              <Link
                to={`/schemes/${rec.scheme._id}`}
                className="mt-5 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                {t("schemeDetails")}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
};

export default RecommendationsPage;
