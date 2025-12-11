import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const headerLinks = [
    { name: "STUDIO", path: "/" },
    { name: "TUNE", path: "/tune" },
    { name: "PLAYLIST", path: "/playlist" },
    { name: "ARCHIVE", path: "/archive" },
  ];

  return (
    <div className="position-sticky" style={{paddingTop: 10, top: 0, zIndex: 100,}}>
      <div className="bg-bg w-100" style={{position: 'absolute', top: 0, right: 0, height: 30}}></div>
      <div
        className="mx-3 shadow rounded-pill"
        style={{
          backgroundColor: 'rgba(255,255,255,0.8)',
          backdropFilter: "blur(2px)",
          height: 40,
        }}
      >
        <div className="fw-bold max-800 h-100 mx-auto px-3 d-flex justify-content-between align-items-center">
          <div className="text-muted f-12 serif">
            TONES<span className="text-success">FLEX</span>
          </div>
          <div className="d-flex text-muted gap-2 justify-content-between align-items-center">
            {headerLinks.map((link) => (
              <button
                key={link.name}
                style={{ color: currentPath === link.path ? "black" : "gray" }}
                onClick={() => navigate(link.path)}
                className="p-0 f-10 bg-transparent"
                disabled={currentPath === link.path}
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
