"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Pencil, Trash2, RefreshCw, Star, Link2, Unlink } from "lucide-react";

const REGIONS = [
  "brisbane-city-inner",
  "brisbane-north",
  "brisbane-south",
  "brisbane-east",
  "brisbane-west",
  "gold-coast",
  "sunshine-coast-moreton-bay",
  "ipswich-logan",
];

const REGION_TYPES = ["inner-city", "coastal", "outer-suburban"];
const BLOCK_TYPES = ["intro", "local-detail", "faq-question", "faq-answer"];

const regionLabel = (r: string) =>
  r.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const errMessage = (e: unknown): string =>
  e instanceof Error ? e.message : "Something went wrong.";

interface SuburbRow {
  id: number;
  slug: string;
  name: string;
  region: string;
  regionType: string;
  postcode: string | null;
  lat: string | null;
  lng: string | null;
  travelTimeMins: number | null;
  localLandmark: string | null;
  priceMultiplier: string;
  metaDescription: string | null;
  isActive: boolean;
}

interface CopyBlock {
  id: number;
  regionType: string;
  blockType: string;
  content: string;
}

interface ReviewRow {
  id: string;
  author: string;
  content: string;
  rating: number;
  service?: { name: string } | null;
}

interface ComboService {
  id: string;
  name: string;
  slug: string;
  enabled: boolean;
}

const emptySuburbForm = {
  name: "",
  region: "inner-city",
  regionType: "outer-suburban",
  postcode: "",
  lat: "",
  lng: "",
  travelTimeMins: "",
  priceMultiplier: "1.00",
  localLandmark: "",
  metaDescription: "",
  isActive: true,
};

type Tab = "suburbs" | "blocks" | "reviews";

