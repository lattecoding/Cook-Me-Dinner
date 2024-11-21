import { useState, useLayoutEffect } from "react";
import ErrorPage from "./ErrorPage";
import auth from "../utils/auth";
import axios from "axios";
import VideoList from "../components/VideoList";
import VideoPlayer from "../components/VideoPlayer";

interface Recipe {
  id: number;
  title: string;
  image: string;
}

interface Video {
  id: string; // YouTube video ID
  title: string; // Video title
  thumbnail: string; // URL of the thumbnail image
}

interface YouTubeAPIItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
  };
}

const Board = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState(false);
  const [loginCheck, setLoginCheck] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [searchType, setSearchType] = useState<"youtube" | "recipes">(
    "recipes",
  );

  const checkLogin = () => {
    if (auth.loggedIn()) {
      setLoginCheck(true);
    }
  };

  useLayoutEffect(() => {
    checkLogin();
  }, []);

  const fetchRecipes = async (query: string) => {
    try {
      const apiKey = import.meta.env.VITE_SPOON_API;
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}`,
      );
      const data = await response.json();
      setRecipes(data.results || []);
    } catch (err) {
      console.error("Failed to fetch recipes:", err);
      setError(true);
    }
  };

  const handleSearchVideos = async (query: string) => {
    const API_KEY = "AIzaSyCspIUuocKpc10150WmsBMm9bLihaxVNYI"; // Replace with your actual API key
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          params: {
            part: "snippet",
            q: query,
            type: "video",
            key: API_KEY,
            maxResults: 10,
          },
        },
      );

      const videoData: Video[] = response.data.items.map(
        (item: YouTubeAPIItem) => ({
          id: item.id.videoId || "",
          title: item.snippet.title || "",
          thumbnail: item.snippet.thumbnails.high.url || "",
        }),
      );

      setVideos(videoData);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const handleSelectVideo = (videoId: string) => {
    setSelectedVideoId(videoId);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (searchType === "recipes") {
        setVideos([]); // Clear videos when switching to recipe search
        setSelectedVideoId(null); // Clear selected video
        fetchRecipes(searchQuery);
      } else if (searchType === "youtube") {
        setRecipes([]); // Clear recipes when switching to video search
        handleSearchVideos(searchQuery);
      }
    }
  };

  const handleSearchTypeChange = (newSearchType: "youtube" | "recipes") => {
    setSearchType(newSearchType);
    setSearchQuery(""); // Clear the search query when switching search types
    if (newSearchType === "recipes") {
      setVideos([]); // Clear YouTube videos when switching to recipes
      setSelectedVideoId(null); // Clear selected video
    } else {
      setRecipes([]); // Clear recipes when switching to YouTube
    }
  };

  if (error) {
    return <ErrorPage />;
  }

  return (
    <>
      {!loginCheck ? (
        <div className="login-notice">
          <div className="page-title border rounded-3">
            <h1>Let's Get Cooking</h1>
          </div>
          <img
            src="/landingpage.jpeg"
            className="img-fluid border rounded-3 shadow-lg mb-4"
            alt="image-landing"
            width="700"
            height="500"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="container-xl">
          <div className="search-container">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder={`Search for a ${searchType === "youtube" ? "video" : "recipe"}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="search-buttons">
                <button
                  type="button"
                  onClick={() => handleSearchTypeChange("recipes")}
                  className={searchType === "recipes" ? "active" : ""}
                >
                  Search Recipes
                </button>
                <button
                  type="button"
                  onClick={() => handleSearchTypeChange("youtube")}
                  className={searchType === "youtube" ? "active" : ""}
                >
                  Search Videos
                </button>
                <button type="submit">Search</button>
              </div>
            </form>
          </div>

          {/* Show Recipes */}
          {searchType === "recipes" && recipes.length > 0 && (
            <div className="recipe-results">
              {recipes.slice(0, 6).map((recipe) => (
                <div key={recipe.id} className="recipe-card">
                  <img src={recipe.image} alt={recipe.title} />
                  <h3>{recipe.title}</h3>
                  <a
                    href={`https://spoonacular.com/recipes/${recipe.title.replace(/ /g, "-")}-${recipe.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Recipe
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Show YouTube Videos */}
          {searchType === "youtube" && selectedVideoId ? (
            <VideoPlayer videoId={selectedVideoId} />
          ) : (
            <VideoList videos={videos} onSelect={handleSelectVideo} />
          )}
        </div>
      )}
    </>
  );
};

export default Board;
