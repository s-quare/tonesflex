import { useNavigate } from "react-router-dom";
import UseAnimations from "react-useanimations";
import alertOctagon from "react-useanimations/lib/alertOctagon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      className="d-grid px-4"
      style={{ minHeight: "calc(100svh - 50px)", placeItems: "center" }}
    >
      <div
        data-aos="fade-up"
        className="rounded-4 max-500 mx-auto text-center"
        style={{ width: "80%" }}
      >
        <p className="my-4 monospace text-muted fw-bold f-10">
          404 / SIGNAL LOST
          <span
            className="d-inline-block"
            style={{ transform: "rotate(25deg)" }}
          >
            ?
          </span>
        </p>
        <div>
          <UseAnimations
            className="cursor"
            animation={alertOctagon} // The imported icon data
            size={100}
            loop={true}
            speed={2.7}
            strokeColor="red"
            wrapperStyle={{ margin: "0 auto" }}
          />
        </div>
        <p className="my-4 f-12 position-relative text-muted w-75 mx-auto fw-bold">
          The channel you tunned doesn't exist, or it drifted out of range.
          Check the URL, Jump back to previous page or start a fresh transmition
        </p>
        <div
          className="d-grid px-3 gap-3 mb-4 pt-4 pb-2"
          style={{ gridTemplateColumns: "1fr 1fr" }}
        >
          <button
            onClick={() => navigate(-1)}
            className="bg-success hover-dark"
          >
            Previous page
          </button>
          <button
            onClick={() => navigate("/", { replace: true })}
            className="bg-transparent shadow text-dark hover-dark"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
