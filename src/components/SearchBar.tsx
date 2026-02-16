"use client";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, X, Filter } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface Skill {
  id: string;
  name: string;
}

interface SearchBarProps {
  onSearch: (query: string, skills: string[]) => void;
  initialQuery?: string;
  initialSkills?: string[];
}

export function SearchBar({
  onSearch,
  initialQuery = "",
  initialSkills = [],
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialSkills);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/skills")
      .then((res) => res.json())
      .then(setSkills);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      onSearch(query, selectedSkills);
    }, 300);
    return () => clearTimeout(debounce);
  }, [query, selectedSkills, onSearch]);

  const toggleSkill = (skillName: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skillName)
        ? prev.filter((s) => s !== skillName)
        : [...prev, skillName]
    );
  };

  const clearFilters = () => {
    setSelectedSkills([]);
    setQuery("");
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search contacts..."
            className="pl-9"
          />
        </div>
        <div className="relative" ref={filterRef}>
          <Button
            variant={selectedSkills.length > 0 ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
            {selectedSkills.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {selectedSkills.length}
              </Badge>
            )}
          </Button>

          {showFilters && (
            <div className="absolute right-0 z-10 mt-2 w-64 bg-popover border rounded-md shadow-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-sm">Filter by Skills</span>
                {selectedSkills.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-6 text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-auto">
                {skills.map((skill) => (
                  <Badge
                    key={skill.id}
                    variant={
                      selectedSkills.includes(skill.name)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => toggleSkill(skill.name)}
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Filtering by:</span>
          {selectedSkills.map((skill) => (
            <Badge key={skill} variant="secondary" className="gap-1">
              {skill}
              <button
                onClick={() => toggleSkill(skill)}
                className="hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
