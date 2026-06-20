import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";

const LandingPage = () => {
  const { t } = useLanguage();

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <section className="rounded-3xl bg-slate-50 border border-slate-200 p-10 shadow-sm">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
              {t("welcomeTitle")}
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl font-semibold text-slate-900">
              {t("welcomeTitle")}
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              {t("welcomeDescription")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/profile"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                {t("getStarted")}
              </Link>
              <Link
                to="/schemes"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                {t("learnMore")}
              </Link>
            </div>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              {t("recommendedSchemes")}
            </h2>
            <ul className="space-y-4 text-slate-600">
              <li className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <p className="font-semibold">PM Kisan Samman Nidhi</p>
                <p className="text-sm">
                  Farmer income support scheme for small and marginal farmers.
                </p>
              </li>
              <li className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <p className="font-semibold">PM Kaushal Vikas Yojana</p>
                <p className="text-sm">
                  Training and certification support for eligible youth.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
