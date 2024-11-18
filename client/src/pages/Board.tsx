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
          {/* <h1>Let's Cook Something!</h1> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64" // Increased size
            height="64" // Increased size
            fill="currentColor"
            className="bi bi-c-square-fill"
            viewBox="0 0 16 16"
          >
            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.146 4.992c-1.212 0-1.927.92-1.927 2.502v1.06c0 1.571.703 2.462 1.927 2.462.979 0 1.641-.586 1.729-1.418h1.295v.093c-.1 1.448-1.354 2.467-3.03 2.467-2.091 0-3.269-1.336-3.269-3.603V7.482c0-2.261 1.201-3.638 3.27-3.638 1.681 0 2.935 1.054 3.029 2.572v.088H9.875c-.088-.879-.768-1.512-1.729-1.512"/>
          </svg>
          <img src="/public/landingpage.jpeg" alt="Landing Page" className="image-landing" />
        </div>
      ) : (
        <div className="container-xl">
          <div className="search-container">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search for a recipe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}/>
              <button type="submit">Search</button>
            </form>
          </div>
          {
            recipes.length===0 ? (
              <i className="bi bi-easel2-fill"></i>
            ): (
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
            )
          }
          
        </div>
      )}
    </>
  );
};

export default Board;
