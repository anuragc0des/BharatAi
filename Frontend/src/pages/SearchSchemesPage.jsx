import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getAllSchemes } from "../services/api.js";

const SearchSchemesPage = () => {
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
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

  const categories = useMemo(
    () => [...new Set(schemes.map((scheme) => scheme.category))],
    [schemes],
  );

  const filtered = useMemo(
    () =>
      schemes.filter((scheme) => {
        const matchesSearch =
          scheme.schemeName.toLowerCase().includes(search.toLowerCase()) ||
          scheme.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category ? scheme.category === category : true;
        return matchesSearch && matchesCategory;
      }),
    [schemes, search, category],
  );

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900 mb-4">
          {t("searchSchemes")}
        </h1>
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          >
            <option value="">{t("allCategories")}</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {loading && <p className="text-slate-600">Loading…</p>}

        <div className="space-y-5">
          {filtered.map((scheme) => (
            <div
              key={scheme._id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
            >
              <h2 className="text-xl font-semibold text-slate-900">
                {scheme.schemeName}
              </h2>
              <p className="mt-2 text-slate-600">{scheme.description}</p>
              <p className="mt-3 text-sm font-medium text-slate-700">
                {scheme.category}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default SearchSchemesPage;
