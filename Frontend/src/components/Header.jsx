import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();

  const publicItems = [
    { to: "/", labelKey: "home" },
    { to: "/schemes", labelKey: "schemes" },
    { to: "/chat", labelKey: "chat" },
  ];

  const privateItems = [
    { to: "/dashboard", labelKey: "dashboard" },
    { to: "/search", labelKey: "search" },
    { to: "/saved", labelKey: "savedSchemes" },
    { to: "/missed-benefits", labelKey: "missedBenefits" },
    { to: "/eligibility-visualization", labelKey: "eligibility" },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <Link to="/" className="text-xl font-semibold text-slate-900">
            BharatAI
          </Link>
          <p className="text-sm text-slate-500">{t("welcomeDescription")}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {publicItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-slate-700 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              {t(item.labelKey)}
            </Link>
          ))}

          {user &&
            privateItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-slate-700 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                {t(item.labelKey)}
              </Link>
            ))}

          {user ? (
            <button
              onClick={logout}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              {t("logout")}
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-700 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                {t("login")}
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                {t("register")}
              </Link>
            </>
          )}

          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="border border-slate-300 rounded-md px-3 py-2 text-sm bg-white"
            aria-label={t("language")}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;
