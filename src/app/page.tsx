"use client";

import { ContactTable } from "@/components/ContactTable";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

interface Contact {
  id: string;
  name: string;
  email?: string;
  company?: string;
  role?: string;
  telegram?: string;
  twitter?: string;
  github?: string;
  dateMet: string;
  lastContacted?: string;
  followUpDate?: string;
  skills: {
    skill: {
      id: string;
      name: string;
    };
  }[];
}

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContacts = useCallback(
    async (search: string = "", skills: string[] = []) => {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (skills.length > 0) params.set("skills", skills.join(","));

      const res = await fetch(`/api/contacts?${params.toString()}`);
      const data = await res.json();
      setContacts(data);
      setIsLoading(false);
    },
    []
  );

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Crypto Contacts</h1>
              <p className="text-muted-foreground">
                Track talented people in the crypto/web3 space
              </p>
            </div>
            <Link href="/add">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </Link>
          </div>

          <SearchBar onSearch={fetchContacts} />

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading contacts...
            </div>
          ) : (
            <ContactTable contacts={contacts} />
          )}
        </div>
      </div>
    </div>
  );
}
