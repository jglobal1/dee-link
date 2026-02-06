import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { findByShortCode, incrementClicks, buildWhatsAppUrl, type SnipLink } from "@/lib/shortener";
import { Link2 } from "lucide-react";

const ViewPage = () => {
  const { code } = useParams<{ code: string }>();
  const [status, setStatus] = useState<"loading" | "redirect" | "not-found" | "no-whatsapp">("loading");

  useEffect(() => {
    if (!code) {
      setStatus("not-found");
      return;
    }

    const link = findByShortCode(code);
    if (!link) {
      setStatus("not-found");
      return;
    }

    if (!link.whatsappNumber) {
      setStatus("no-whatsapp");
      return;
    }

    incrementClicks(code);
    const url = buildWhatsAppUrl(link.whatsappNumber, link.message);
    setStatus("redirect");
    window.location.replace(url);
  }, [code]);

  if (status === "loading" || status === "redirect") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">
          {status === "redirect" ? "Opening WhatsApp…" : "Loading…"}
        </p>
      </div>
    );
  }

  if (status === "not-found") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
        <Link2 className="mb-4 h-8 w-8 text-muted-foreground" />
        <h1 className="mb-2 text-lg font-semibold text-foreground">Link not found</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          This link doesn't exist or has been deleted.
        </p>
        <Link
          to="/"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Go home
        </Link>
      </div>
    );
  }

  // no-whatsapp: link exists but has no number
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <Link2 className="mb-4 h-8 w-8 text-muted-foreground" />
      <h1 className="mb-2 text-lg font-semibold text-foreground">Invalid link</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        This link has no WhatsApp number and cannot open a chat.
      </p>
      <Link
        to="/"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Go home
      </Link>
    </div>
  );
};

export default ViewPage;
