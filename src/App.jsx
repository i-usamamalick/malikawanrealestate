import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import AppRoutes from "./routes/AppRoutes"; // Import the new routing file

const App = () => {
  return (
    <Router>
      <Navbar />
      <AppRoutes /> {/* Use the new routing component */}
      <Footer />
    </Router>
  );
};

export default App;
