import { useState, useLayoutEffect } from "react";
import ErrorPage from "./ErrorPage";
import auth from "../utils/auth";

const Board = () => {
  const [recipes, setRecipes] = useState<any[]>([]); // Array to hold search results
  const [error, setError] = useState(false);
  const [loginCheck, setLoginCheck] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const checkLogin = () => {
    if (auth.loggedIn()) {
      setLoginCheck(true);
    }
  };

  const fetchRecipes = async (query: string) => {
    try {
      const apiKey = import.meta.env.VITE_SPOON_API;
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}`,
      );
      const data = await response.json();
      setRecipes(data.results || []); // Handle case where `results` might be undefined
    } catch (err) {
      console.error("Failed to fetch recipes:", err);
      setError(true);
    }
  };

  useLayoutEffect(() => {
    checkLogin();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchRecipes(searchQuery);
    }
  };

  if (error) {
    return <ErrorPage />;
  }

  return (
    <>
      {!loginCheck ? (
        <div className="login-notice">
          <h1>Let's Cook Something!</h1>
        </div>
      ) : (
        <div className="recipe-finder">
          <form onSubmit={handleSearch} className="search-bar">
            <input
              type="text"
              placeholder="Search for a recipe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
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
        </div>
      )}
    </>
  );
};

export default Board;
