import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Home() {
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState({
    totalBalance: 0,
    income: 0,
    expense: 0,
    savings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.setAttribute("data-theme", storedTheme);
  }, []);

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };
    window.addEventListener("storage", handleThemeChange);
    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);

  useEffect(() => {
    async function fetchSummary() {
      if (!user) return setLoading(false);
      try {
        const res = await fetch(`http://localhost:3000/summary/${user.id}`);
        const data = await res.json();
        setSummary(data);
      } catch {
        setSummary({
          totalBalance: 0,
          income: 0,
          expense: 0,
          savings: 0,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Banner Section */}
      <section className="banner-section mb-8" data-aos="fade-up">
        <h1 className="text-4xl font-extrabold">FinEase</h1>
        <p className="tagline text-xl">
          Empower your financial future. Track, plan, and grow!
        </p>
        <img
          src="/expense.jpg"
          alt="Finance Banner"
          className="w-full max-h-72 object-cover rounded-xl mt-4 shadow"
        />
      </section>

      {/* Overview Section */}
      <section className="overview-section mb-8" data-aos="fade-up">
        <h2 className="text-2xl font-bold mb-4 text-center">Overview</h2>
        {loading ? (
          <div className="spinner">Loading...</div>
        ) : (
          <div className="overview-cards grid grid-cols-1 md:grid-cols-4 gap-4">
            <div
              className={
                `card income p-4 rounded-lg shadow` +
                (theme === "dark"
                  ? " bg-green-900 text-green-100"
                  : " bg-green-100 text-green-900")
              }
            >
              <h3 className="font-semibold">Income</h3>
              <p className="text-lg">${summary.income}</p>
            </div>
            <div
              className={
                `card expense p-4 rounded-lg shadow` +
                (theme === "dark"
                  ? " bg-red-900 text-red-100"
                  : " bg-red-100 text-red-900")
              }
            >
              <h3 className="font-semibold">Expense</h3>
              <p className="text-lg">${summary.expense}</p>
            </div>
            <div
              className={
                `card savings p-4 rounded-lg shadow` +
                (theme === "dark"
                  ? " bg-blue-900 text-blue-100"
                  : " bg-blue-100 text-blue-900")
              }
            >
              <h3 className="font-semibold">Savings</h3>
              <p className="text-lg">${summary.savings}</p>
            </div>
            <div
              className={
                `card balance p-4 rounded-lg shadow` +
                (theme === "dark"
                  ? " bg-yellow-900 text-yellow-100"
                  : " bg-yellow-100 text-yellow-900")
              }
            >
              <h3 className="font-semibold">Total Balance</h3>
              <p className="text-lg">
                ${Number(summary.totalBalance).toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Budgeting Tips Section */}
      <section className="tips-section mb-8" data-aos="fade-up">
        <h2 className="text-2xl font-bold mb-4 text-center">Budgeting Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-base-100 p-6 rounded-xl shadow flex flex-col items-center">
            <span className="text-4xl mb-2">📊</span>
            <span className="font-semibold mb-2">Track Your Expenses</span>
            <span className="text-sm text-gray-500 text-center">
              Monitor every transaction to understand your spending habits.
            </span>
          </div>
          <div className="bg-base-100 p-6 rounded-xl shadow flex flex-col items-center">
            <span className="text-4xl mb-2">🎯</span>
            <span className="font-semibold mb-2">Set Realistic Goals</span>
            <span className="text-sm text-gray-500 text-center">
              Define achievable savings and spending targets for each month.
            </span>
          </div>
          <div className="bg-base-100 p-6 rounded-xl shadow flex flex-col items-center">
            <span className="text-4xl mb-2">🔄</span>
            <span className="font-semibold mb-2">Review Regularly</span>
            <span className="text-sm text-gray-500 text-center">
              Analyze your budget and adjust as needed to stay on track.
            </span>
          </div>
        </div>
      </section>

      {/* Financial Planning Section */}
      <section className="planning-section mb-8" data-aos="fade-up">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Why Financial Planning Matters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-base-100 p-6 rounded-xl shadow flex flex-col items-center">
            <span className="text-4xl mb-2">💰</span>
            <span className="font-semibold mb-2">Manage Your Money</span>
            <span className="text-sm text-gray-500 text-center">
              Financial planning helps you control your income, expenses, and
              investments.
            </span>
          </div>
          <div className="bg-base-100 p-6 rounded-xl shadow flex flex-col items-center">
            <span className="text-4xl mb-2">🛡️</span>
            <span className="font-semibold mb-2">Prepare for Emergencies</span>
            <span className="text-sm text-gray-500 text-center">
              Build a safety net for unexpected events and secure your future.
            </span>
          </div>
          <div className="bg-base-100 p-6 rounded-xl shadow flex flex-col items-center">
            <span className="text-4xl mb-2">🏆</span>
            <span className="font-semibold mb-2">Achieve Life Goals</span>
            <span className="text-sm text-gray-500 text-center">
              Set and reach your financial goals for a better tomorrow.
            </span>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mb-8" data-aos="fade-up">
        <h2 className="text-2xl font-bold mb-4 text-center">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-base-100 p-6 rounded-xl shadow flex flex-col items-center">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="User"
              className="w-16 h-16 rounded-full mb-2"
            />
            <p className="italic mb-2">
              “FinEase made budgeting so simple! I can finally track my expenses
              and save more every month.”
            </p>
            <span className="font-semibold">Ayesha Rahman</span>
          </div>
          <div className="bg-base-100 p-6 rounded-xl shadow flex flex-col items-center">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="User"
              className="w-16 h-16 rounded-full mb-2"
            />
            <p className="italic mb-2">
              “With FinEase, I set financial goals and actually achieve them.
              The reports are super helpful!”
            </p>
            <span className="font-semibold">Imran Hossain</span>
          </div>
          <div className="bg-base-100 p-6 rounded-xl shadow flex flex-col items-center">
            <img
              src="https://randomuser.me/api/portraits/men/65.jpg"
              alt="User"
              className="w-16 h-16 rounded-full mb-2"
            />
            <p className="italic mb-2">
              “FinEase keeps me motivated to save and invest. I love seeing my
              progress every month!”
            </p>
            <span className="font-semibold">Tanvir Ahmed</span>
          </div>
        </div>
      </section>
    </div>
  );
}
