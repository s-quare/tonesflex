import TextareaAutosize from "react-textarea-autosize";
import { useTonesFlex } from "../context/useTonesFlex";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import Footer from "../components/Footer";

const keywords = [
  "melancholy",
  "nostalgic",
  "heartbroken",
  "lonely",
  "bittersweet",
  "Deep Sadness",
  "Feeling Blue",
  "Breaking Up",
  "Healing Heartbreak",
  "Grieving Loss",
  "angry",
  "aggressive",
  "furious",
  "rage",
  "Fierce Anger",
  "Letting Off Steam",
  "High Energy",
  "happy",
  "joyful",
  "euphoric",
  "blissful",
  "carefree",
  "Pure Joy",
  "Celebration Vibes",
  "Morning Hype",
  "anxious",
  "overthinking",
  "stressed",
  "tense",
  "paranoid",
  "Quiet Reflection",
  "Deep Thoughts",
  "Empowerment Anthem",
  "Feeling Confident",
  "Vulnerable & Raw",
  "workout",
  "gym",
  "running",
  "sports",
  "pre-game",
  "Getting Pumped Up",
  "Gym Motivation",
  "Running Flow",
  "Pre-Game Ritual",
  "studying",
  "focus",
  "concentration",
  "productivity",
  "work",
  "Focus Mode",
  "Study Session",
  "Creative Workflow",
  "Office Background",
  "driving",
  "road trip",
  "highway",
  "night drive",
  "Road Trip Soundtrack",
  "Cruising The City",
  "Late Night Drive",
  "party",
  "club",
  "dance",
  "festival",
  "Ultimate Party Starter",
  "chill",
  "relaxed",
  "laidback",
  "mellow",
  "calm",
  "lazy",
  "sleepy",
  "drowsy",
  "dreamy",
  "hazy",
  "Quiet Reflection",
  "Cozy Blanket Vibes",
  "Sunday Morning",
  "Meditation Focus",
  "Minimalist Ambient",
  "romantic",
  "sensual",
  "lustful",
  "infatuated",
  "yearning",
  "Tingles and Butterflies",
  "First Date Jitters",
  "In The Mood",
  "Slow Dance",
  "Deeply Intimate",
  "pop",
  "k-pop",
  "j-pop",
  "hyperpop",
  "Pop Hits",
  "K-Pop Girl Groups",
  "J-Rock Explosions",
  "hip hop",
  "rap",
  "trap",
  "drill",
  "Essential Hip-Hop",
  "Current Trap Scene",
  "R&B",
  "90s Throwback R&B",
  "electronic",
  "house",
  "techno",
  "dubstep",
  "drum and bass",
  "Chill House Mix",
  "indie",
  "alternative",
  "rock",
  "metal",
  "punk",
  "Indie Pop Gems",
  "Alternative Rock Anthems",
  "Classic Rock Ballads",
  "jazz",
  "blues",
  "soul",
  "funk",
  "Mellow Jazz Cafè",
  "classical",
  "orchestral",
  "cinematic",
  "Epic Cinematic Scores",
  "Classical Masterpieces",
  "reggae",
  "afrobeats",
  "dancehall",
  "amanpiano",
  "Latin Dance Floor",
  "Caribbean Reggae Mix",
  "Global Beats",
  "French Vibe",
  "Spanish Acoustic",
  "Middle Eastern",
  "weeknd",
  "kendrick",
  "taylor swift",
  "drake",
  "beyoncé",
  "frank ocean",
  "lana del rey",
  "metro boomin",
  "pharrell",
  "timbaland",
];
const placeholders = [
  "Describe your current mood or activity...",
  "Try 'Rainy Day Blues' or 'Friday Night Drive'...",
  "What's your sonic weather like today?",
  "Feeling nostalgic? Type a year like '1998'",
  "What are you doing? (e.g., 'studying' or 'cooking')",
  "Focusing on work? Try 'deep concentration'",
  "Where are you? (e.g., 'City Lights' or 'Forest Trail')",
  "Need a boost? Try 'pumped up adrenaline'",
  "Keep it short for better results!",
  "What genre are you craving? (e.g., 'Afrobeats')",
  "Try a mood: 'melancholy' or 'euphoric'",
  "I need music for...",
  "Feeling aggressive? Let me help.",
  "Type an artist or producer's vibe (e.g., 'Metro Boomin')",
  "Suggest a vibe: 'chill laidback' or 'intense'",
  "Got a broken heart? Try 'healing heartbreak'",
  "Looking for something to dance to? Start here.",
  "Try something like '90s throwbacks'",
  "What's the setting? (e.g., 'midnight urban')",
  "Looking for a vibe like 'The Weeknd'",
  "Hit me with a mood and a genre (e.g., 'happy pop')",
  "What kind of energy do you need?",
  "Need to unwind? Try 'lo-fi beats'",
  "Type a movie soundtrack vibe (e.g., 'cinematic')",
  "Try 'Boss Energy' for a power playlist.",
  "What's your preferred tempo? (e.g., 'upbeat')",
  "Start with a feeling: 'romantic' or 'lonely'",
  "What are you trying to escape? (e.g., 'overthinking')",
  "Need background music? Try 'ambient minimal'",
  "Short descriptions work best!",
];

const placeholder = placeholders[Math.floor(Math.random() * placeholders.length)]

