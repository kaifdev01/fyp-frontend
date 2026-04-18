'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, X, Plus, Check } from 'lucide-react';
import api from '../lib/api';

export default function SkillsAutocomplete({ 
  selectedSkills = [], 
  onSkillsChange, 
  placeholder = "Search skills...",
  maxSkills = 20 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [popularSkills, setPopularSkills] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchPopularSkills();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchSkills(searchQuery);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const fetchPopularSkills = async () => {
    try {
      const response = await api.get('/api/skills/popular');
      setPopularSkills(response.data.skills);
    } catch (error) {
      console.error('Failed to fetch popular skills:', error);
    }
  };

  const searchSkills = async (query) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/skills/search?q=${encodeURIComponent(query)}`);
      setSuggestions(response.data.skills.filter(skill => !selectedSkills.includes(skill)));
    } catch (error) {
      console.error('Failed to search skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSkill = (skill) => {
    if (!selectedSkills.includes(skill) && selectedSkills.length < maxSkills) {
      onSkillsChange([...selectedSkills, skill]);
      setSearchQuery('');
      setSuggestions([]);
      inputRef.current?.focus();
    }
  };

  const removeSkill = (skill) => {
    onSkillsChange(selectedSkills.filter(s => s !== skill));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      e.preventDefault();
      if (suggestions.length > 0) {
        addSkill(suggestions[0]);
      } else if (!selectedSkills.includes(searchQuery.trim())) {
        addSkill(searchQuery.trim());
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={18} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={selectedSkills.length >= maxSkills}
          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
          {/* Search Results */}
          {searchQuery.length >= 2 && (
            <div className="p-2">
              {loading ? (
                <div className="py-8 text-center text-gray-400 text-sm">
                  Searching...
                </div>
              ) : suggestions.length > 0 ? (
                <>
                  <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Search Results
                  </p>
                  {suggestions.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => addSkill(skill)}
                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors text-left group"
                    >
                      <span className="text-sm text-gray-700 group-hover:text-blue-600">
                        {skill}
                      </span>
                      <Plus size={14} className="text-gray-400 group-hover:text-blue-600" />
                    </button>
                  ))}
                </>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-gray-400 text-sm mb-2">No skills found</p>
                  <button
                    onClick={() => addSkill(searchQuery.trim())}
                    className="text-blue-600 text-sm font-medium hover:underline"
                  >
                    Add "{searchQuery}" as custom skill
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Popular Skills */}
          {searchQuery.length < 2 && popularSkills.length > 0 && (
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Popular Skills
              </p>
              <div className="grid grid-cols-2 gap-1">
                {popularSkills
                  .filter(skill => !selectedSkills.includes(skill))
                  .slice(0, 20)
                  .map((skill) => (
                    <button
                      key={skill}
                      onClick={() => addSkill(skill)}
                      className="flex items-center justify-between px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors text-left group"
                    >
                      <span className="text-sm text-gray-700 group-hover:text-blue-600">
                        {skill}
                      </span>
                      <Plus size={14} className="text-gray-400 group-hover:text-blue-600" />
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected Skills */}
      {selectedSkills.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">
              Selected Skills ({selectedSkills.length}/{maxSkills})
            </p>
            {selectedSkills.length > 0 && (
              <button
                onClick={() => onSkillsChange([])}
                className="text-xs text-red-500 hover:text-red-700 font-medium"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium shadow-md group"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Max Skills Warning */}
      {selectedSkills.length >= maxSkills && (
        <p className="mt-2 text-xs text-amber-600">
          Maximum {maxSkills} skills reached. Remove some to add more.
        </p>
      )}
    </div>
  );
}
