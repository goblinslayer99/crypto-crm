"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Mail, Twitter, Github } from "lucide-react";
import Link from "next/link";

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

interface ContactTableProps {
  contacts: Contact[];
}

export function ContactTable({ contacts }: ContactTableProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString();
  };

  const isOverdue = (followUpDate?: string) => {
    if (!followUpDate) return false;
    return new Date(followUpDate) < new Date();
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead>Last Contact</TableHead>
            <TableHead>Follow-up</TableHead>
            <TableHead className="text-right">Links</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <p className="text-muted-foreground">No contacts found</p>
                <Link href="/add">
                  <Button variant="link">Add your first contact</Button>
                </Link>
              </TableCell>
            </TableRow>
          ) : (
            contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>
                  <Link
                    href={`/${contact.id}`}
                    className="font-medium hover:underline"
                  >
                    {contact.name}
                  </Link>
                  {contact.role && (
                    <p className="text-sm text-muted-foreground">
                      {contact.role}
                    </p>
                  )}
                </TableCell>
                <TableCell>{contact.company || "-"}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {contact.skills.slice(0, 3).map(({ skill }) => (
                      <Badge key={skill.id} variant="secondary" className="text-xs">
                        {skill.name}
                      </Badge>
                    ))}
                    {contact.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{contact.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{formatDate(contact.lastContacted)}</TableCell>
                <TableCell>
                  {contact.followUpDate ? (
                    <span
                      className={
                        isOverdue(contact.followUpDate)
                          ? "text-red-500 font-medium"
                          : ""
                      }
                    >
                      {formatDate(contact.followUpDate)}
                    </span>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    {contact.email && (
                      <a href={`mailto:${contact.email}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                    {contact.twitter && (
                      <a
                        href={`https://twitter.com/${contact.twitter.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Twitter className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                    {contact.github && (
                      <a
                        href={`https://github.com/${contact.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Github className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                    <Link href={`/${contact.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
