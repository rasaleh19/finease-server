import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./Routes/router.jsx";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
export default App;
