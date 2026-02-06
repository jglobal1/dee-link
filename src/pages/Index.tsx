import { useState, useEffect } from "react";
import { Link2, ArrowRight } from "lucide-react";
import { createSnipLink, getLinks, deleteLink, type SnipLink } from "@/lib/shortener";
import { LinkCard } from "@/components/LinkCard";
import { toast } from "sonner";

const Index = () => {
  const [message, setMessage] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [links, setLinks] = useState<SnipLink[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const baseUrl = window.location.origin;

  useEffect(() => {
    setLinks(getLinks());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    const trimmedWhatsapp = whatsapp.trim();
    if (!trimmedMessage) return;
    if (!trimmedWhatsapp) {
      toast.error("WhatsApp number is required");
      return;
    }

    if (trimmedMessage.length > 5000) {
      toast.error("Message is too long (max 5,000 characters)");
      return;
    }

    setIsCreating(true);
    await new Promise((r) => setTimeout(r, 300));

    try {
      const link = createSnipLink({
        message: trimmedMessage,
        whatsappNumber: trimmedWhatsapp,
      });
      setLinks(getLinks());
      setMessage("");
      setWhatsapp("");

      const shortUrl = `${baseUrl}/s/${link.shortCode}`;
      await navigator.clipboard.writeText(shortUrl);
      toast.success("Link created & copied to clipboard");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = (id: string) => {
    deleteLink(id);
    setLinks(getLinks());
    toast("Link deleted");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-6 py-4">
          <Link2 className="h-5 w-5 text-foreground" />
          <span className="text-base font-semibold tracking-tight text-foreground">
            JQ link
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
        <div className="mb-10">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Create a shareable link
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your text and WhatsApp number. Your link opens WhatsApp with the message ready.
          </p>
        </div>

        {/* Create form */}
        <form onSubmit={handleSubmit} className="mb-10 space-y-4">
          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Your message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="The message that will open in WhatsApp when someone clicks your link..."
              rows={5}
              maxLength={5000}
              className="w-full resize-y rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background"
              autoFocus
            />
            <p className="mt-1 text-right text-xs text-muted-foreground">
              {message.length}/5,000
            </p>
          </div>

          {/* WhatsApp number */}
          <div>
            <label
              htmlFor="whatsapp"
              className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              WhatsApp number
            </label>
            <input
              id="whatsapp"
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+234 812 345 6789"
              maxLength={20}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Include country code. Clicks go straight to this number on WhatsApp with your text.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!message.trim() || !whatsapp.trim() || isCreating}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {isCreating ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <>
                Create link
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Links list */}
        {links.length > 0 && (
          <div>
            <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Your links
            </h2>
            <div className="space-y-2">
              {links.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  baseUrl={baseUrl}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}

        {links.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-muted-foreground">
              No links yet. Write a message above to get started.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-2xl px-6 py-4">
          <p className="text-xs text-muted-foreground">
            JQ link — shareable links, made simple
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
