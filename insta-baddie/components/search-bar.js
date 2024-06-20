"use client";

import { useState, useEffect } from 'react';;
import { createClient } from '@/utils/supabase/client';
import './search-bar.css'; // Create a CSS file for styling if necessary

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
  
    useEffect(() => {
      const fetchProfiles = async () => {
        if (!query.trim()) {
          setResults([]);
          return;
        }
  
        setIsSearching(true);
        const supabase = createClient();
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('username, full_name')
          .ilike('username', `%${query}%`);
  
        if (error) {
          console.error('Error fetching profiles:', error.message);
          setResults([]);
        } else {
          setResults(profiles);
        }
        setIsSearching(false);
      };
  
      const debounceFetch = setTimeout(fetchProfiles, 300);
  
      return () => clearTimeout(debounceFetch);
    }, [query]);
  
    const handleQueryChange = (e) => {
      setQuery(e.target.value);
    };
  
    const handleProfileClick = (username) => {
      if (typeof window !== 'undefined') {
        window.location.href = `/${username}`;
      }
    };
  
    return (
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search profiles..."
          value={query}
          onChange={handleQueryChange}
          className="search-input"
        />
        {isSearching && <div>Loading...</div>}
        {results.length > 0 && (
          <ul className="search-results">
            {results.map((profile) => (
              <li key={profile.username} onClick={() => handleProfileClick(profile.username)}>
                {profile.full_name} (@{profile.username})
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }