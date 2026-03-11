import { useState, useRef, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { Search, X, Loader2, MapPin } from 'lucide-react';

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

export function MapSearchControl() {
  const map = useMap();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Prevent map interactions when interacting with search
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const stop = (e: Event) => e.stopPropagation();
    el.addEventListener('mousedown', stop);
    el.addEventListener('dblclick', stop);
    el.addEventListener('wheel', stop);
    el.addEventListener('touchstart', stop);
    return () => {
      el.removeEventListener('mousedown', stop);
      el.removeEventListener('dblclick', stop);
      el.removeEventListener('wheel', stop);
      el.removeEventListener('touchstart', stop);
    };
  }, []);

  const searchAddress = async (q: string) => {
    if (q.length < 3) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&countrycodes=br`
      );
      const data: SearchResult[] = await res.json();
      setResults(data);
      setIsOpen(data.length > 0);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchAddress(value), 400);
  };

  const selectResult = (r: SearchResult) => {
    const lat = parseFloat(r.lat);
    const lng = parseFloat(r.lon);
    map.flyTo([lat, lng], 17, { duration: 1.2 });
    setQuery(r.display_name.split(',').slice(0, 2).join(','));
    setIsOpen(false);
    setResults([]);
  };

  return (
    <div
      ref={containerRef}
      className="absolute top-3 left-12 z-[1000] w-[280px] sm:w-[320px]"
    >
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Buscar endereço..."
          className="w-full h-9 pl-8 pr-8 rounded-lg border border-border bg-background/95 backdrop-blur text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
        />
        {isSearching && (
          <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
        {!isSearching && query && (
          <button
            onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <ul className="mt-1 rounded-lg border border-border bg-background/95 backdrop-blur shadow-lg overflow-hidden max-h-52 overflow-y-auto">
          {results.map((r, i) => (
            <li key={i}>
              <button
                onClick={() => selectResult(r)}
                className="flex items-start gap-2 w-full px-3 py-2 text-left text-xs hover:bg-accent/50 transition-colors"
              >
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
                <span className="line-clamp-2">{r.display_name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
