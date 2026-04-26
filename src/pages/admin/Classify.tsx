import { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { mediaLibrary } from "@/lib/api/media-library";
import { classifyMany, type ClassifyResultItem } from "@/lib/api/classify-media";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  Check,
  X,
  ArrowLeft,
  Loader2,
  RefreshCw,
  Filter,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AssetRow {
  storage_path: string;
  url: string;
  alt: string | null;
  service: string | null;
  shot_type: string | null;
  project_guess: string | null;
  ai_subject: string | null;
  ai_quality: string | null;
  ai_season: string | null;
  ai_notes: string | null;
  ai_review_status: string | null;
}

const SERVICES = [
  "decks",
  "fencing",
  "sheds",
  "painting",
  "siding",
  "pergolas",
  "interiors",
  "exterior",
  "other",
];

const SHOT_TYPES = [
  "hero",
  "elevation",
  "detail",
  "interior",
  "process",
  "wide",
  "aerial",
  "texture",
];

const QUALITY = ["hero", "portfolio", "reference", "reject"];

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Unclassified" },
  { value: "suggested", label: "AI suggested" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const Classify = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [assets, setAssets] = useState<AssetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [edits, setEdits] = useState<Partial<AssetRow>>({});
  const [classifying, setClassifying] = useState(false);
  const [classifyProgress, setClassifyProgress] = useState({ done: 0, total: 0 });
  const [serverRunning, setServerRunning] = useState(false);
  const [serverPolling, setServerPolling] = useState(false);

  // Title + noindex
  useEffect(() => {
    const prev = document.title;
    document.title = "Classify · Creek Admin";
    let meta = document.querySelector('meta[name="robots"]');
    const created = !meta;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
    }
    const prevContent = meta.getAttribute("content");
    meta.setAttribute("content", "noindex,nofollow");
    return () => {
      document.title = prev;
      if (created) meta?.remove();
      else if (prevContent) meta?.setAttribute("content", prevContent);
    };
  }, []);

  const loadAssets = useCallback(async () => {
    // Get all storage paths from the bucket (via the library list)
    const lib = await mediaLibrary.list();
    if (!lib.success) {
      toast({ title: "Couldn't load library", variant: "destructive" });
      return;
    }
    const allPaths: { path: string; url: string }[] = [];
    for (const cat of lib.categories ?? []) {
      for (const f of cat.files) {
        if (/\.(png|jpe?g|webp|avif|heic|gif)$/i.test(f.name)) {
          allPaths.push({ path: f.path, url: f.url });
        }
      }
    }

    // Get metadata for all
    const { data: metaRows } = await supabase
      .from("media_metadata")
      .select(
        "storage_path, alt, service, shot_type, project_guess, ai_subject, ai_quality, ai_season, ai_notes, ai_review_status",
      );
    const metaByPath = new Map<string, Partial<AssetRow>>();
    (metaRows ?? []).forEach((r) => metaByPath.set(r.storage_path, r));

    const rows: AssetRow[] = allPaths.map(({ path, url }) => {
      const m = metaByPath.get(path) ?? {};
      return {
        storage_path: path,
        url,
        alt: m.alt ?? null,
        service: m.service ?? null,
        shot_type: m.shot_type ?? null,
        project_guess: m.project_guess ?? null,
        ai_subject: m.ai_subject ?? null,
        ai_quality: m.ai_quality ?? null,
        ai_season: m.ai_season ?? null,
        ai_notes: m.ai_notes ?? null,
        ai_review_status: m.ai_review_status ?? "pending",
      };
    });
    setAssets(rows);
  }, [toast]);

  useEffect(() => {
    setLoading(true);
    loadAssets().finally(() => setLoading(false));
  }, [loadAssets]);

  const visible = useMemo(() => {
    if (statusFilter === "all") return assets;
    return assets.filter((a) => (a.ai_review_status ?? "pending") === statusFilter);
  }, [assets, statusFilter]);

  const selected = useMemo(
    () => assets.find((a) => a.storage_path === selectedPath) ?? null,
    [assets, selectedPath],
  );

  // When selection changes, hydrate edit form
  useEffect(() => {
    if (selected) {
      setEdits({
        alt: selected.alt,
        service: selected.service,
        shot_type: selected.shot_type,
        project_guess: selected.project_guess,
      });
    } else {
      setEdits({});
    }
  }, [selected]);

  const handleClassifyUnclassified = async () => {
    const paths = assets
      .filter((a) => (a.ai_review_status ?? "pending") === "pending")
      .map((a) => a.storage_path);
    if (paths.length === 0) {
      toast({ title: "Nothing to classify" });
      return;
    }
    setClassifying(true);
    setClassifyProgress({ done: 0, total: paths.length });
    let done = 0;
    await classifyMany(paths, {
      onItem: (item: ClassifyResultItem) => {
        done += 1;
        setClassifyProgress({ done, total: paths.length });
        if (item.success && item.classification) {
          setAssets((prev) =>
            prev.map((a) =>
              a.storage_path === item.path
                ? {
                    ...a,
                    alt: item.classification!.alt,
                    service: item.classification!.service,
                    shot_type: item.classification!.shot_type,
                    project_guess: item.classification!.project_guess,
                    ai_subject: item.classification!.subject,
                    ai_quality: item.classification!.quality,
                    ai_season: item.classification!.season,
                    ai_notes: item.classification!.notes ?? "",
                    ai_review_status: "suggested",
                  }
                : a,
            ),
          );
        }
      },
      onError: (err) => {
        toast({
          title: "Classifier paused",
          description: err,
          variant: "destructive",
        });
      },
    });
    setClassifying(false);
    toast({ title: `Classified ${done} of ${paths.length}` });
  };

  /**
   * Power flow — classify everything pending AND auto-approve any photo
   * the AI scored hero/portfolio quality with a real service + alt text.
   * Anything weaker stays in `suggested` for manual review.
   *
   * Also auto-clusters: if the classifier returned the same project_guess
   * for ≥3 photos, a `projects` row is upserted with featured=true and the
   * highest-quality `hero` shot becomes hero_path.
   */
  const handleClassifyAndAutoApprove = async () => {
    const paths = assets
      .filter((a) => (a.ai_review_status ?? "pending") === "pending")
      .map((a) => a.storage_path);
    if (paths.length === 0) {
      toast({ title: "Nothing to classify" });
      return;
    }
    setClassifying(true);
    setClassifyProgress({ done: 0, total: paths.length });

    // Track auto-approvable items as they come in
    const approveQueue: Array<{
      path: string;
      service: string;
      shot_type: string;
      alt: string;
      project_slug: string | null;
      quality: string;
    }> = [];

    let done = 0;
    await classifyMany(paths, {
      onItem: (item: ClassifyResultItem) => {
        done += 1;
        setClassifyProgress({ done, total: paths.length });
        if (item.success && item.classification) {
          const c = item.classification;
          const altOk = (c.alt ?? "").trim().length >= 12;
          const serviceOk = !!c.service && c.service !== "other";
          const qualityOk = c.quality === "hero" || c.quality === "portfolio";
          if (altOk && serviceOk && qualityOk) {
            approveQueue.push({
              path: item.path,
              service: c.service,
              shot_type: c.shot_type,
              alt: c.alt,
              project_slug: c.project_guess?.trim() || null,
              quality: c.quality,
            });
          }
          setAssets((prev) =>
            prev.map((a) =>
              a.storage_path === item.path
                ? {
                    ...a,
                    alt: c.alt,
                    service: c.service,
                    shot_type: c.shot_type,
                    project_guess: c.project_guess,
                    ai_subject: c.subject,
                    ai_quality: c.quality,
                    ai_season: c.season,
                    ai_notes: c.notes ?? "",
                    ai_review_status: "suggested",
                  }
                : a,
            ),
          );
        }
      },
      onError: (err) => {
        toast({
          title: "Classifier paused",
          description: err,
          variant: "destructive",
        });
      },
    });

    // Now batch-approve everything that passed the bar
    let approved = 0;
    let projectsCreated = 0;

    if (approveQueue.length > 0) {
      // Group by intended folder (project_slug or service)
      const byFolder = new Map<string, typeof approveQueue>();
      for (const item of approveQueue) {
        const folder = item.project_slug || item.service;
        const arr = byFolder.get(folder) ?? [];
        arr.push(item);
        byFolder.set(folder, arr);
      }

      for (const [folder, items] of byFolder) {
        for (const item of items) {
          const currentFolder = item.path.split("/")[0];
          let finalPath = item.path;
          if (folder !== currentFolder) {
            const moved = await mediaLibrary.move(item.path, folder);
            if (moved.success) finalPath = moved.newPath ?? item.path;
          }
          const { error } = await supabase
            .from("media_metadata")
            .upsert(
              {
                storage_path: finalPath,
                alt: item.alt,
                service: item.service,
                shot_type: item.shot_type,
                project_guess: item.project_slug,
                project_slug: item.project_slug,
                ai_review_status: "approved",
              },
              { onConflict: "storage_path" },
            );
          if (!error) approved++;
          // Mutate the in-memory path so subsequent project upsert points right
          item.path = finalPath;
        }
      }

      // Auto-cluster projects: each slug with ≥3 approved photos becomes a project
      const bySlug = new Map<string, typeof approveQueue>();
      for (const item of approveQueue) {
        if (!item.project_slug) continue;
        const arr = bySlug.get(item.project_slug) ?? [];
        arr.push(item);
        bySlug.set(item.project_slug, arr);
      }
      for (const [slug, items] of bySlug) {
        if (items.length < 3) continue;
        // Pick best hero shot: prefer quality:hero AND shot_type:hero
        const heroPick =
          items.find((i) => i.quality === "hero" && i.shot_type === "hero") ??
          items.find((i) => i.shot_type === "hero") ??
          items.find((i) => i.quality === "hero") ??
          items[0];
        const title = slug
          .split(/[-_]/)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        const { data: existing } = await supabase
          .from("projects")
          .select("slug")
          .eq("slug", slug)
          .maybeSingle();
        if (!existing) {
          const { error: pErr } = await supabase.from("projects").insert({
            slug,
            title,
            service: items[0].service,
            status: "complete",
            year: new Date().getFullYear(),
            featured: true,
            display_order: 50,
            hero_path: heroPick.path,
          });
          if (!pErr) projectsCreated++;
        }
      }
    }

    // Kick off LQIP + dimension backfill for the freshly approved photos
    // (fire-and-forget — site renders fine without it, gets prettier when it lands)
    let backfilled = 0;
    if (approveQueue.length > 0) {
      try {
        const auth = (await supabase.auth.getSession()).data.session
          ?.access_token;
        if (auth) {
          const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/backfill-lqip`;
          // Process in chunks of 30 to stay well under the 60-cap and keep
          // each call under the edge function timeout.
          for (let i = 0; i < approveQueue.length; i += 30) {
            const slice = approveQueue.slice(i, i + 30).map((q) => q.path);
            const res = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth}`,
                apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              },
              body: JSON.stringify({ paths: slice }),
            });
            if (res.ok) {
              const data = await res.json();
              backfilled += data.ok ?? 0;
            }
          }
        }
      } catch (e) {
        console.warn("LQIP backfill failed (non-fatal)", e);
      }
    }

    setClassifying(false);
    toast({
      title: `Classified ${done}, auto-approved ${approved}`,
      description:
        (projectsCreated > 0
          ? `Seeded ${projectsCreated} new projects on /work. `
          : "Photos are now live on the public site. ") +
        (backfilled > 0 ? `LQIP generated for ${backfilled}.` : ""),
    });
    await loadAssets();
  };

  const handleApprove = async () => {
    if (!selected) return;
    const updates = {
      alt: edits.alt ?? selected.alt,
      service: edits.service ?? selected.service,
      shot_type: edits.shot_type ?? selected.shot_type,
      project_guess: edits.project_guess ?? selected.project_guess,
    };

    // Decide target folder. Priority: project_guess (if set) > service > 'reviewed'
    const targetFolder =
      (updates.project_guess && updates.project_guess.trim()) ||
      updates.service ||
      "reviewed";
    const currentFolder = selected.storage_path.split("/")[0];

    let finalPath = selected.storage_path;

    if (targetFolder !== currentFolder) {
      const moved = await mediaLibrary.move(selected.storage_path, targetFolder);
      if (!moved.success) {
        toast({
          title: "Couldn't move file",
          description: moved.error,
          variant: "destructive",
        });
        return;
      }
      finalPath = moved.newPath ?? selected.storage_path;
    }

    // Save metadata + mark approved.
    // We write `project_guess` into BOTH project_guess (the AI suggestion field)
    // AND project_slug (the canonical column the public site queries).
    const slug = updates.project_guess?.trim() || null;
    const { error } = await supabase
      .from("media_metadata")
      .upsert(
        {
          storage_path: finalPath,
          alt: updates.alt,
          service: updates.service,
          shot_type: updates.shot_type,
          project_guess: slug,
          project_slug: slug,
          ai_review_status: "approved",
        },
        { onConflict: "storage_path" },
      );

    if (error) {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Bridge: if this image has a project_slug AND is hero quality OR shot_type='hero',
    // ensure a row exists in `projects` so /work picks it up automatically.
    if (slug && updates.service) {
      const isHero =
        selected.ai_quality === "hero" || updates.shot_type === "hero";
      const projectTitle = slug
        .split(/[-_]/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      // Insert if missing; never overwrite a manually-edited title/summary.
      const { data: existing } = await supabase
        .from("projects")
        .select("slug, hero_path")
        .eq("slug", slug)
        .maybeSingle();

      if (!existing) {
        await supabase.from("projects").insert({
          slug,
          title: projectTitle,
          service: updates.service,
          status: "complete",
          year: new Date().getFullYear(),
          featured: true,
          display_order: 50,
          hero_path: isHero ? finalPath : null,
        });
      } else if (isHero && !existing.hero_path) {
        // Backfill hero_path the first time we see a hero shot for an existing project
        await supabase
          .from("projects")
          .update({ hero_path: finalPath })
          .eq("slug", slug);
      }
    }

    toast({ title: "Approved" });
    // Move to next pending in the visible list
    const idx = visible.findIndex((a) => a.storage_path === selected.storage_path);
    const next = visible[idx + 1] ?? visible[idx - 1] ?? null;
    setSelectedPath(next?.storage_path ?? null);
    await loadAssets();
  };

  const handleReject = async () => {
    if (!selected) return;
    const moved = await mediaLibrary.move(selected.storage_path, "_rejected");
    const finalPath = moved.success ? moved.newPath ?? selected.storage_path : selected.storage_path;
    await supabase.from("media_metadata").upsert(
      {
        storage_path: finalPath,
        ai_review_status: "rejected",
      },
      { onConflict: "storage_path" },
    );
    toast({ title: "Rejected" });
    const idx = visible.findIndex((a) => a.storage_path === selected.storage_path);
    const next = visible[idx + 1] ?? visible[idx - 1] ?? null;
    setSelectedPath(next?.storage_path ?? null);
    await loadAssets();
  };

  const counts = useMemo(() => {
    const by: Record<string, number> = { pending: 0, suggested: 0, approved: 0, rejected: 0 };
    for (const a of assets) by[a.ai_review_status ?? "pending"]++;
    return by;
  }, [assets]);

  const qualityColor = (q: string | null) => {
    if (q === "hero") return "bg-cedar text-cedar-foreground";
    if (q === "portfolio") return "bg-evergreen text-evergreen-foreground";
    if (q === "reference") return "bg-muted text-muted-foreground";
    if (q === "reject") return "bg-destructive/20 text-destructive";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/media")}>
              <ArrowLeft className="h-4 w-4" /> Library
            </Button>
            <div>
              <h1 className="font-serif text-2xl text-foreground">Classify</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {counts.pending} unclassified · {counts.suggested} awaiting review ·{" "}
                {counts.approved} approved · {counts.rejected} rejected
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={handleClassifyAndAutoApprove}
              disabled={classifying || counts.pending === 0}
              className="bg-cedar text-cedar-foreground hover:bg-cedar/90"
            >
              {classifying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              {classifying
                ? `${classifyProgress.done}/${classifyProgress.total}`
                : `Classify & auto-approve (${counts.pending})`}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleClassifyUnclassified}
              disabled={classifying || counts.pending === 0}
              title="Classify only — no auto-approve"
            >
              <Sparkles className="h-4 w-4" />
              Classify only
            </Button>
            <Button variant="ghost" size="sm" onClick={() => loadAssets()}>
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
          </div>
        </div>
        {classifying && (
          <Progress
            value={
              classifyProgress.total > 0
                ? (classifyProgress.done / classifyProgress.total) * 100
                : 0
            }
            className="h-0.5 rounded-none"
          />
        )}
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Filter bar */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                "text-xs uppercase tracking-wider px-3 py-1.5 rounded-sm border transition-colors",
                statusFilter === f.value
                  ? "border-cedar bg-cedar/10 text-foreground"
                  : "border-border text-muted-foreground hover:border-cedar/40",
              )}
            >
              {f.label}
              {f.value !== "all" && (
                <span className="ml-1.5 text-cedar/70">{counts[f.value] ?? 0}</span>
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Thumbnail grid */}
          <Card className="p-4">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : visible.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nothing matching this filter.
              </p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                {visible.map((a) => {
                  const isSel = a.storage_path === selectedPath;
                  return (
                    <button
                      key={a.storage_path}
                      type="button"
                      onClick={() => setSelectedPath(a.storage_path)}
                      className={cn(
                        "relative aspect-square rounded-sm overflow-hidden bg-muted border-2 transition-all group",
                        isSel
                          ? "border-cedar ring-2 ring-cedar/30"
                          : "border-transparent hover:border-cedar/40",
                      )}
                    >
                      <img
                        src={a.url}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                      {a.ai_quality && (
                        <span
                          className={cn(
                            "absolute top-1 left-1 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm",
                            qualityColor(a.ai_quality),
                          )}
                        >
                          {a.ai_quality}
                        </span>
                      )}
                      {a.service && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 py-1">
                          <p className="text-[9px] text-white truncate">
                            {a.service}
                          </p>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Detail editor */}
          <Card className="p-4 h-fit lg:sticky lg:top-[110px]">
            {!selected ? (
              <p className="text-sm text-muted-foreground italic">
                Select a photo to review.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="rounded-sm overflow-hidden bg-muted">
                  <img
                    src={selected.url}
                    alt={selected.alt ?? ""}
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-xs font-mono text-muted-foreground break-all">
                  {selected.storage_path}
                </p>
                {selected.ai_subject && (
                  <p className="text-sm italic text-foreground">
                    “{selected.ai_subject}”
                  </p>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-[10px]">
                    {selected.ai_review_status}
                  </Badge>
                  {selected.ai_quality && (
                    <Badge className={cn("text-[10px]", qualityColor(selected.ai_quality))}>
                      {selected.ai_quality}
                    </Badge>
                  )}
                  {selected.ai_season && selected.ai_season !== "unknown" && (
                    <Badge variant="secondary" className="text-[10px]">
                      {selected.ai_season}
                    </Badge>
                  )}
                </div>
                {selected.ai_notes && (
                  <p className="text-xs text-muted-foreground">
                    {selected.ai_notes}
                  </p>
                )}

                <div className="space-y-3 pt-2 border-t border-border">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Alt text</Label>
                    <Textarea
                      value={edits.alt ?? ""}
                      onChange={(e) =>
                        setEdits((p) => ({ ...p, alt: e.target.value }))
                      }
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Service</Label>
                      <Select
                        value={edits.service ?? ""}
                        onValueChange={(v) => setEdits((p) => ({ ...p, service: v }))}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SERVICES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Shot type</Label>
                      <Select
                        value={edits.shot_type ?? ""}
                        onValueChange={(v) => setEdits((p) => ({ ...p, shot_type: v }))}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SHOT_TYPES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Project slug (groups photos together)</Label>
                    <Input
                      value={edits.project_guess ?? ""}
                      onChange={(e) =>
                        setEdits((p) => ({ ...p, project_guess: e.target.value }))
                      }
                      placeholder="e.g. westwood-cedar-deck"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button
                    onClick={handleApprove}
                    className="flex-1"
                    size="sm"
                  >
                    <Check className="h-4 w-4" /> Approve
                  </Button>
                  <Button
                    onClick={handleReject}
                    variant="outline"
                    size="sm"
                  >
                    <X className="h-4 w-4" /> Reject
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground italic">
                  Approve moves the file into <code>{(edits.project_guess ?? edits.service ?? "reviewed").toString().slice(0, 40)}/</code> and locks the metadata.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Classify;
