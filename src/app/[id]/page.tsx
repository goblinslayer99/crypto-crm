"use client";

import { ContactForm } from "@/components/ContactForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  MessageCircle,
  Twitter,
  Github,
  Linkedin,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";

interface Contact {
  id: string;
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
  createdAt: string;
  updatedAt: string;
  skills: {
    skill: {
      id: string;
      name: string;
    };
  }[];
}

export default function ContactDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [contact, setContact] = useState<Contact | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/contacts/${params.id}`)
      .then((res) => res.json())
      .then(setContact);
  }, [params.id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    await fetch(`/api/contacts/${params.id}`, {
      method: "DELETE",
    });
    router.push("/");
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString();
  };

  if (!contact) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(false)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Edit Contact</h1>
                <p className="text-muted-foreground">
                  Update contact information
                </p>
              </div>
            </div>

            <ContactForm
              contactId={contact.id}
              initialData={{
                name: contact.name,
                telegram: contact.telegram || "",
                twitter: contact.twitter || "",
                discord: contact.discord || "",
                github: contact.github || "",
                linkedin: contact.linkedin || "",
                email: contact.email || "",
                company: contact.company || "",
                role: contact.role || "",
                currentProject: contact.currentProject || "",
                howWeMet: contact.howWeMet || "",
                dateMet: contact.dateMet.split("T")[0],
                lastContacted: contact.lastContacted?.split("T")[0] || "",
                followUpDate: contact.followUpDate?.split("T")[0] || "",
                notes: contact.notes || "",
                skills: contact.skills.map((s) => s.skill.name),
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col gap-6 max-w-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">{contact.name}</h1>
                {contact.role && contact.company && (
                  <p className="text-muted-foreground">
                    {contact.role} at {contact.company}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Contact</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete {contact.name}? This action
                      cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDeleteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 text-sm hover:underline"
                  >
                    <Mail className="h-4 w-4" />
                    {contact.email}
                  </a>
                )}
                {contact.telegram && (
                  <a
                    href={`https://t.me/${contact.telegram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:underline"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {contact.telegram}
                  </a>
                )}
                {contact.twitter && (
                  <a
                    href={`https://twitter.com/${contact.twitter.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:underline"
                  >
                    <Twitter className="h-4 w-4" />
                    {contact.twitter}
                  </a>
                )}
                {contact.github && (
                  <a
                    href={`https://github.com/${contact.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:underline"
                  >
                    <Github className="h-4 w-4" />
                    {contact.github}
                  </a>
                )}
                {contact.linkedin && (
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:underline"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                )}
                {contact.discord && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Discord:</span>
                    {contact.discord}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span className="text-muted-foreground">Met:</span>
                  {formatDate(contact.dateMet)}
                </div>
                {contact.howWeMet && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">How we met:</span>{" "}
                    {contact.howWeMet}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Last contacted:</span>
                  {formatDate(contact.lastContacted)}
                </div>
                {contact.followUpDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Follow-up:</span>
                    <span
                      className={
                        new Date(contact.followUpDate) < new Date()
                          ? "text-red-500 font-medium"
                          : ""
                      }
                    >
                      {formatDate(contact.followUpDate)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {contact.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {contact.skills.map(({ skill }) => (
                    <Badge key={skill.id} variant="secondary">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {contact.currentProject && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Project</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{contact.currentProject}</p>
              </CardContent>
            </Card>
          )}

          {contact.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{contact.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
