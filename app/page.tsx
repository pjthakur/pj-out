"use client";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const memes = [
  { text: "Why don't scientists trust atoms? Because they make up everything!" },
  { text: "I'm reading a book on anti-gravity. It's impossible to put down!" },
  { text: "Why did the scarecrow win an award? Because he was outstanding in his field!" },
  { text: "I told my wife she was drawing her eyebrows too high. She looked surprised." },
  { text: "Why don’t skeletons fight each other? They don’t have the guts." },
  { text: "I would avoid the sushi if I was you. It’s a little fishy." },
  { text: "Want to hear a joke about construction? I'm still working on it." },
  { text: "I used to play piano by ear, but now I use my hands." },
  { text: "Why don’t some couples go to the gym? Because some relationships don’t work out." },
  { text: "I would tell you a joke about time travel, but you didn't like it." },
  { text: "Parallel lines have so much in common… it’s a shame they’ll never meet." },
  { text: "I have a joke about chemistry, but I don’t think it will get a reaction." },
  { text: "What do you call fake spaghetti? An impasta!" },
  { text: "Did you hear about the guy who invented Lifesavers? He made a mint!" },
  { text: "I’d tell you a joke about paper, but it’s tearable." },
  { text: "I used to be addicted to soap, but I’m clean now." },
  { text: "I told my computer I needed a break, and now it won’t stop sending me beach pics." },
  { text: "What do you get when you cross a snowman and a vampire? Frostbite." },
  { text: "Why did the math book look sad? Because it had too many problems." },
  { text: "What do you call a bear with no teeth? A gummy bear!" },
  { text: "How does a penguin build its house? Igloos it together." },
  { text: "What do you call cheese that isn't yours? Nacho cheese." },
  { text: "I'm on a seafood diet. I see food and I eat it." },
  { text: "Why did the coffee file a police report? It got mugged." },
  { text: "I told a joke about a roof once… it went over everyone’s head." },
  { text: "Why did the tomato turn red? Because it saw the salad dressing!" },
  { text: "What do you call a can opener that doesn’t work? A can’t opener." },
  { text: "What did one ocean say to the other? Nothing, they just waved." },
  { text: "Why can’t you give Elsa a balloon? Because she’ll let it go." },
  { text: "How do you organize a space party? You planet." },
  { text: "Why don’t eggs tell each other secrets? They might crack up." },
  { text: "How do you make holy water? You boil the hell out of it." },
  { text: "What did the janitor say when he jumped out of the closet? Supplies!" },
  { text: "I’m friends with all electricians. We have good current connections." },
  { text: "Why did the bicycle fall over? It was two-tired." },
  { text: "I asked the librarian if the library had books on paranoia. She whispered, 'They're right behind you...'" },
  { text: "I started a band called 999 Megabytes — we haven’t gotten a gig yet." },
  { text: "Why did the cookie go to the hospital? Because it felt crummy." },
  { text: "I bought shoes from a drug dealer. I don’t know what he laced them with, but I was tripping all day!" },
  { text: "What do you get if you cross a cat with a dark horse? Kitty Perry." },
  { text: "Why don’t oysters share their pearls? Because they’re shellfish." },
  { text: "What happens when frogs park illegally? They get toad." },
  { text: "I once got into a fight with a broken elevator… I took it to another level." },
  { text: "I used to be a baker, but I couldn't make enough dough." },
  { text: "What do you call a pile of cats? A meowtain." },
  { text: "I don’t trust stairs. They’re always up to something." },
  { text: "I accidentally swallowed some food coloring. The doctor says I’m OK but I feel like I’ve dyed a little inside." },
  { text: "Why can’t your nose be 12 inches long? Because then it would be a foot." },
];

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [randomMeme, setRandomMeme] = useState(memes[0]);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    refreshMeme();
  }, []);

  const refreshMeme = () => {
    setIsFlipping(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * memes.length);
      setRandomMeme(memes[randomIndex]);
      setIsFlipping(false);
    }, 300);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      } flex justify-center items-center relative overflow-hidden font-poppins transition-colors duration-500`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient-flow opacity-50"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-20 animate-float"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 5}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center p-6">
        {/* Dark Mode Toggle Button */}
        <div className="fixed top-4 right-4">
          <button
            className={`relative p-3 rounded-full font-semibold text-sm tracking-wide overflow-hidden transition-all duration-300 transform hover:scale-105 focus:outline-none ${
              darkMode
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={toggleDarkMode}
          >
            <span className="relative z-10 flex items-center justify-center w-6 h-6">
              {darkMode ? (
                <Sun className="w-5 h-5 animate-spin-slow" />
              ) : (
                <Moon className="w-5 h-5 animate-pulse" />
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Meme Card */}
        <div
          className={`relative w-96 sm:w-[28rem] min-h-[12rem] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all duration-500 ${
            isFlipping ? "animate-flip" : ""
          } flex items-center justify-center p-6`}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          <p
            className={`text-lg sm:text-xl font-medium text-center tracking-tight ${
              darkMode ? "text-gray-100" : "text-gray-200"
            } leading-relaxed`}
          >
            {randomMeme.text}
          </p>
        </div>

        {/* Refresh Meme Button */}
        <button
          className="mt-6 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-semibold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none"
          onClick={refreshMeme}
        >
          😂 New Meme
        </button>
      </div>

      {/* Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }

        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient-flow {
          background-size: 200% 200%;
          animation: gradient-flow 8s ease infinite;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }

        .animate-float {
          animation: float linear infinite;
        }

        @keyframes flip {
          0% { transform: perspective(600px) rotateY(0deg); }
          50% { transform: perspective(600px) rotateY(180deg); }
          100% { transform: perspective(600px) rotateY(360deg); }
        }

        .animate-flip {
          animation: flip 0.6s ease-in-out;
        }

        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default App;