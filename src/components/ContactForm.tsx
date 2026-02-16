"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SkillTags } from "@/components/SkillTags";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ContactFormData {
  name: string;
  telegram?: string;
  twitter?: string;
  discord?: string;
  github?: string;
  linkedin?: string;
  email?: string;
  company?: string;
  role?: string;
  currentProject?: string;
  howWeMet?: string;
  dateMet: string;
  lastContacted?: string;
  followUpDate?: string;
  notes?: string;
  skills: string[];
}

interface ContactFormProps {
  initialData?: ContactFormData;
  contactId?: string;
}

export function ContactForm({ initialData, contactId }: ContactFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>(
    initialData || {
      name: "",
      telegram: "",
      twitter: "",
      discord: "",
      github: "",
      linkedin: "",
      email: "",
      company: "",
      role: "",
      currentProject: "",
      howWeMet: "",
      dateMet: new Date().toISOString().split("T")[0],
      lastContacted: "",
      followUpDate: "",
      notes: "",
      skills: [],
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const url = contactId ? `/api/contacts/${contactId}` : "/api/contacts";
    const method = contactId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      router.push("/");
      router.refresh();
    } else {
      setIsSubmitting(false);
      alert("Failed to save contact");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Info</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company">Company / Protocol</Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentProject">Current Project</Label>
          <Input
            id="currentProject"
            name="currentProject"
            value={formData.currentProject}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Social Handles</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="telegram">Telegram</Label>
            <Input
              id="telegram"
              name="telegram"
              value={formData.telegram}
              onChange={handleChange}
              placeholder="@username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter / X</Label>
            <Input
              id="twitter"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              placeholder="@username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discord">Discord</Label>
            <Input
              id="discord"
              name="discord"
              value={formData.discord}
              onChange={handleChange}
              placeholder="username#1234"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="username"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Skills & Tags</h3>
        <SkillTags
          selectedSkills={formData.skills}
          onChange={(skills) => setFormData((prev) => ({ ...prev, skills }))}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Meeting Context</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="dateMet">Date Met *</Label>
            <Input
              id="dateMet"
              name="dateMet"
              type="date"
              value={formData.dateMet}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="howWeMet">How We Met</Label>
            <Input
              id="howWeMet"
              name="howWeMet"
              value={formData.howWeMet}
              onChange={handleChange}
              placeholder="Conference, Twitter DM, etc."
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="lastContacted">Last Contacted</Label>
            <Input
              id="lastContacted"
              name="lastContacted"
              type="date"
              value={formData.lastContacted}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="followUpDate">Follow-up Date</Label>
            <Input
              id="followUpDate"
              name="followUpDate"
              type="date"
              value={formData.followUpDate}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Notes</h3>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          placeholder="Any additional notes..."
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : contactId
              ? "Update Contact"
              : "Add Contact"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
