"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Download, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Collection {
  id: string;
  name: string;
  documentCount: number;
  sizeInMB: number;
  status: string;
}

interface CollectionApiResponse {
  name: string;
  documentCount: number;
  sizeInMB: number;
}

interface CollectionListProps {
  onSelectionChange?: (selectedIds: string[]) => void;
}

export function CollectionList({ onSelectionChange }: CollectionListProps) {
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const [selectedCollections, setSelectedCollections] = React.useState<
    string[]
  >([]);
  const [loading, setLoading] = React.useState(true);
  const [exporting, setExporting] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      console.log("UI: Fetching collections...");
      const response = await fetch("/api/collections");
      const data = await response.json();
      console.log("UI: Received data:", data);

      if (!data.collections) {
        throw new Error("No collections data received");
      }

      // Transform the collections data to include size and count
      const collectionsWithDetails = data.collections.map(
        (collection: CollectionApiResponse) => ({
          id: collection.name,
          name: collection.name,
          documentCount: collection.documentCount,
          sizeInMB: collection.sizeInMB,
          status: "active",
        })
      );

      setCollections(collectionsWithDetails);
      setError(null);
    } catch (err) {
      console.error("UI: Error fetching collections:", err);
      setError("Failed to fetch collections");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (value: string) => {
    switch (value) {
      case "all":
        setSelectedCollections(collections.map((col) => col.id));
        break;
      case "none":
        setSelectedCollections([]);
        break;
      default:
        break;
    }
    onSelectionChange?.(selectedCollections);
  };

  const handleCollectionToggle = (collectionId: string) => {
    setSelectedCollections((prev) => {
      const newSelection = prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId];
      onSelectionChange?.(newSelection);
      return newSelection;
    });
  };

  const handleExport = async () => {
    try {
      setExporting(selectedCollections); // Mark all selected collections as exporting

      const response = await fetch("/api/export-bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ collections: selectedCollections }),
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `collections-export-${new Date().toISOString()}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Clear selection after successful export
      setSelectedCollections([]);
      onSelectionChange?.([]);
    } catch (err) {
      console.error("Error exporting collections:", err);
    } finally {
      setExporting([]); // Clear exporting state
    }
  };

  // Filter collections based on search query and sort alphabetically
  const filteredCollections = React.useMemo(() => {
    const filtered = !searchQuery.trim()
      ? collections
      : collections.filter((collection) =>
          collection.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

    // Sort alphabetically by name
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [collections, searchQuery]);

  if (loading) {
    return <div className="text-center p-4">Loading collections...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (collections.length === 0) {
    return (
      <div className="text-center p-4">
        No collections found in the database.
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Collections</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Select collections to export as CSV
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select onValueChange={handleSelectAll}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Select All</SelectItem>
              <SelectItem value="none">Deselect All</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="default"
            size="default"
            disabled={selectedCollections.length === 0 || exporting.length > 0}
            onClick={handleExport}
          >
            {exporting.length > 0 ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search collections..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          {filteredCollections.map((collection) => (
            <div
              key={collection.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer"
              onClick={() =>
                !exporting.includes(collection.id) &&
                handleCollectionToggle(collection.id)
              }
            >
              <div className="flex items-center space-x-4">
                <Checkbox
                  id={collection.id}
                  checked={selectedCollections.includes(collection.id)}
                  onCheckedChange={() => handleCollectionToggle(collection.id)}
                  disabled={exporting.includes(collection.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div>
                  <Label
                    htmlFor={collection.id}
                    className="text-sm font-medium leading-none cursor-pointer select-none"
                  >
                    {collection.name}
                  </Label>
                  <div className="text-xs text-muted-foreground mt-1 select-none">
                    {collection.documentCount.toLocaleString()} documents •{" "}
                    {collection.sizeInMB} MB
                  </div>
                </div>
              </div>
              {exporting.includes(collection.id) && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
            </div>
          ))}
        </div>
      </div>

      {filteredCollections.length === 0 && searchQuery && (
        <div className="text-center p-4 text-muted-foreground">
          No collections found matching &ldquo;{searchQuery}&rdquo;
        </div>
      )}
    </Card>
  );
}
