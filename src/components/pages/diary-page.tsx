import { ArrowLeft, Heart, ImagePlus, MapPin, Send, Target, X } from "lucide-react";
import { type ChangeEvent, type FormEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type DiaryPost = {
  id: number;
  author: string;
  initials: string;
  message: string;
  photo?: string;
  location?: string;
  goalName?: string;
  createdAt: string;
};

const sharedGoals = ["Our Dream Wedding", "First Home Fund", "Anniversary Getaway"];

const initialPosts: DiaryPost[] = [
  {
    id: 1,
    author: "Freiz",
    initials: "F",
    message: "I loved our quiet coffee date this morning. Here's to more slow Sundays together. ❤️",
    location: "Makati City",
    goalName: "Our Dream Wedding",
    createdAt: "Today at 9:42 AM",
  },
  {
    id: 2,
    author: "You",
    initials: "Y",
    message: "A little reminder: I'm proud of everything we're building, one day at a time.",
    createdAt: "Yesterday at 8:15 PM",
  },
];

export function DiaryPage() {
  const partnerName = "Freiz";
  const [posts, setPosts] = useState(initialPosts);
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState("");
  const [location, setLocation] = useState("");
  const [goalName, setGoalName] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setError("Choose an image smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(String(reader.result));
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const publishPost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim() && !photo) {
      setError("Write a message or add a photo before sharing.");
      return;
    }

    setPosts((currentPosts) => [{
      id: Date.now(),
      author: "You",
      initials: "Y",
      message: message.trim(),
      photo: photo || undefined,
      location: location.trim() || undefined,
      goalName: goalName || undefined,
      createdAt: "Just now",
    }, ...currentPosts]);
    setMessage("");
    setPhoto("");
    setLocation("");
    setGoalName("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-rose-50 via-white to-pink-50 px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link to="/dashboard" className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700">
          <ArrowLeft className="size-4" aria-hidden="true" /> Back to dashboard
        </Link>

        <header className="mb-8 flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-200">
            <Heart className="size-6 fill-current" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-rose-950 sm:text-4xl">Our diary</h1>
            <p className="mt-1 text-rose-950/55">A private little space for you and {partnerName}.</p>
          </div>
        </header>

        <Card className="mb-8 gap-0 border-rose-100 bg-white py-0 shadow-lg shadow-rose-950/5 ring-rose-100">
          <CardContent className="p-5">
            <form onSubmit={publishPost}>
              <div className="flex gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-500 font-semibold text-white">Y</span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="Share a thought, a memory, or a little love note..."
                  className="w-full resize-none rounded-xl border border-rose-100 bg-rose-50/30 p-3 text-rose-950 outline-none placeholder:text-rose-950/30 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                  aria-label="Diary message"
                />
              </div>

              {photo && (
                <div className="relative mt-4 overflow-hidden rounded-2xl border border-rose-100 sm:ml-13">
                  <img src={photo} alt="Selected diary upload preview" className="max-h-80 w-full object-cover" />
                  <Button type="button" size="icon" variant="secondary" onClick={() => setPhoto("")} className="absolute right-3 top-3 rounded-full" aria-label="Remove selected photo">
                    <X aria-hidden="true" />
                  </Button>
                </div>
              )}
              {error && <p className="mt-3 text-sm text-red-600 sm:ml-13" role="alert">{error}</p>}

              <div className="mt-4 grid gap-3 sm:ml-13 sm:grid-cols-2">
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-rose-400" aria-hidden="true" />
                  <input
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    maxLength={80}
                    placeholder="Add a location"
                    aria-label="Post location"
                    className="h-10 w-full rounded-xl border border-rose-100 bg-rose-50/30 pl-9 pr-3 text-sm text-rose-950 outline-none placeholder:text-rose-950/35 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                  />
                </div>
                <div className="relative">
                  <Target className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-rose-400" aria-hidden="true" />
                  <select
                    value={goalName}
                    onChange={(event) => setGoalName(event.target.value)}
                    aria-label="Attribute post to a goal"
                    className="h-10 w-full appearance-none rounded-xl border border-rose-100 bg-rose-50/30 pl-9 pr-8 text-sm text-rose-950 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                  >
                    <option value="">Link to a goal (optional)</option>
                    {sharedGoals.map((goal) => <option key={goal} value={goal}>{goal}</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-rose-100 pt-4 sm:ml-13">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="sr-only" aria-label="Choose a diary photo" />
                <Button type="button" variant="ghost" className="text-rose-600 hover:bg-rose-50" onClick={() => fileInputRef.current?.click()}>
                  <ImagePlus aria-hidden="true" /> Add photo
                </Button>
                <Button type="submit" className="bg-rose-500 text-white hover:bg-rose-600">
                  <Send aria-hidden="true" /> Share with {partnerName}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <section
          className="diary-scrollbar max-h-[70vh] space-y-6 overflow-y-auto overscroll-contain pr-3 pb-2 sm:max-h-[44rem]"
          aria-label="Diary entries"
          tabIndex={0}
        >
          {posts.map((post) => (
            <article key={post.id} className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-linear-to-br from-rose-400 to-pink-600 font-semibold text-white">{post.initials}</span>
                <div>
                  <p className="font-semibold text-rose-950">{post.author}</p>
                  <time className="text-xs text-rose-950/40">{post.createdAt}</time>
                </div>
              </div>
              {post.message && <p className="mt-4 whitespace-pre-wrap leading-7 text-rose-950/75">{post.message}</p>}
              {post.photo && <img src={post.photo} alt={`Memory shared by ${post.author}`} className="mt-4 max-h-[32rem] w-full rounded-2xl object-cover" />}
              {(post.location || post.goalName) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.location && <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700"><MapPin className="size-3.5" aria-hidden="true" />{post.location}</span>}
                  {post.goalName && <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-50 px-3 py-1.5 text-xs font-medium text-pink-700"><Target className="size-3.5" aria-hidden="true" />{post.goalName}</span>}
                </div>
              )}
              <p className="mt-4 flex items-center gap-2 text-sm font-medium text-rose-500">
                <Heart className="size-4 fill-current" aria-hidden="true" /> Shared with love
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
