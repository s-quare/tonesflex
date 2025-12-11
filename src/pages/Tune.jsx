// src/pages/Tune.jsx
import { useEffect, useState, useRef } from "react";
import { useTonesFlex } from "../context/useTonesFlex";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const Tune = () => {
  const { mood, showToast, setHistory } = useTonesFlex();
  const navigate = useNavigate();
  const [step, setStep] = useState("confirm"); // "confirm" → "loading" → "result"
  const [playlistData, setPlaylistData] = useState(null);
  const [error, setError] = useState(null);
  const hasCalledAPI = useRef(false); // Fixes double call

  useEffect(() => {
    if (!mood || mood.trim() === "") {
      navigate("/", {replace: true});
    }
  }, [mood, navigate]);

  useEffect(() => {
    if (step !== "loading" && step !== "confirm" && step !== "result") {
      navigate("/error");
    }
  }, [step, navigate]);

  const handleProceed = async () => {
    setStep("loading");
    await generatePlaylistFromMood(mood);
  };

  const handleEditMood = () => {
    navigate("/");
  };

  const generatePlaylistFromMood = async (userMood) => {
    // Prevent double calls
    if (hasCalledAPI.current) return;
    hasCalledAPI.current = true;

    try {
      const response = await fetch("/api/spotify/playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: userMood }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to generate playlist");
      }

      // Create playlist with ID and metadata
      const playlistWithId = {
        ...data.playlist,
        id: `pl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        mood: userMood,
      };

      setPlaylistData(playlistWithId);
      setStep("result");
      showToast(
        `Playlist created: "${
          playlistWithId.title.length > 20
            ? `${playlistWithId.title.slice(0, 20)}...`
            : playlistWithId.title
        }"`
      );
    } catch (err) {
      setError(err);
      setStep("result");
      showToast("An error occurred");
    }
  };

  const handleViewPlaylist = () => {
    if (playlistData) {
      setHistory((prev) => [playlistData, ...prev]);
      navigate("/playlist", { state: { playlist: playlistData } });
    } else {
      navigate("/archive");
    }
  };

  const handleGenerateAnother = () => {
    navigate("/");
  };

  const handleViewHistory = () => {
    if (playlistData) setHistory((prev) => [playlistData, ...prev]);
    navigate("/archive");
  };

  // STEP 1: Mood Confirmation
  if (step === "confirm") {
    return (
      <div className="position-relative text-secondary px-4 f-10" style={{}}>
        <div
          className="d-grid pt-3 text-center w-100 max-w-500"
          style={{ minHeight: "calc(100svh - 50px)", placeItems: "center" }}
        >
          <p className="mb-4 text-muted fw-bold f-16">Curate playlist</p>
          <div className="bg-dark text-white rounded-3 px-3 py-5 mb-4 max-400 mx-auto">
            <p className="f-16 fw-bold mb-4">You need your playlist based on</p>
            <p className="f-20 fw-bold text-white opacity-75 m-2 line-clamp-1">
              "{mood}"
            </p>
          </div>

          <p className="text-muted fw-bold mt-5 mb-5">
            Create Spotify playlist based on this mood ?
          </p>

          <div
            className="d-grid gap-3 justify-content-center max-500 mx-auto px-3"
            style={{ gridTemplateColumns: "1fr 1fr" }}
          >
            <button
              onClick={handleProceed}
              className="bg-success py-2 hover-dark shadow f-10 w-100"
            >
              <i className="fa-solid fa-music me-2"></i>
              Yes, Create Playlist
            </button>
            <button
              onClick={handleEditMood}
              className="bg-transparent shadow text-muted f-10 py-2 hover-exp w-100"
            >
              <i className="fa-solid fa-pen me-2"></i>
              Edit Mood
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // STEP 2: Loading State
  if (step === "loading") {
    return (
      <div
        className="d-grid"
        style={{
          minHeight: "calc(100svh - 50px)",
          placeItems: "center",
          gridTemplateRows: "1fr auto",
        }}
      >
        <div className="text-center pt-2">
          <img
            src="/images/loading.png"
            style={{ height: "5vh" }}
            className="fa-spin mb-3"
            alt="Loading"
          />
          <p className="mt-4 f-16 fw-bold">Creating Your Playlist</p>
          <p className="text-muted f-12 max-400 mx-auto mt-2">
            Searching Spotify for your{" "}
            <span className="fw-bold text-teal">
              "{mood.length > 15 ? `${mood.slice(0, 15)}...` : mood}"
            </span>{" "}
            mood
          </p>
          <div className="mt-4 f-11 text-muted">
            <div className="mb-2 d-flex align-items-center justify-content-center">
              <i className="fa-solid fa-check text-teal me-2"></i>
              <span>
                Analyzing mood: "
                {mood.length > 25 ? `${mood.slice(0, 25)}...` : mood}"
              </span>
            </div>
            <div className="mb-2 d-flex align-items-center justify-content-center">
              <i className="fa-solid fa-spinner fa-spin text-teal me-2"></i>
              <span>Searching Spotify playlists</span>
            </div>
            <div className="d-flex align-items-center justify-content-center">
              <i className="fa-solid fa-spinner fa-spin text-teal me-2"></i>
              <span>Compiling tracks</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // STEP 3: Result State (Success or Error)
  if (step === "result")
    return (
      <div>
        <div
          className="d-grid text-center max-w-500 pt-3 px-3"
          style={{
            minHeight: "calc(100svh - 50px)",
            placeItems: "center",
          }}
        >
          {error ? (
            // ERROR STATE
            <>
              <i className="fa-solid fa-circle-exclamation text-danger fa-3x mb-3"></i>
              <h3 className="text-danger mb-3">Failed to Create Playlist</h3>
              <div className="card p-4 mb-4 bg-light">
                <p className="text-muted">
                  {error.error || "An error occurred. Try using a different mood phrase"}
                </p>
              </div>
            </>
          ) : (
            // SUCCESS STATE
            <>
              <i className="fa-solid fa-circle-check text-success fa-2x mb-3"></i>
              <h5 className="text-success mb-5">Playlist Created!</h5>
              <div className="bg-dark rounded-4 text-white max-500 mx-auto border-0 shadow p-4 mb-5">
                <p className="f-12 mb-4 monospace fw-bold">Your playlist:</p>
                <h5 className="fw-bold line-clamp-2">"{playlistData.title}"</h5>
                <p className="f-12 mt-4 pt-2">
                  {playlistData.description.length > 100
                    ? `${playlistData.description.slice(0, 100)}...`
                    : playlistData.description}{" "}
                  {/**/}
                </p>
                <p className="f-12 text-secondary fw-bold mb-0 mt-4">
                  <i className="fa-solid fa-music me-1"></i>
                  {playlistData.tracks?.length || 0} tracks
                </p>
              </div>
            </>
          )}

          <div className="d-flex flex-column gap-3 mt-4">
            {!error && playlistData && (
              <button
                onClick={handleViewPlaylist}
                className="bg-secondary max-350 mx-auto f-12 py-2 rounded-pill px-5 d-block"
              >
                <i className="fa-solid fa-play me-2"></i>
                Add to playlists
              </button>
            )}

            <button
              onClick={() =>
                !error
                  ? confirm("Playlist won't be saved. Proceed?") &&
                    handleGenerateAnother()
                  : handleGenerateAnother()
              }
              className="fw-light bg-transparent text-dark"
            >
              <i className="fa-solid fa-plus text-success me-2"></i>
              Create New
            </button>

            <button
              onClick={handleViewHistory}
              className="bg-success d-block mx-auto w-100 py-2 rounded-0 max-400 my-4"
            >
              <i className="fa-solid fa-history me-2"></i>
              Playlist history
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );

  return <div></div>;
};

export default Tune;