export default function Home() {
  const { mood, setMood, showToast } = useTonesFlex();
  const navigate = useNavigate();
  const [sliceNum, setSliceNum] = useState(15);


  const tapScroll = (vibe) => {
    setMood((prev) => {
      if (!prev.trim()) return vibe;
      return prev + (prev.endsWith(" ") ? "" : " ") + vibe;
    });

    document
      .querySelector("textarea")
      .scrollIntoView({ behavior: "smooth", block: "center" });
    document.querySelector("textarea").focus();
  };

  const handleCurate = () => {
    if (mood.trim() == "") {
      setMood("");
      return showToast("Please enter your mood description first.");
    }
    navigate("./tune");
    document.querySelector("textarea").focus();
  };

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const shuffledKeywords = useMemo(() => {
    return shuffleArray(keywords);
  }, []);

  const expCon = () => {
    document
      .querySelector(".Suggestions")
      .scrollIntoView({ behavior: "smooth", block: "center" });
    setSliceNum((prev) => (prev === 15 ? keywords.length : 15));
  };


  return (
    <div className="home px-4 pt-5 pb-2">
      <p
        data-aos="fade-up"
        data-aos-delay={200 * 1}
        className="text-center mt-3 fs-5 max-400 mx-auto mb-2 text-muted fw-bold"
      >
        Dial in a mood. Let's get you tuned up.
      </p>
      <p
        data-aos="fade-up"
        data-aos-delay={200 * 1.5}
        className="text-center f-10 px-4 text-secondary fw-bold max-400 mx-auto"
      >
        Translate your mood into vibes.
      </p>

      <div className="position-relative max-450 mx-auto mt-4">
        <TextareaAutosize
          data-aos="fade-up"
          data-aos-delay={200 * 2}
          minRows={6}
          maxRows={10}
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder={placeholder}
          className="f-12 shadow w-100 d-block px-3 py-4 border-0 text-secondary bg-white text-muted rounded-4"
          style={{ scrollbarWidth: "none" }}
        />
        <button
          className="rounded-pill m-2 hover-exp bg-transparent p-0 position-absolute top-0 end-0"
          style={{ display: mood.trim() === "" && "none" }}
          onClick={() => setMood("")}
        >
          <i className="fa-solid fa-close f-14 text-secondary"></i>
        </button>
      </div>

      <div className="mt-3 mb-5 max-400 mx-auto">
        <button
          data-aos="fade-up"
          data-aos-delay={200 * 3}
          className="bg-dark rounded-pill f-12 ms-3 px-4 me-2"
          disabled={mood.trim() === ""}
          onClick={handleCurate}
        >
          Curate
        </button>
        <span
          data-aos="fade-up"
          data-aos-delay={200 * 4}
          className="f-8 fw-bold text-secondary"
        >
          NEXT: refine the signal
        </span>
      </div>

      <p
        data-aos="fade-up"
        data-aos-delay={200 * 3}
        className=" mb-0 f-8 text-secondary fw-bold"
      >
        Your 3-step frequency calibration
      </p>
      <p
        data-aos="fade-up"
        data-aos-delay={200 * 3}
        className="fw-bold mb-1 f-12"
      >
        How it works
      </p>
      <div className="flex-scroll py-2" data-aos="fade-left">
        {[
          [
            "fa-wave-square",
            "TRANSMIT",
            "Write a short description of how you feel or what you're moving towards. ex. - Feeling nostalgic and ener...",
          ],
          [
            "fa-robot",
            "TUNE IN",
            "Our intelligent system sends in your input for assessment and returns a personalized playlist made just for you.",
          ],
          [
            "fa-headphones",
            "RECEIVE VIBES",
            "Get a personalized playlist that resonates with your mood, With 30-sec previews & Spotify links.",
          ],
        ].map((step) => (
          <div
            key={step[0]}
            style={{ minWidth: "250px", maxWidth: 400 }}
            className="me-3 my-2 shadow bg-dark text-white p-3 rounded-3"
          >
            <i className={`fa-solid ${step[0]} me-2`}></i>{" "}
            <span>{step[1]}</span>
            <p className="f-10 my-3">{step[2]}</p>
          </div>
        ))}
      </div>
      <p className="f-8 mb-1 text-secondary text-end fw-bold">
        <span className="text-dark">Mood</span> | Tuning | Playlist | Archive
      </p>
      <hr className="mt-2" />

      <p className="mt-5 mb-2 text-dark fw-bold">Trending Toneflex</p>

      <div
        className="Suggestions d-flex pt-2 pb-4 px-3 gap-2 flex-wrap position-relative justify-content-center"
        data-aos="fade-up"
      >
        {shuffledKeywords.slice(0, sliceNum).map((vibe, index) => (
          <button
            className="position-relative hover-exp hover-dark bg-secondary f-8 py-1 px-3 capitalize"
            key={index}
            onClick={() => tapScroll(vibe)}
          >
            + {vibe}
          </button>
        ))}
      </div>
      <hr style={{ marginBottom: 10 }} />
      <button
        className="d-block mx-auto text-dark f-12 py-1 px-2 shadow rounded-pill border text-muted"
        style={{ position: "relative", top: -25 }}
        onClick={expCon}
      >
        <i
          style={{
            transform: sliceNum > 15 ? "rotate(180deg)" : "rotate(0deg)",
          }}
          className="fa-solid fa-angle-down"
        ></i>
        {sliceNum > 15 ? "Collapse" : "Expand"}
      </button>

      <Footer />
    </div>
  );
}
