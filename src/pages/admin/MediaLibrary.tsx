import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  mediaLibrary,
  type MediaCategory,
  type MediaFile,
  type MediaMetadata,
} from "@/lib/api/media-library";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Upload,
  Folder,
  FolderPlus,
  RefreshCw,
  LogOut,
  Trash2,
  FolderInput,
  X,
  Copy,
  Film,
  ExternalLink,
  Check,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const SEED_FOLDERS = [
  "riverbend-studio-shed",
  "decks",
  "fencing",
  "sheds",
  "painting",
  "siding",
  "pergolas",
  "process",
  "hero",
  "team",
  "videos",
  "uncategorized",
];

interface QueueItem {
  id: string;
  file: File;
  folder: string;
  status: "queued" | "uploading" | "done" | "failed";
  progress: number;
  error?: string;
  resultPath?: string;
}

function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  if (b < 1024 * 1024 * 1024) return `${(b / 1024 / 1024).toFixed(1)} MB`;
  return `${(b / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function isVideo(ct: string | null | undefined, name?: string): boolean {
  if (ct?.startsWith("video/")) return true;
  if (!name) return false;
  return /\.(mp4|webm|mov|m4v)$/i.test(name);
}

const MediaLibrary = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories, setCategories] = useState<MediaCategory[]>([]);
  const [metadata, setMetadata] = useState<Record<string, MediaMetadata>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploadFolder, setUploadFolder] = useState("uncategorized");
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [drawerFile, setDrawerFile] = useState<MediaFile | null>(null);
  const [drawerMeta, setDrawerMeta] = useState<MediaMetadata>({});
  const [confirmDelete, setConfirmDelete] = useState<string[] | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Title + noindex
  useEffect(() => {
    const prev = document.title;
    document.title = "Media Library · Creek Admin";
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

  const loadLibrary = useCallback(async () => {
    const res = await mediaLibrary.list();
    if (!res.success) {
      toast({
        title: "Couldn't load library",
        description: res.error,
        variant: "destructive",
      });
      return;
    }
    // Ensure seed folders are visible even when empty
    const known = new Set((res.categories ?? []).map((c) => c.name));
    const merged: MediaCategory[] = [...(res.categories ?? [])];
    for (const f of SEED_FOLDERS) {
      if (!known.has(f)) merged.push({ name: f, files: [] });
    }
    merged.sort((a, b) => a.name.localeCompare(b.name));
    setCategories(merged);
    setMetadata(res.metadata ?? {});
  }, [toast]);

  useEffect(() => {
    setLoading(true);
    loadLibrary().finally(() => setLoading(false));
  }, [loadLibrary]);

  // Sync drawer meta when drawer opens
  useEffect(() => {
    if (drawerFile) {
      setDrawerMeta(metadata[drawerFile.path] ?? {});
    }
  }, [drawerFile, metadata]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLibrary();
    setRefreshing(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  // ---- Upload queue ----
  const enqueueFiles = useCallback(
    (files: FileList | File[]) => {
      const arr = Array.from(files);
      const items: QueueItem[] = arr.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name}`,
        file,
        folder: uploadFolder,
        status: "queued",
        progress: 0,
      }));
      setQueue((q) => [...q, ...items]);

      void mediaLibrary.uploadMany(
        items.map((i) => ({ id: i.id, file: i.file, folder: i.folder })),
        {
          concurrency: 4,
          onItemStart: (id) =>
            setQueue((q) =>
              q.map((it) => (it.id === id ? { ...it, status: "uploading" } : it)),
            ),
          onItemProgress: (id, e) =>
            setQueue((q) =>
              q.map((it) => (it.id === id ? { ...it, progress: e.progress } : it)),
            ),
          onItemComplete: (id, result) => {
            setQueue((q) =>
              q.map((it) =>
                it.id === id
                  ? {
                      ...it,
                      status: result.success ? "done" : "failed",
                      progress: result.success ? 1 : it.progress,
                      error: result.error,
                      resultPath: result.path,
                    }
                  : it,
              ),
            );
            if (result.success) {
              // Refresh library quietly when each file finishes
              void loadLibrary();
            }
          },
        },
      );
    },
    [uploadFolder, loadLibrary],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) enqueueFiles(e.dataTransfer.files);
  };

  const clearCompleted = () => {
    setQueue((q) => q.filter((i) => i.status !== "done"));
  };

  // ---- Selection ----
  const toggleSelect = (path: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") clearSelection();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleBulkMove = async (target: string) => {
    const paths = [...selected];
    if (paths.length === 0) return;
    const res = await mediaLibrary.bulkMove(paths, target);
    if (!res.success) {
      toast({
        title: "Move failed",
        description: res.error,
        variant: "destructive",
      });
    } else {
      toast({ title: `Moved ${paths.length} item(s) to ${target}` });
    }
    clearSelection();
    await loadLibrary();
  };

  const handleBulkDelete = async () => {
    const paths = confirmDelete ?? [];
    if (paths.length === 0) return;
    const res = await mediaLibrary.bulkDelete(paths);
    if (!res.success) {
      toast({
        title: "Delete failed",
        description: res.error,
        variant: "destructive",
      });
    } else {
      toast({ title: `Deleted ${paths.length} item(s)` });
    }
    setConfirmDelete(null);
    clearSelection();
    await loadLibrary();
  };

  const handleAddFolder = async () => {
    const name = newFolderName.trim();
    if (!name) return;
    const res = await mediaLibrary.createFolder(name);
    if (!res.success) {
      toast({
        title: "Couldn't create folder",
        description: res.error,
        variant: "destructive",
      });
      return;
    }
    toast({ title: `Created "${name}"` });
    setNewFolderName("");
    setShowAddFolder(false);
    await loadLibrary();
  };

  const handleSaveMeta = async () => {
    if (!drawerFile) return;
    const res = await mediaLibrary.updateMetadata(drawerFile.path, drawerMeta);
    if (!res.success) {
      toast({
        title: "Save failed",
        description: res.error,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Metadata saved" });
    setMetadata((m) => ({ ...m, [drawerFile.path]: drawerMeta }));
  };

  const totals = useMemo(() => {
    let count = 0;
    let bytes = 0;
    for (const c of categories) {
      for (const f of c.files) {
        count += 1;
        bytes += f.size || 0;
      }
    }
    return { count, bytes };
  }, [categories]);

  const allFolderNames = useMemo(
    () => categories.map((c) => c.name),
    [categories],
  );

  const selectedCount = selected.size;
  const activeUploads = queue.filter(
    (q) => q.status === "queued" || q.status === "uploading",
  ).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border/60 bg-card sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-serif text-2xl text-foreground">Media Library</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {totals.count} files · {formatBytes(totals.bytes)} ·{" "}
              {categories.length} folders
              {activeUploads > 0 && (
                <span className="ml-2 text-cedar">
                  · {activeUploads} uploading
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddFolder(true)}
            >
              <FolderPlus className="h-4 w-4" /> New folder
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw
                className={cn("h-4 w-4", refreshing && "animate-spin")}
              />{" "}
              Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Upload zone */}
        <Card className="p-6 space-y-4">
          <div className="flex items-end gap-4 flex-wrap">
            <div className="space-y-1.5 min-w-[220px]">
              <Label className="text-xs uppercase tracking-wider">
                Target folder
              </Label>
              <Select value={uploadFolder} onValueChange={setUploadFolder}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allFolderNames.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground flex-1 min-w-[200px]">
              Drag &amp; drop up to hundreds of files at once. Images and videos
              up to 100 MB each. Uploads run 4 in parallel.
            </p>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => document.getElementById("media-file-input")?.click()}
            className={cn(
              "border-2 border-dashed rounded-md p-12 text-center cursor-pointer transition-colors",
              dragOver
                ? "border-cedar bg-cedar/5"
                : "border-border hover:border-cedar/50 hover:bg-muted/30",
            )}
          >
            <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-foreground">
              Drop files here or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              JPG · PNG · WebP · AVIF · HEIC · MP4 · MOV · WebM
            </p>
            <input
              id="media-file-input"
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) enqueueFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </div>

          {/* Queue */}
          {queue.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">
                  Upload queue ({queue.length})
                </h3>
                <Button variant="ghost" size="sm" onClick={clearCompleted}>
                  Clear completed
                </Button>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-1 border border-border/50 rounded-md p-2 bg-muted/20">
                {queue.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 text-xs py-1.5 px-2"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-mono text-foreground">
                          {item.file.name}
                        </span>
                        <span className="text-muted-foreground shrink-0">
                          {formatBytes(item.file.size)} · {item.folder}/
                        </span>
                      </div>
                      {item.status === "uploading" && (
                        <Progress
                          value={item.progress * 100}
                          className="h-1 mt-1"
                        />
                      )}
                      {item.status === "failed" && (
                        <p className="text-destructive mt-0.5">{item.error}</p>
                      )}
                    </div>
                    <span
                      className={cn(
                        "shrink-0 text-[11px] uppercase tracking-wider",
                        item.status === "done" && "text-cedar",
                        item.status === "failed" && "text-destructive",
                        item.status === "queued" && "text-muted-foreground",
                        item.status === "uploading" && "text-foreground",
                      )}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Selection bar */}
        {selectedCount > 0 && (
          <Card className="p-3 bg-cedar/5 border-cedar/30 sticky top-[88px] z-20">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-sm font-medium">
                {selectedCount} selected
              </span>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FolderInput className="h-4 w-4" /> Move to
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {allFolderNames.map((f) => (
                      <DropdownMenuItem
                        key={f}
                        onClick={() => handleBulkMove(f)}
                      >
                        {f}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      [...selected]
                        .map((p) => {
                          for (const c of categories) {
                            const f = c.files.find((x) => x.path === p);
                            if (f) return f.url;
                          }
                          return p;
                        })
                        .join("\n"),
                    );
                    toast({ title: "URLs copied" });
                  }}
                >
                  <Copy className="h-4 w-4" /> Copy URLs
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setConfirmDelete([...selected])}
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
                <Button variant="ghost" size="sm" onClick={clearSelection}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Folders */}
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading library…</p>
        ) : (
          <div className="space-y-4">
            {categories.map((cat) => {
              const selectedHere = cat.files.filter((f) =>
                selected.has(f.path),
              ).length;
              return (
                <Card
                  key={cat.name}
                  className="p-4"
                  style={{
                    contentVisibility: "auto",
                    containIntrinsicSize: "1px 280px",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Folder className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium text-foreground">{cat.name}</h3>
                    <Badge variant="secondary" className="text-[10px]">
                      {cat.files.length}
                    </Badge>
                    {selectedHere > 0 && (
                      <Badge className="text-[10px] bg-cedar text-cedar-foreground">
                        {selectedHere} selected
                      </Badge>
                    )}
                  </div>
                  {cat.files.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">
                      Empty — set this as your target folder above and drop files in.
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                      {cat.files.map((f) => {
                        const isSel = selected.has(f.path);
                        const video = isVideo(f.contentType, f.name);
                        return (
                          <button
                            key={f.path}
                            type="button"
                            onClick={(e) => {
                              if (e.shiftKey || e.metaKey || e.ctrlKey) {
                                toggleSelect(f.path);
                              } else if (selectedCount > 0) {
                                toggleSelect(f.path);
                              } else {
                                setDrawerFile(f);
                              }
                            }}
                            className={cn(
                              "relative aspect-square rounded-sm overflow-hidden bg-muted border-2 transition-all group",
                              isSel
                                ? "border-cedar ring-2 ring-cedar/30"
                                : "border-transparent hover:border-cedar/40",
                            )}
                          >
                            {video ? (
                              <div className="w-full h-full flex items-center justify-center bg-foreground/10">
                                <Film className="h-8 w-8 text-foreground/60" />
                              </div>
                            ) : (
                              <img
                                src={f.url}
                                alt={metadata[f.path]?.alt ?? f.name}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover"
                              />
                            )}
                            {isSel && (
                              <div className="absolute top-1 right-1 bg-cedar text-cedar-foreground rounded-full p-0.5">
                                <Check className="h-3 w-3" />
                              </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="text-[9px] text-white truncate font-mono">
                                {f.name}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* Detail drawer */}
      <Sheet
        open={!!drawerFile}
        onOpenChange={(o) => !o && setDrawerFile(null)}
      >
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {drawerFile && (
            <>
              <SheetHeader>
                <SheetTitle className="font-mono text-sm break-all">
                  {drawerFile.name}
                </SheetTitle>
                <SheetDescription className="text-xs">
                  {drawerFile.path}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="rounded-sm overflow-hidden bg-muted">
                  {isVideo(drawerFile.contentType, drawerFile.name) ? (
                    <video
                      src={drawerFile.url}
                      controls
                      className="w-full h-auto"
                    />
                  ) : (
                    <img
                      src={drawerFile.url}
                      alt={drawerMeta.alt ?? drawerFile.name}
                      className="w-full h-auto"
                    />
                  )}
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>{formatBytes(drawerFile.size)}</p>
                  {drawerFile.contentType && <p>{drawerFile.contentType}</p>}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      navigator.clipboard.writeText(drawerFile.url);
                      toast({ title: "URL copied" });
                    }}
                  >
                    <Copy className="h-4 w-4" /> Copy URL
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(drawerFile.url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3 pt-2 border-t border-border">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Alt text</Label>
                    <Textarea
                      value={drawerMeta.alt ?? ""}
                      onChange={(e) =>
                        setDrawerMeta((m) => ({ ...m, alt: e.target.value }))
                      }
                      rows={3}
                      placeholder="Descriptive alt text — geographic + structural."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Project slug</Label>
                      <Input
                        value={drawerMeta.project_slug ?? ""}
                        onChange={(e) =>
                          setDrawerMeta((m) => ({
                            ...m,
                            project_slug: e.target.value,
                          }))
                        }
                        placeholder="riverbend-studio-shed"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Shot type</Label>
                      <Input
                        value={drawerMeta.shot_type ?? ""}
                        onChange={(e) =>
                          setDrawerMeta((m) => ({
                            ...m,
                            shot_type: e.target.value,
                          }))
                        }
                        placeholder="hero / elevation / interior"
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveMeta} className="w-full" size="sm">
                    Save metadata
                  </Button>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setConfirmDelete([drawerFile.path]);
                    setDrawerFile(null);
                  }}
                >
                  <Trash2 className="h-4 w-4" /> Delete file
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add folder dialog */}
      <Dialog open={showAddFolder} onOpenChange={setShowAddFolder}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New folder</DialogTitle>
            <DialogDescription>
              Lowercase, hyphenated. Used as the storage path.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="e.g. westwood-deck"
            autoFocus
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddFolder(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddFolder} disabled={!newFolderName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {confirmDelete?.length ?? 0} file
              {(confirmDelete?.length ?? 0) === 1 ? "" : "s"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the files from cloud storage. Anything
              currently referencing these URLs on the live site will break.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MediaLibrary;
