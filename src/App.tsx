import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRouter from "./router/AppRoutes";

const App = () => {
  return (
    <>
      <AppRouter />
      <ToastContainer aria-label="Notification Container" />
    </>
  );
};

export default App;
