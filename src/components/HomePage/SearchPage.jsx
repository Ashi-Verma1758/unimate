import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import SearchFilters from '../search/SearchFilter';
import SearchCard from "../search/SearchCard";
import "./SearchPage.css";

export default function SearchPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const q = params.get("q") || "";
  const navigate = useNavigate();

  const [search, setSearch] = useState(q);
  const [results, setResults] = useState({
    users: [],
    projects: [],
    events: [],
  });

  useEffect(() => {
    setSearch(q);
    if (!q.trim()) {
      setResults({ users: [], projects: [], events: [] });
      return;
    }

    const fetchSearch = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/search?q=${encodeURIComponent(q)}`
        );
        setResults(res.data || { users: [], projects: [], events: [] });
      } catch (err) {
        console.log(err);
        setResults({ users: [], projects: [], events: [] });
      }
    };

    fetchSearch();
  }, [q]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = search.trim();
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="search-page">
      <div className="search-top">
        <h2>Find Projects, Teammates & Events</h2>

        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            className="search-input"
            placeholder="Search for projects, skills, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>

      <div className="search-body">
        <SearchFilters />

        <div className="search-results">
          <div className="result-count">
            {results.users.length + results.projects.length + results.events.length} results found
          </div>

          {results.projects.map((item) => (
            <SearchCard key={item._id} type="project" data={item} />
          ))}

          {results.users.map((item) => (
            <SearchCard key={item._id} type="user" data={item} />
          ))}

          {results.events.map((item) => (
            <SearchCard key={item._id} type="event" data={item} />
          ))}
        </div>
      </div>
    </div>
  );
}