export default function SuburbsPage() {
  const [tab, setTab] = useState<Tab>("suburbs");

  // ── Suburbs ────────────────────────────────────────────────────────────
  const [suburbs, setSuburbs] = useState<SuburbRow[]>([]);
  const [loading, setLoading] = useState(true); // starts true: first fetch happens in the mount effect
  const [editing, setEditing] = useState<SuburbRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptySuburbForm);
  const [saving, setSaving] = useState(false);
  const [comboServices, setComboServices] = useState<ComboService[]>([]);
  const [comboLoading, setComboLoading] = useState(false);

  // ── Copy blocks ────────────────────────────────────────────────────────
  const [blocks, setBlocks] = useState<CopyBlock[]>([]);
  const [blockFilterType, setBlockFilterType] = useState<string>("");
  const [blockFilterBlock, setBlockFilterBlock] = useState<string>("");
  const [blockDialog, setBlockDialog] = useState<CopyBlock | null>(null);
  const [blockCreating, setBlockCreating] = useState(false);
  const [blockForm, setBlockForm] = useState({ regionType: "inner-city", blockType: "intro", content: "" });
  const [blockSaving, setBlockSaving] = useState(false);

  // ── Reviews linking ────────────────────────────────────────────────────
  const [reviewSuburbId, setReviewSuburbId] = useState<string>("");
  const [linkedReviews, setLinkedReviews] = useState<ReviewRow[]>([]);
  const [availableReviews, setAvailableReviews] = useState<ReviewRow[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Initial load — no synchronous setState inside the effect body.
  useEffect(() => {
    let cancelled = false;
    // defer setState via promise chain (avoids react-hooks/set-state-in-effect)
    apiFetch("/api/suburbs?all=true")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to load suburbs"))))
      .then((data) => {
        if (!cancelled) setSuburbs(data.results || []);
      })
      .catch((e: unknown) => {
        if (!cancelled) toast.error(errMessage(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchSuburbs = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/suburbs?all=true");
      if (!res.ok) throw new Error("Failed to load suburbs");
      const data = await res.json();
      setSuburbs(data.results || []);
    } catch (e: unknown) {
      toast.error(errMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab !== "blocks") return;
    let cancelled = false;
    const params = new URLSearchParams();
    if (blockFilterType) params.set("regionType", blockFilterType);
    if (blockFilterBlock) params.set("blockType", blockFilterBlock);
    apiFetch(`/api/suburb-copy-blocks?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to load copy blocks"))))
      .then((data) => {
        if (!cancelled) setBlocks(data.results || []);
      })
      .catch((e: unknown) => {
        if (!cancelled) toast.error(errMessage(e));
      });
    return () => {
      cancelled = true;
    };
  }, [tab, blockFilterType, blockFilterBlock]);

  const fetchBlocks = async () => {
    try {
      const params = new URLSearchParams();
      if (blockFilterType) params.set("regionType", blockFilterType);
      if (blockFilterBlock) params.set("blockType", blockFilterBlock);
      const res = await apiFetch(`/api/suburb-copy-blocks?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load copy blocks");
      const data = await res.json();
      setBlocks(data.results || []);
    } catch (e: unknown) {
      toast.error(errMessage(e));
    }
  };

  const loadComboServices = async (suburbId: number) => {
    setComboLoading(true);
    try {
      const res = await apiFetch(`/api/suburbs/${suburbId}/combos`);
      if (!res.ok) throw new Error("Failed to load combo targets");
      const data = await res.json();
      setComboServices(data.services || []);
    } catch (e: unknown) {
      toast.error(errMessage(e));
    } finally {
      setComboLoading(false);
    }
  };

  const toggleCombo = async (serviceId: string, enabled: boolean) => {
    if (!editing) return;
    const prev = comboServices;
    setComboServices((cs) => cs.map((s) => (s.id === serviceId ? { ...s, enabled } : s)));
    try {
      const res = await apiFetch(`/api/suburbs/${editing.id}/combos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, enabled }),
      });
      if (!res.ok) throw new Error("Failed to update combo target");
    } catch (e: unknown) {
      setComboServices(prev);
      toast.error(errMessage(e));
    }
  };

  const toggleActive = async (row: SuburbRow) => {
    try {
      const res = await apiFetch(`/api/suburbs/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !row.isActive }),
      });
      if (!res.ok) throw new Error("Failed to toggle");
      toast.success(`${row.name} ${row.isActive ? "deactivated" : "activated"}.`);
      fetchSuburbs();
    } catch (e: unknown) {
      toast.error(errMessage(e));
    }
  };

  const handleDelete = async (row: SuburbRow) => {
    if (!confirm(`Delete ${row.name}? This removes its hub page and links.`)) return;
    try {
      const res = await apiFetch(`/api/suburbs/${row.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success(`${row.name} deleted.`);
      fetchSuburbs();
    } catch (e: unknown) {
      toast.error(errMessage(e));
    }
  };

  const openCreate = () => {
    setForm(emptySuburbForm);
    setCreating(true);
    setEditing(null);
  };

  const openEdit = (row: SuburbRow) => {
    setEditing(row);
    setCreating(false);
    setForm({
      name: row.name,
      region: row.region,
      regionType: row.regionType,
      postcode: row.postcode ?? "",
      lat: row.lat ?? "",
      lng: row.lng ?? "",
      travelTimeMins: row.travelTimeMins != null ? String(row.travelTimeMins) : "",
      priceMultiplier: row.priceMultiplier ?? "1.00",
      localLandmark: row.localLandmark ?? "",
      metaDescription: row.metaDescription ?? "",
      isActive: row.isActive,
    });
    loadComboServices(row.id);
  };

  const saveSuburb = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        postcode: form.postcode || null,
        lat: form.lat || null,
        lng: form.lng || null,
        travelTimeMins: form.travelTimeMins === "" ? null : Number(form.travelTimeMins),
        priceMultiplier: form.priceMultiplier || "1.00",
        localLandmark: form.localLandmark || null,
        metaDescription: form.metaDescription || null,
      };
      const res = editing
        ? await apiFetch(`/api/suburbs/${editing.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await apiFetch("/api/suburbs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { detail?: string }).detail || "Failed to save suburb");
      }
      toast.success(editing ? "Suburb updated." : "Suburb created.");
      setCreating(false);
      setEditing(null);
      fetchSuburbs();
    } catch (e: unknown) {
      toast.error(errMessage(e));
    } finally {
      setSaving(false);
    }
  };

  // ── Reviews linking ────────────────────────────────────────────────────
  const loadReviews = async (suburbId: string) => {
    if (!suburbId) return;
    setReviewsLoading(true);
    try {
      const res = await apiFetch(`/api/suburbs/${suburbId}/testimonials`);
      if (!res.ok) throw new Error("Failed to load reviews");
      const data = await res.json();
      setLinkedReviews(data.linked || []);
      setAvailableReviews(data.available || []);
    } catch (e: unknown) {
      toast.error(errMessage(e));
    } finally {
      setReviewsLoading(false);
    }
  };

  const linkReview = async (reviewId: string) => {
    if (!reviewSuburbId) return;
    try {
      const res = await apiFetch(`/api/suburbs/${reviewSuburbId}/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId }),
      });
      if (!res.ok) throw new Error("Failed to link review");
      toast.success("Review linked to suburb.");
      loadReviews(reviewSuburbId);
    } catch (e: unknown) {
      toast.error(errMessage(e));
    }
  };

  const unlinkReview = async (reviewId: string) => {
    if (!reviewSuburbId) return;
    try {
      const res = await apiFetch(`/api/suburbs/${reviewSuburbId}/testimonials?reviewId=${reviewId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to unlink review");
      toast.success("Review unlinked.");
      loadReviews(reviewSuburbId);
    } catch (e: unknown) {
      toast.error(errMessage(e));
    }
  };

  const saveBlock = async () => {
    setBlockSaving(true);
    try {
      const res = blockCreating
        ? await apiFetch("/api/suburb-copy-blocks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(blockForm),
          })
        : await apiFetch(`/api/suburb-copy-blocks/${blockDialog?.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(blockForm),
          });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { detail?: string }).detail || "Failed to save block");
      }
      toast.success("Copy block saved.");
      setBlockDialog(null);
      setBlockCreating(false);
      fetchBlocks();
    } catch (e: unknown) {
      toast.error(errMessage(e));
    } finally {
      setBlockSaving(false);
    }
  };

  const deleteBlock = async (block: CopyBlock) => {
    if (!confirm("Delete this copy block?")) return;
    try {
      const res = await apiFetch(`/api/suburb-copy-blocks/${block.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete block");
      toast.success("Copy block deleted.");
      fetchBlocks();
    } catch (e: unknown) {
      toast.error(errMessage(e));
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "suburbs", label: `Suburbs (${suburbs.length})` },
    { key: "blocks", label: "Copy Blocks" },
    { key: "reviews", label: "Link Reviews" },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold text-[#111827] tracking-tight flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> Suburb Pages
          </h1>
          <p className="text-xs text-[#4B5563]">
            Manage the programmatic suburb landing pages, copy pools, and review links.
          </p>
        </div>
        <div className="flex gap-2">
          {tab === "suburbs" && (
            <>
              <Button variant="outline" size="sm" onClick={fetchSuburbs} disabled={loading}>
                <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} /> Refresh
              </Button>
              <Button size="sm" onClick={openCreate}>
                <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Suburb
              </Button>
            </>
          )}
          {tab === "blocks" && (
            <Button
              size="sm"
              onClick={() => {
                setBlockForm({ regionType: "inner-city", blockType: "intro", content: "" });
                setBlockCreating(true);
                setBlockDialog(null);
              }}
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Copy Block
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-white border border-[#E5E7EB] p-1 rounded-lg w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              tab === t.key ? "bg-red-600 text-primary-foreground shadow-sm" : "text-[#4B5563] hover:bg-[#F9FAFB]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Suburbs tab ── */}
      {tab === "suburbs" && (
        <div className="bg-white rounded-lg border border-[#E5E7EB] shadow-xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Suburb</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Postcode</TableHead>
                <TableHead>Multiplier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suburbs.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">
                    {row.name}
                    <div className="text-[10px] text-[#9CA3AF]">/{row.slug}</div>
                  </TableCell>
                  <TableCell className="text-xs">{regionLabel(row.region)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-normal">
                      {row.regionType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{row.postcode ?? "—"}</TableCell>
                  <TableCell className="text-xs">{row.priceMultiplier}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggleActive(row)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                        row.isActive
                          ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                          : "bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100"
                      }`}
                    >
                      {row.isActive ? "Active" : "Inactive"}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="Edit" onClick={() => openEdit(row)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-[#EF4444] hover:text-[#DC2626] hover:bg-red-50"
                        title="Delete"
                        onClick={() => handleDelete(row)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {suburbs.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-xs text-[#9CA3AF] py-8">
                    No suburbs yet — add your first one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* ── Copy blocks tab ── */}
      {tab === "blocks" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Select value={blockFilterType} onValueChange={setBlockFilterType}>
              <SelectTrigger className="w-44 bg-white">
                <SelectValue placeholder="All region types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All region types</SelectItem>
                {REGION_TYPES.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={blockFilterBlock} onValueChange={setBlockFilterBlock}>
              <SelectTrigger className="w-44 bg-white">
                <SelectValue placeholder="All block types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All block types</SelectItem>
                {BLOCK_TYPES.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-white rounded-lg border border-[#E5E7EB] shadow-xs overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Region Type</TableHead>
                  <TableHead>Block</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blocks.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="text-xs">{b.regionType}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-normal">{b.blockType}</Badge>
                    </TableCell>
                    <TableCell className="text-xs max-w-[480px] whitespace-normal line-clamp-2">{b.content}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title="Edit"
                          onClick={() => {
                            setBlockDialog(b);
                            setBlockCreating(false);
                            setBlockForm({ regionType: b.regionType, blockType: b.blockType, content: b.content });
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-[#EF4444] hover:text-[#DC2626] hover:bg-red-50"
                          title="Delete"
                          onClick={() => deleteBlock(b)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {blocks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-xs text-[#9CA3AF] py-8">
                      No copy blocks match these filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* ── Reviews tab ── */}
      {tab === "reviews" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Select
              value={reviewSuburbId}
              onValueChange={(v) => {
                setReviewSuburbId(v);
                loadReviews(v);
              }}
            >
              <SelectTrigger className="w-64 bg-white">
                <SelectValue placeholder="Select a suburb" />
              </SelectTrigger>
              <SelectContent>
                {suburbs.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-[#9CA3AF]">
              {linkedReviews.length >= 3
                ? `${linkedReviews.length} linked — suburb page will show an aggregate rating`
                : `${linkedReviews.length} linked — need 3+ for aggregate rating`}
            </span>
          </div>

          {reviewSuburbId && (
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg border border-[#E5E7EB] shadow-xs p-4">
                <h3 className="text-xs font-bold text-[#111827] mb-3 flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 text-primary" /> Linked to this suburb
                </h3>
                <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
                  {linkedReviews.map((r) => (
                    <div key={r.id} className="border border-[#E5E7EB] rounded-lg p-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#111827]">{r.author} <span className="text-[#9CA3AF] font-normal">· {r.service?.name ?? "General"}</span></div>
                        <p className="text-[11px] text-[#4B5563] line-clamp-2">{r.content}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-[#EF4444] shrink-0" title="Unlink" onClick={() => unlinkReview(r.id)}>
                        <Unlink className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                  {linkedReviews.length === 0 && (
                    <p className="text-xs text-[#9CA3AF] py-6 text-center">No reviews linked yet.</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-[#E5E7EB] shadow-xs p-4">
                <h3 className="text-xs font-bold text-[#111827] mb-3 flex items-center gap-1.5">
                  <Link2 className="h-3.5 w-3.5 text-primary" /> Available reviews
                </h3>
                <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
                  {availableReviews.map((r) => (
                    <div key={r.id} className="border border-[#E5E7EB] rounded-lg p-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#111827]">{r.author} <span className="text-[#9CA3AF] font-normal">· {r.service?.name ?? "General"}</span></div>
                        <p className="text-[11px] text-[#4B5563] line-clamp-2">{r.content}</p>
                      </div>
                      <Button variant="outline" size="sm" className="h-7 text-[10px] shrink-0" onClick={() => linkReview(r.id)}>
                        Link
                      </Button>
                    </div>
                  ))}
                  {availableReviews.length === 0 && (
                    <p className="text-xs text-[#9CA3AF] py-6 text-center">
                      {reviewsLoading ? "Loading..." : "No more reviews available."}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Create/Edit suburb dialog ── */}
      <Dialog open={creating || !!editing} onOpenChange={(open) => { if (!open) { setCreating(false); setEditing(null); } }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${editing.name}` : "Add Suburb"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update the suburb hub page details below." : "Create a new suburb hub page."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Toowong" />
            </div>
            <div>
              <Label>Region</Label>
              <Select value={form.region} onValueChange={(v) => setForm({ ...form, region: v })}>
                <SelectTrigger className="w-full bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>{regionLabel(r)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Region type</Label>
              <Select value={form.regionType} onValueChange={(v) => setForm({ ...form, regionType: v })}>
                <SelectTrigger className="w-full bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {REGION_TYPES.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Postcode</Label>
              <Input value={form.postcode} onChange={(e) => setForm({ ...form, postcode: e.target.value })} placeholder="e.g. 4066" />
            </div>
            <div>
              <Label>Price multiplier</Label>
              <Input value={form.priceMultiplier} onChange={(e) => setForm({ ...form, priceMultiplier: e.target.value })} placeholder="1.00" />
            </div>
            <div>
              <Label>Lat</Label>
              <Input value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} placeholder="-27.478974" />
            </div>
            <div>
              <Label>Lng</Label>
              <Input value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} placeholder="152.985324" />
            </div>
            <div className="col-span-2">
              <Label>Travel time (mins)</Label>
              <Input value={form.travelTimeMins} onChange={(e) => setForm({ ...form, travelTimeMins: e.target.value })} placeholder="e.g. 10 (leave blank if unknown)" />
            </div>
            <div className="col-span-2">
              <Label>Local landmark</Label>
              <Input value={form.localLandmark} onChange={(e) => setForm({ ...form, localLandmark: e.target.value })} placeholder="e.g. Toowong Village" />
            </div>
            <div className="col-span-2">
              <Label>Meta description</Label>
              <Textarea value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} placeholder="SEO description (optional)" rows={2} />
            </div>
          </div>

          {editing && (
            <div className="border-t border-[#E5E7EB] pt-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs">Combo pages (service × this suburb)</Label>
                {comboLoading && <span className="text-[10px] text-[#9CA3AF]">Loading…</span>}
              </div>
              <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto">
                {comboServices.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 text-xs text-[#111827] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={s.enabled}
                      onChange={(e) => toggleCombo(s.id, e.target.checked)}
                    />
                    {s.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => { setCreating(false); setEditing(null); }}>Cancel</Button>
            <Button onClick={saveSuburb} disabled={saving || !form.name.trim()}>
              {saving ? "Saving…" : editing ? "Save Changes" : "Create Suburb"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Copy block dialog ── */}
      <Dialog open={blockCreating || !!blockDialog} onOpenChange={(open) => { if (!open) { setBlockDialog(null); setBlockCreating(false); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{blockCreating ? "Add Copy Block" : "Edit Copy Block"}</DialogTitle>
            <DialogDescription>Content shown on suburb hub pages by region type.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Region type</Label>
                <Select value={blockForm.regionType} onValueChange={(v) => setBlockForm({ ...blockForm, regionType: v })}>
                  <SelectTrigger className="w-full bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {REGION_TYPES.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Block type</Label>
                <Select value={blockForm.blockType} onValueChange={(v) => setBlockForm({ ...blockForm, blockType: v })}>
                  <SelectTrigger className="w-full bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {BLOCK_TYPES.map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Content</Label>
              <Textarea
                rows={4}
                value={blockForm.content}
                onChange={(e) => setBlockForm({ ...blockForm, content: e.target.value })}
                placeholder="Copy text…"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setBlockDialog(null); setBlockCreating(false); }}>Cancel</Button>
            <Button onClick={saveBlock} disabled={blockSaving || !blockForm.content.trim()}>
              {blockSaving ? "Saving…" : "Save Block"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
