'use client';

import { useState, useEffect } from 'react';
import { Search, FileText, ExternalLink, Filter, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RegulationDoc } from '@/lib/types';
import { REGULATION_CATEGORIES } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

interface RegulationSearchProps {
  onDocumentSelect?: (doc: RegulationDoc) => void;
}

export default function RegulationSearch({ onDocumentSelect }: RegulationSearchProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [results, setResults] = useState<RegulationDoc[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const query = searchParams.get("query") ?? "";
  const category = searchParams.get("category") ?? "";

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(
        `/api/regulasi/search?query=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Jalankan search kalau query/category berubah
  useEffect(() => {
    if (query) {
      handleSearch();
    }
  }, [query, category]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateURL(query, category);
    }
  };

  const updateURL = (q: string, c: string) => {
    const params = new URLSearchParams();
    if (q) params.set("query", q);
    if (c && c !== "all") params.set("category", c);

    router.push(`?${params.toString()}`);
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      "Undang-Undang": "bg-blue-100 text-blue-800",
      SOP: "bg-green-100 text-green-800",
      "Prosedur Laporan": "bg-orange-100 text-orange-800",
    };
    return colors[cat] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-dark mb-2">
          Pencarian Regulasi Kedaruratan
        </h2>
        <p className="text-gray-600">
          Temukan dokumen regulasi, SOP, dan prosedur dengan teknologi NLP
        </p>
      </div>

      {/* Form */}
      <div className="disaster-card">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-grow">
            <Input
              value={query}
              onChange={(e) => updateURL(e.target.value, category)}
              onKeyPress={handleKeyPress}
              placeholder="Cari berdasarkan kata kunci (contoh: prosedur evakuasi tsunami)"
              className="w-full"
              aria-label="Kata kunci pencarian"
            />
          </div>

          <div className="flex space-x-2">
            <Select
              value={category || "all"}
              onValueChange={(val) => updateURL(query, val)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {REGULATION_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={() => updateURL(query, category)}
              disabled={!query.trim() || isLoading}
              className="disaster-button-primary flex items-center space-x-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span>Cari</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-dark">
              Hasil Pencarian
              {!isLoading && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  ({results.length} dokumen ditemukan)
                </span>
              )}
            </h3>
            {category && category !== "all" && (
              <Badge variant="outline" className="bg-secondary/10">
                <Filter className="h-3 w-3 mr-1" />
                {category}
              </Badge>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="disaster-card animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((doc) => (
                <div
                  key={doc.id}
                  className="disaster-card cursor-pointer hover:border-secondary/30"
                  onClick={() => onDocumentSelect?.(doc)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={getCategoryColor(doc.category)}>
                      {doc.category}
                    </Badge>
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>

                  <h4 className="font-semibold text-dark mb-2 line-clamp-2">
                    {doc.title}
                  </h4>

                  {doc.excerpt && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {doc.excerpt}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(doc.createdAt).toLocaleDateString("id-ID")}
                    </span>
                    {doc.url && (
                      <ExternalLink className="h-4 w-4 text-secondary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Tidak ada hasil ditemukan
              </h4>
              <p className="text-gray-600">
                Coba gunakan kata kunci lain atau ubah filter kategori
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}