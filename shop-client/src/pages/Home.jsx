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

  useEffect(() => {
    AOS.init({ duration: 800 });
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
      </section>

      {/* Overview Section */}
      <section className="overview-section mb-8" data-aos="fade-up">
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        {loading ? (
          <div className="spinner">Loading...</div>
        ) : (
          <div className="overview-cards grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card income bg-green-100 p-4 rounded-lg shadow">
              <h3 className="font-semibold">Income</h3>
              <p className="text-lg">${summary.income}</p>
            </div>
            <div className="card expense bg-red-100 p-4 rounded-lg shadow">
              <h3 className="font-semibold">Expense</h3>
              <p className="text-lg">${summary.expense}</p>
            </div>
            <div className="card savings bg-blue-100 p-4 rounded-lg shadow">
              <h3 className="font-semibold">Savings</h3>
              <p className="text-lg">${summary.savings}</p>
            </div>
            <div className="card balance bg-yellow-100 p-4 rounded-lg shadow">
              <h3 className="font-semibold">Total Balance</h3>
              <p className="text-lg">${summary.totalBalance}</p>
            </div>
          </div>
        )}
      </section>

      {/* Budgeting Tips Section */}
      <section className="tips-section mb-8" data-aos="fade-up">
        <h2 className="text-2xl font-bold mb-4">Budgeting Tips</h2>
        <ul className="list-disc list-inside">
          <li>Track your expenses regularly.</li>
          <li>Set realistic savings goals.</li>
          <li>Review your budget monthly.</li>
        </ul>
      </section>

      {/* Financial Planning Section */}
      <section className="planning-section mb-8" data-aos="fade-up">
        <h2 className="text-2xl font-bold mb-4">
          Why Financial Planning Matters
        </h2>
        <p>
          Financial planning helps you manage your money, prepare for
          emergencies, and achieve your life goals. Start today for a secure
          tomorrow!
        </p>
      </section>

      {/* How It Works Section */}
      <section className="mb-8 flex flex-col items-center" data-aos="fade-up">
        <h2 className="text-2xl font-bold mb-4 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <div className="bg-base-100 p-6 rounded-xl shadow flex flex-col items-center">
            <span className="text-4xl mb-2">🔍</span>
            <span className="font-semibold mb-1">Browse Skills</span>
            <span className="text-sm text-gray-500 text-center">
              Explore a wide range of skills and find what interests you.
            </span>
          </div>
          <div className="bg-base-100 p-6 rounded-xl shadow flex flex-col items-center">
            <span className="text-4xl mb-2">💬</span>
            <span className="font-semibold mb-1">Connect & Book</span>
            <span className="text-sm text-gray-500 text-center">
              Contact providers and book sessions easily.
            </span>
          </div>
          <div className="bg-base-100 p-6 rounded-xl shadow flex flex-col items-center">
            <span className="text-4xl mb-2">🚀</span>
            <span className="font-semibold mb-1">Learn & Grow</span>
            <span className="text-sm text-gray-500 text-center">
              Attend sessions, learn new skills, and track your progress.
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
              “SkillSwap helped me learn guitar from scratch. The provider was
              super friendly and supportive!”
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
              “I improved my spoken English and gained confidence for job
              interviews. Highly recommended!”
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
              “The Python programming course was easy to follow and very
              practical. Loved the experience!”
            </p>
            <span className="font-semibold">Tanvir Ahmed</span>
          </div>
        </div>
      </section>
    </div>
  );
}
