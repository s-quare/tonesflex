// src/pages/Playlist.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTonesFlex } from "../context/useTonesFlex";

const Playlist = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast, history, setHistory, setMood, cleanHTML } = useTonesFlex();

  const [playlist, setPlaylist] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [progress, setProgress] = useState(0);

  // Get playlist from navigation state or history
  useEffect(() => {
    // Try to get from navigation state first
    if (location.state?.playlist) {
      setPlaylist(location.state.playlist);
    } else if (history.length > 0) {
      // Fallback: get latest from history
      showToast("Showing most recent playlist");
      setPlaylist(history[0]);
    } else {
      // No playlist found, redirect home
      navigate("/archive");
    }
  }, [location, navigate, showToast, history]);

  // Format duration from milliseconds to MM:SS
  const formatDuration = (ms) => {
    if (!ms) return "0:00";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Play track preview
  const playTrack = (track) => {
    if (currentTrack?.id === track.id && audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
      return;
    }

    // Stop current audio
    if (audio) {
      audio.pause();
    }

    // If track has preview URL
    if (track.previewUrl) {
      const newAudio = new Audio(track.previewUrl);
      newAudio.addEventListener("timeupdate", () => {
        setProgress((newAudio.currentTime / newAudio.duration) * 100);
      });
      newAudio.addEventListener("ended", () => {
        setIsPlaying(false);
        setProgress(0);
      });
      newAudio.play();

      setAudio(newAudio);
      setCurrentTrack(track);
      setIsPlaying(true);
    } else {
      showToast("No preview available for this track");
      setCurrentTrack(track);
    }
  };

  // Stop playback
  const stopPlayback = () => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
      setProgress(0);
    }
  };

  // Open in Spotify
  const openInSpotify = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  // Regenerate playlist
  const regeneratePlaylist = () => {
    if (playlist?.mood) {
      setMood(playlist?.mood);
      navigate("/tune");
    } else {
      navigate("/");
    }
  };

  // Share playlist
  const sharePlaylist = () => {
    if (navigator.share) {
      navigator.share({
        title: playlist?.title || "My Playlist",
        text: `Check out my "${playlist?.mood}" playlist on ToneFlex!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard!");
    }
  };

  // Delete from history
  const deleteFromHistory = () => {
    if (playlist && window.confirm("Remove this playlist from history?")) {
      const updatedHistory = history.filter((p) => p.id !== playlist.id);
      setHistory(updatedHistory);
      showToast("Playlist removed from history");

      // Navigate to home or archive
      if (updatedHistory.length > 0) {
        navigate("/archive");
      } else {
        navigate("/");
      }
    }
  };

  if (!playlist) {
    return (
      <div
        className="d-grid"
        style={{ minHeight: "calc(100svh - 50px)", placeItems: "center" }}
      >
        <img
          src="/images/loading.png"
          className="fa-spin"
          style={{ height: "5vh" }}
          alt="Loading..."
        />
        <p className="mt-3 f-12 text-muted">Loading playlist...</p>
      </div>
    );
  }

  return (
    <div className="pb-5" style={{ minHeight: "calc(100svh - 50px)" }}>
      {/* Header */}
      <div className="p-4 my-3">
        <button
          onClick={() => navigate("/")}
          className="btn f-10 fw-bold py-1 btn-outline-secondary"
        >
          <i className="fa-solid fa-angle-left me-1"></i> Home
        </button>
      </div>

      {/* Playlist Header */}
      <div className="px-4">
        <div className="d-flex gap-3 align-items-center">
          {/* Cover Image */}
          <div className="flex-shrink-0 cursor">
            <div
              className="rounded-pill shadow-lg bg-dark"
              style={{ width: "80px", height: "80px", overflow: "hidden" }}
            >
              {playlist.coverImage ? (
                <img
                  src={playlist.coverImage}
                  alt={playlist.title}
                  className="w-100 h-100 object-fit-cover"
                />
              ) : (
                <div className="w-100 h-100 d-grid place-items-center bg-gradient-teal">
                  <i
                    className="fa-solid fa-music text-white"
                    style={{ fontSize: "2rem" }}
                  ></i>
                </div>
              )}
            </div>
          </div>

          {/* Playlist Info */}
          <div className="flex-grow-1">
            <p className="f-8 text-muted fw-bold mb-1">Spotify playlist</p>
            <h1 className="f-20 fw-bold mb-1 line-clamp-2">{playlist.title}</h1>
            <p className="f-12 text-muted mb-2 line-clamp-3" dangerouslySetInnerHTML={{__html: cleanHTML(playlist.description)}}>
            </p>
            <p className="text-muted f-12">
              <span onClick={sharePlaylist} className="text-success cursor">
                Share
              </span>
              <span className=""> | </span>
              <span onClick={deleteFromHistory} className="text-danger cursor">Remove from history</span>
            </p>

            <div
              style={{ gridTemplateColumns: "auto auto 1fr" }}
              className="d-grid align-items-center gap-3 mt-3"
            >
              <div className="d-flex align-items-center gap-1">
                <i className="fa-solid fa-music text-teal f-10"></i>
                <span className="f-10">
                  {playlist.tracks?.length || 0} track
                  {playlist?.tracks.length > 1 && "s"}
                </span>
              </div>
              <div className="d-flex align-items-center gap-1">
                <i className="fa-regular fa-clock text-teal f-10"></i>
                <span className="f-10">
                  {formatDuration(
                    playlist.tracks?.reduce(
                      (sum, track) => sum + (track.duration || 0),
                      0
                    )
                  )}
                </span>
              </div>
              {playlist.mood && (
                <div
                  style={{ flexGrow: 1 }}
                  className="d-flex align-items-center gap-1 line-clamp-1"
                >
                  <i className="fa-solid fa-face-smile text-teal f-10"></i>
                  <span className="f-10 line-clamp-1">{playlist.mood} </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className="d-grid gap-4 mt-4"
          style={{ gridTemplateColumns: "1fr 1fr" }}
        >
          <button
            onClick={regeneratePlaylist}
            className="bg-transparent shadow text-muted f-12 py-2"
          >
            <i className="fa-solid fa-wand-magic-sparkles me-2"></i>
            Regenerate
          </button>
          {playlist.spotifyUrl && (
            <button
              onClick={() => openInSpotify(playlist.spotifyUrl)}
              className="btn btn-success fw-bold f-12 py-2"
            >
              <i className="fa-brands fa-spotify me-2"></i>
              Open in Spotify
            </button>
          )}
        </div>
      </div>

      {/* Now Playing Bar */}
      {currentTrack && (
        <div
          className="fixed-bottom bg-dark text-white p-3"
          style={{ bottom: "0", left: "0", right: "0" }}
        >
          <div className="container">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <img
                  src={currentTrack.albumArt || playlist.coverImage}
                  alt={currentTrack.album}
                  className="rounded"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
                <div>
                  <p className="f-12 fw-bold mb-0 line-clamp-1">
                    {currentTrack.name}
                  </p>
                  <p className="f-10 text-muted mb-0 line-clamp-1">
                    {currentTrack.artist}
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-center gap-3">
                {audio && currentTrack.previewUrl && (
                  <>
                    <button
                      onClick={stopPlayback}
                      className="btn btn-sm btn-outline-light"
                    >
                      <i className="fa-solid fa-stop"></i>
                    </button>
                    <div style={{ width: "100px" }}>
                      <div className="progress" style={{ height: "4px" }}>
                        <div
                          className="progress-bar bg-teal"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </>
                )}
                <button
                  onClick={() => openInSpotify(currentTrack.spotifyUrl)}
                  className="btn btn-sm btn-success"
                >
                  <i className="fa-brands fa-spotify"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tracks List */}
      <div className="px-3 mt-5">
        <h3 className="f-16 fw-bold mb-3">Tracks</h3>

        <div className="list-group">
          {playlist.tracks?.map((track, index) => (
            <div
              key={`${track.id}-${index}`}
              className="list-group-item border-0 bg-transparent px-0 py-3"
            >
              <div
                className="d-grid align-items-center gap-3"
                style={{ gridTemplateColumns: "auto auto 1fr auto" }}
              >
                {/* Track Number */}
                <div className="text-muted f-14">{index + 1}.</div>

                {/* Album Art */}
                <div
                  className="rounded-2 overflow-hidden"
                  style={{ width: "50px", height: "50px" }}
                >
                  {track.albumArt ? (
                    <img
                      src={track.albumArt}
                      alt={track.album}
                      className="w-100 h-100 object-fit-cover"
                    />
                  ) : (
                    <div className="w-100 h-100 bg-gray-800 d-grid place-items-center">
                      <i className="fa-solid fa-music text-gray-500"></i>
                    </div>
                  )}
                </div>

                {/* Track Info */}
                <div>
                  <p className="f-14 fw-bold mb-1 line-clamp-1">{track.name}</p>
                  <p className="f-12 text-muted mb-0 line-clamp-1">
                    {track.artist}
                  </p>
                  <p
                    className="f-11 text-muted mb-0 line-clamp-1 d-grid"
                    style={{ gridTemplateColumns: "1fr auto" }}
                  >
                    <span className="line-clamp-1">{track.album}</span>
                    <span>• {formatDuration(track.duration)}</span>
                  </p>
                </div>

                {/* Actions */}
                <div className="d-flex gap-2">
                  {track.previewUrl ? (
                    <button
                      onClick={() => playTrack(track)}
                      className={`btn cursor btn-sm ${
                        currentTrack?.id === track.id && isPlaying
                          ? "bg-teal text-white"
                          : "btn-outline-teal"
                      }`}
                      style={{ width: "40px", height: "40px" }}
                    >
                      <i
                        className={`fa-solid ${
                          currentTrack?.id === track.id && isPlaying
                            ? "fa-pause"
                            : "fa-play"
                        }`}
                      ></i>
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      style={{ width: "40px", height: "40px" }}
                      title="No preview available"
                      onClick={()=>showToast("No preview available for this track. Open with spotify")}
                    >
                      <i className="fa-solid fa-play"></i>
                    </button>
                  )}

                  <button
                    onClick={() => openInSpotify(track.spotifyUrl)}
                    className="btn btn-sm btn-success"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <i className="fa-brands fa-spotify"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {playlist.tracks?.length === 0 && (
          <div className="text-center py-5">
            <i
              className="fa-solid fa-music-slash text-muted"
              style={{ fontSize: "3rem" }}
            ></i>
            <p className="mt-3 text-muted">No tracks available</p>
          </div>
        )}
      </div>

      {/* Spotify Attribution */}
      {!playlist.isMock && (
        <div className="text-center mt-4">
          <p className="f-10 text-muted">
            Powered by <i className="fa-brands fa-spotify text-success"></i>{" "}
            Spotify
          </p>
        </div>
      )}
    </div>
  );
};

export default Playlist;
