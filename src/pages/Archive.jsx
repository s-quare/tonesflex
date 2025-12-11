// src/pages/Archive.jsx
import { useTonesFlex } from "../context/useTonesFlex";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { format } from "timeago.js";

const Archive = () => {
  const { history, setHistory } = useTonesFlex();
  const navigate = useNavigate();

  // Clear all history
  const clearHistory = () => {
    if (window.confirm("Clear all playlist history?")) {
      localStorage.removeItem("tonesflex_history");
      setHistory([]);
    }
  };

  // Delete single playlist
  const deletePlaylist = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Remove this playlist from history?")) {
      const updatedHistory = history.filter((p) => p.id !== id);
      setHistory(updatedHistory);
    }
  };

  // Navigate to playlist
  const viewPlaylist = (playlist) => {
    navigate("/playlist", { state: { playlist } });
  };

  if (history.length === 0) {
    return (
      <div
        className="d-grid"
        style={{
          minHeight: "calc(100svh - 50px)",
          gridTemplateRows: "1fr auto",
        }}
      >
        <div className="p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <button
              onClick={() => navigate("/")}
              className="btn btn-sm btn-outline-secondary fw-bold f-10"
            >
              <i className="fa-solid fa-angle-left me-1"></i>Home
            </button>
            <h4 className="mb-0 fw-bold">History</h4>
            <div style={{ width: "70px" }}></div> {/* Spacer */}
          </div>

          <div className="text-center py-5">
            <i
              className="fa-solid fa-ban text-muted"
              style={{ fontSize: "2rem" }}
            ></i>
            <p className="mt-3 text-muted">No playlist history yet</p>
            <button
              onClick={() => navigate("/")}
              className="btn bg-teal text-white mt-3"
            >
              <i className="fa-solid fa-plus me-1"></i> Create Your First
              Playlist
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="p-4" style={{ minHeight: "calc(100svh - 50px)" }}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <button
          onClick={() => navigate("/")}
          className="btn btn-sm btn-outline-secondary fw-bold f-10"
        >
          <i className="fa-solid fa-angle-left me-1"></i> Home
        </button>
        <h4 className="mb-0 fw-bold">History ({history.length})</h4>
        <button
          onClick={clearHistory}
          className="btn btn-sm btn-outline-danger f-10 fw-bold"
        >
          Clear All
        </button>
      </div>
      <p className="mt-5 ms-3 f-8 text-secondary fw-bold">
        Scroll through saved moods and instantly jump into any playlist.{" "}
      </p>
      <div
        className="p-2 d-block d-sm-grid gap-3"
        style={{
          gridTemplateColumns: "repeat(2, 1fr)",
          overflowX: "scroll",
          scrollbarWidth: "none",
        }}
      >
        {history.map(
          (playlist, index) =>
            playlist && (
              <div
              data-aos="fade-up"
              data-aos-delay={index * 100}
                key={playlist.id}
                style={{
                  minHeight: 200,
                  background: `linear-gradient(rgba(0,0,0,0.75)), url(${
                    playlist.coverImage
                      ? playlist.coverImage
                      : "/images/fallback.png"
                  }) center/cover no-repeat`,
                }}
                className="border-0 shadow-sm hover-exp-sm text-white rounded-3 px-2 py-3 mb-3 cursor-pointer d-flex flex-column justify-content-between"
              >
                <div className="d-flex f-8 justify-content-between align-items-center">
                  <p className="mb-0 text-secondary fw-bold">
                    <span className="text-success">Spotify</span> •{" "}
                    {format(playlist.createdAt)}
                  </p>
                  <p
                    className="m-0 text-danger fw-bold"
                    onClick={(e) => deletePlaylist(playlist.id, e)}
                  >
                    Remove
                  </p>
                </div>

                <div>
                  <p className="f-10 fw-bold mb-0 line-clamp-1">
                    {playlist.title}
                  </p>
                  <p className="f-10 mb-1 px-1 line-clamp-1">
                    {playlist.description}
                  </p>

                  <div className="f-10 mt-2 d-flex align-items-center justify-content-between gap-3">
                    <span className="f-11">
                      <i className="fa-solid fa-music text-secondary me-1"></i>
                      {playlist.tracks?.length || 0} track
                      {playlist.tracks?.length > 1 ? "s" : ""}.
                    </span>
                    <button
                      onClick={() => viewPlaylist(playlist)}
                      style={{ backdropFilter: "blur(2px)" }}
                      className="f-8 px-2 hover-exp fw-bold text-success bg-transparent rounded-pill shadow"
                    >
                      View
                      <i className="fa-solid ms-1 fa-sign-in"></i>
                    </button>
                  </div>
                </div>
              </div>
            )
        )}
      </div>

      {/* Summary */}
      <div className="text-center mt-4">
        <button
          onClick={() => navigate("/")}
          className="bg-transparent text-dark shadow f-10 px-4 py-2 mt-5 hover-exp"
        >
          <i className="fa-solid fa-plus me-1"></i> Create New Playlist
        </button>
      </div>
    </div>
  );
};

export default Archive;
