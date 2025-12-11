const Offline = () => {
  return (
    <div style={{ zIndex: 200, position: "fixed", top: 0, left: 0, right: 0 }}>
      <div
        className="bg-dark text-white text-center d-grid fw-bold"
        style={{ height: "100vh", placeItems: "center" }}
      >
        <div className="p-5">
            <i class="fa-solid fa-ban fs-4"></i>
          <p>You appear to be offline </p>
          <p>Page will auto-reconnect when internet connection is restored</p>
        </div>
      </div>
    </div>
  );
};

export default Offline;
