"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Pencil,
  ArrowUp,
  ArrowDown,
  Trash2,
  Save,
  X,
  Download,
  Upload,
  Sun,
  Moon,
} from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { getRelevantEmoji } from "../lib/emoji";
import { useTheme } from "next-themes";

interface ChecklistItem {
  id: number;
  text: string;
  checked: boolean;
}

// Type guards outside component
function isChecklistItem(item: unknown): item is ChecklistItem {
  return (
    typeof item === "object" &&
    item !== null &&
    "id" in item &&
    typeof (item as { id: unknown }).id === "number" &&
    "text" in item &&
    typeof (item as { text: unknown }).text === "string" &&
    "checked" in item &&
    typeof (item as { checked: unknown }).checked === "boolean"
  );
}
function isChecklistItemArray(arr: unknown): arr is ChecklistItem[] {
  return Array.isArray(arr) && arr.every(isChecklistItem);
}

export default function HomePage() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [input, setInput] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTexts, setEditTexts] = useState<Record<number, string>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  // Load items from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("travel-checklist-items");
    if (stored) {
      try {
        const parsed: unknown = JSON.parse(stored);
        if (isChecklistItemArray(parsed)) setItems(parsed);
      } catch {}
    }
  }, []);

  // Save items to localStorage whenever they change (only when not in edit mode)
  useEffect(() => {
    if (!isEditMode) {
      localStorage.setItem("travel-checklist-items", JSON.stringify(items));
    }
  }, [items, isEditMode]);

  const addItem = () => {
    const text = input.trim();
    if (!text) return;
    setItems([...items, { id: Date.now(), text, checked: false }]);
    setInput("");
  };

  const toggleItem = (id: number) => {
    if (isEditMode) return;
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  const uncheckAll = () =>
    setItems((items) => items.map((item) => ({ ...item, checked: false })));

  const moveItemUp = (index: number) => {
    if (index === 0) return;
    setItems((prev) => {
      if (index < 1 || index >= prev.length) return prev;
      const newItems = [...prev];
      if (newItems[index] && newItems[index - 1]) {
        const temp: ChecklistItem = newItems[index - 1]!;
        newItems[index - 1] = newItems[index]!;
        newItems[index] = temp;
      }
      return newItems;
    });
  };
  const moveItemDown = (index: number) => {
    if (index === items.length - 1) return;
    setItems((prev) => {
      if (index < 0 || index >= prev.length - 1) return prev;
      const newItems = [...prev];
      if (newItems[index] && newItems[index + 1]) {
        const temp: ChecklistItem = newItems[index + 1]!;
        newItems[index + 1] = newItems[index]!;
        newItems[index] = temp;
      }
      return newItems;
    });
  };

  const enterEditMode = () => {
    setEditTexts(Object.fromEntries(items.map((item) => [item.id, item.text])));
    setIsEditMode(true);
  };
  const saveAllEdits = () => {
    setItems((prev) =>
      prev.map((item) => ({ ...item, text: editTexts[item.id] ?? item.text })),
    );
    setIsEditMode(false);
    setEditTexts({});
  };
  const cancelAllEdits = () => {
    setIsEditMode(false);
    setEditTexts({});
  };
  const updateEditText = (id: number, text: string) =>
    setEditTexts((prev) => ({ ...prev, [id]: text }));

  const deleteItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setDeleteId(null);
  };
  const deleteAllItems = () => {
    setItems([]);
    setShowDeleteAllDialog(false);
    setIsEditMode(false);
    setEditTexts({});
  };

  const exportData = () => {
    const dataStr = JSON.stringify(items, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "travel-checklist.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed: unknown = JSON.parse(content);
        if (isChecklistItemArray(parsed)) setItems(parsed);
        else
          alert(
            "Invalid file format. Please select a valid travel checklist export file.",
          );
      } catch {
        alert("Error reading file. Please make sure it's a valid JSON file.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <main className="bg-background relative flex min-h-screen flex-col items-center justify-center p-8">
      {/* Theme toggle button */}

      <div suppressHydrationWarning>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="absolute top-4 right-4"
          aria-label={
            resolvedTheme === "dark"
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          suppressHydrationWarning
        >
          {resolvedTheme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="w-full max-w-md space-y-6">
        <h1 className="text-center text-3xl font-bold">Travel Checklist</h1>

        {/* Edit mode controls */}
        {!isEditMode ? (
          <div className="flex items-center gap-2">
            <Input
              className="flex-1"
              type="text"
              placeholder="Add an item..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem()}
            />
            <Button onClick={addItem} className="h-9 dark:text-white">
              Add
            </Button>
            {items.length > 0 && (
              <Button variant="outline" onClick={enterEditMode}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <Button onClick={saveAllEdits} className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              Save All
            </Button>
            <Button variant="outline" onClick={cancelAllEdits}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Dialog
              open={showDeleteAllDialog}
              onOpenChange={setShowDeleteAllDialog}
            >
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete All
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete all items?</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete all items? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="destructive" onClick={deleteAllItems}>
                    Delete All
                  </Button>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        <div className="space-y-2">
          {items.length === 0 && (
            <div className="text-muted-foreground text-center">
              No items yet.
            </div>
          )}
          {items.map((item, idx) => (
            <Card
              key={item.id}
              className="group hover:bg-accent/50 cursor-pointer p-2 shadow-xs transition-colors select-none"
              onClick={() => !isEditMode && toggleItem(item.id)}
            >
              <CardContent className="flex items-center gap-2 p-3">
                <Checkbox
                  id={`checkbox-${item.id}`}
                  checked={item.checked}
                  onCheckedChange={() => toggleItem(item.id)}
                  disabled={isEditMode}
                  onClick={(e) => e.stopPropagation()}
                />
                {(() => {
                  const emoji = getRelevantEmoji(item.text);
                  return emoji ? (
                    <span
                      className="mr-1 ml-0.5 text-lg select-none"
                      aria-hidden="true"
                    >
                      {emoji}
                    </span>
                  ) : null;
                })()}

                {isEditMode ? (
                  <>
                    <span className="min-w-0 flex-1">
                      <Input
                        className="w-full text-sm"
                        value={editTexts[item.id] ?? item.text}
                        onChange={(e) =>
                          updateEditText(item.id, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveAllEdits();
                          if (e.key === "Escape") cancelAllEdits();
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </span>
                    <div
                      className="ml-auto flex gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => moveItemUp(idx)}
                        aria-label="Move up"
                        disabled={idx === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => moveItemDown(idx)}
                        aria-label="Move down"
                        disabled={idx === items.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Dialog
                        open={deleteId === item.id}
                        onOpenChange={(open) =>
                          setDeleteId(open ? item.id : null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label="Delete"
                            onClick={() => setDeleteId(item.id)}
                          >
                            <Trash2 className="text-destructive h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete item?</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this item? This
                              action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="destructive"
                              onClick={() => deleteItem(item.id)}
                            >
                              Delete
                            </Button>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </>
                ) : (
                  <>
                    <span
                      className={
                        "min-w-0 flex-1 text-left " +
                        (item.checked
                          ? "text-muted-foreground line-through"
                          : "")
                      }
                    >
                      {item.text}
                    </span>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {!isEditMode && items.length > 0 && (
          <Button variant="outline" onClick={uncheckAll} className="w-full">
            Uncheck All
          </Button>
        )}

        {/* Import/Export buttons */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportData} className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <Label
              htmlFor="import-file"
              className="flex cursor-pointer items-center justify-center"
            >
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Label>
          </Button>
          <input
            id="import-file"
            type="file"
            accept=".json"
            onChange={importData}
            className="hidden"
          />
        </div>
      </div>
      <footer className="text-muted-foreground mt-8 text-center text-xs">
        <Link
          href="https://www.matv.io"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary inline-block underline-offset-4 transition-colors"
          style={{ marginTop: "0.5rem", paddingBottom: "2px" }}
        >
          Made with <span className="text-red-500">❤️</span> by Daniel Miller
        </Link>
        <div className="mt-2">
          <Link
            href="https://github.com/syntheit/travel-checklist"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary inline-flex items-center gap-1 transition-colors"
          >
            <SiGithub className="h-4 w-4" />
            <span>View on GitHub</span>
          </Link>
        </div>
      </footer>
    </main>
  );
}
