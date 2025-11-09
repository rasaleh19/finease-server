import { createBrowserRouter } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import MyTransactions from "../pages/MyTransactions";
import Profile from "../pages/Profile";
import TransactionDetails from "../pages/TransactionDetails";
import ProtectedRoute from "../components/ProtectedRoute";
import AddTransaction from "../pages/AddTransaction";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      { path: "", element: <Home /> },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      { path: "my-transactions", element: <MyTransactions /> },
      { path: "transaction/:id", element: <TransactionDetails /> },
      { path: "add-transaction", element: <AddTransaction /> },
    ],
  },
  { path: "reports", element: <Reports /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "*", element: <h2>Error404</h2> },
]);

export default router;
