"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface Skill {
  id: string;
  name: string;
}

interface SkillTagsProps {
  selectedSkills: string[];
  onChange: (skills: string[]) => void;
  disabled?: boolean;
}

export function SkillTags({
  selectedSkills,
  onChange,
  disabled,
}: SkillTagsProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/skills")
      .then((res) => res.json())
      .then(setSkills);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSkills = skills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(search.toLowerCase()) &&
      !selectedSkills.includes(skill.name)
  );

  const addSkill = (skillName: string) => {
    if (!selectedSkills.includes(skillName)) {
      onChange([...selectedSkills, skillName]);
    }
    setSearch("");
  };

  const removeSkill = (skillName: string) => {
    onChange(selectedSkills.filter((s) => s !== skillName));
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[42px] bg-background">
        {selectedSkills.map((skill) => (
          <Badge key={skill} variant="secondary" className="gap-1">
            {skill}
            {!disabled && (
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}
        {!disabled && (
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={selectedSkills.length === 0 ? "Add skills..." : ""}
            className="flex-1 min-w-[100px] bg-transparent outline-none text-sm"
          />
        )}
      </div>

      {isOpen && filteredSkills.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredSkills.map((skill) => (
            <Button
              key={skill.id}
              type="button"
              variant="ghost"
              className="w-full justify-start font-normal"
              onClick={() => addSkill(skill.name)}
            >
              {skill.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
