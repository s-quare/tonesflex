import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TonesFlexProvider } from "./context/TonesFlexProvider";
import Home from "./pages/Home";
import Tune from "./pages/Tune";
import Playlist from "./pages/Playlist";
import Archive from "./pages/Archive";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import "./App.css";
import useNetworkStatus from "./context/useNetworkStatus";
import Offline from "./pages/Offline";

import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/ubuntu/400.css";
import "@fontsource/ubuntu/700.css";
import "./index.css";

function App() {

  const isOnline = useNetworkStatus();

  
  return (
    <TonesFlexProvider>
      <Router>
        <div className="app">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tune" element={<Tune />} />
            <Route path="/playlist" element={<Playlist />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
      {!isOnline && <Offline />}
    </TonesFlexProvider>
  );
}

export default App;
