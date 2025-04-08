import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Minus, Star, Check, ExternalLink } from 'lucide-react';
import { Button } from "/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "/components/ui/card";
import { Input } from "/components/ui/input";
import { Label } from "/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "/components/ui/select";
import { Checkbox } from "/components/ui/checkbox";
import { Badge } from "/components/ui/badge";

type Anime = {
  id: number;
  title: string;
  genre: string[];
  studio: string;
  episodes: number;
  rating: number;
  mood: string;
  gore: boolean;
  year: number;
  userRating?: number;
  inWatchlist?: boolean;
  source?: 'Crunchyroll' | 'Netflix';
  streamingUrl?: string;
  imageUrl?: string;
};

type WatchHistory = {
  id: number;
  title: string;
  watchedEpisodes: number;
  source: 'Crunchyroll' | 'Netflix';
};

export default function OtakuGuide() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [filteredAnime, setFilteredAnime] = useState<Anime[]>([]);
  const [watchlist, setWatchlist] = useState<Anime[]>([]);
  const [watchHistory, setWatchHistory] = useState<WatchHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | undefined>(undefined);
  const [selectedStudio, setSelectedStudio] = useState<string | undefined>(undefined);
  const [goreFilter, setGoreFilter] = useState(false);
  const [episodeFilter, setEpisodeFilter] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'title' | 'rating' | 'relevance'>('title');
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching anime data and watch history
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Mock anime data with both old and new titles
      const mockAnimeData: Anime[] = [
        {
          id: 1,
          title: 'Attack on Titan',
          genre: ['Action', 'Drama', 'Fantasy'],
          studio: 'Wit Studio',
          episodes: 87,
          rating: 8.5,
          mood: 'Dark',
          gore: true,
          year: 2013,
          source: 'Crunchyroll',
          streamingUrl: 'https://www.crunchyroll.com/attack-on-titan'
        },
        {
          id: 2,
          title: 'My Hero Academia',
          genre: ['Action', 'Comedy', 'Superhero'],
          studio: 'Bones',
          episodes: 138,
          rating: 8.0,
          mood: 'Uplifting',
          gore: false,
          year: 2016,
          source: 'Crunchyroll',
          streamingUrl: 'https://www.crunchyroll.com/my-hero-academia'
        },
        {
          id: 3,
          title: 'Spirited Away',
          genre: ['Adventure', 'Fantasy', 'Drama'],
          studio: 'Studio Ghibli',
          episodes: 1,
          rating: 8.6,
          mood: 'Whimsical',
          gore: false,
          year: 2001,
          source: 'Netflix',
          streamingUrl: 'https://www.netflix.com/title/60023642'
        },
        {
          id: 4,
          title: 'Death Note',
          genre: ['Thriller', 'Mystery', 'Psychological'],
          studio: 'Madhouse',
          episodes: 37,
          rating: 8.6,
          mood: 'Dark',
          gore: true,
          year: 2006,
          source: 'Netflix',
          streamingUrl: 'https://www.netflix.com/title/70204970'
        },
        {
          id: 5,
          title: 'Cowboy Bebop',
          genre: ['Action', 'Sci-Fi', 'Adventure'],
          studio: 'Sunrise',
          episodes: 26,
          rating: 8.9,
          mood: 'Cool',
          gore: false,
          year: 1998,
          source: 'Netflix',
          streamingUrl: 'https://www.netflix.com/title/80000445'
        },
        {
          id: 6,
          title: 'Demon Slayer',
          genre: ['Action', 'Fantasy', 'Supernatural'],
          studio: 'ufotable',
          episodes: 55,
          rating: 8.7,
          mood: 'Intense',
          gore: true,
          year: 2019,
          source: 'Crunchyroll',
          streamingUrl: 'https://www.crunchyroll.com/demon-slayer'
        },
        {
          id: 7,
          title: 'Neon Genesis Evangelion',
          genre: ['Mecha', 'Psychological', 'Drama'],
          studio: 'Gainax',
          episodes: 26,
          rating: 8.5,
          mood: 'Dark',
          gore: true,
          year: 1995,
          source: 'Netflix',
          streamingUrl: 'https://www.netflix.com/title/81033445'
        },
        {
          id: 8,
          title: 'Jujutsu Kaisen',
          genre: ['Action', 'Fantasy', 'Horror'],
          studio: 'MAPPA',
          episodes: 47,
          rating: 8.6,
          mood: 'Intense',
          gore: true,
          year: 2020,
          source: 'Crunchyroll',
          streamingUrl: 'https://www.crunchyroll.com/jujutsu-kaisen'
        }
      ];

      // Simulate watch history from streaming services
      const mockWatchHistory: WatchHistory[] = [
        { id: 1, title: 'Attack on Titan', watchedEpisodes: 50, source: 'Crunchyroll' },
        { id: 4, title: 'Death Note', watchedEpisodes: 37, source: 'Netflix' },
        { id: 5, title: 'Cowboy Bebop', watchedEpisodes: 10, source: 'Netflix' },
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Load user data from localStorage
      const savedWatchlist = localStorage.getItem('watchlist');
      const savedRatings = localStorage.getItem('ratings');
      const savedTotalRatings = localStorage.getItem('totalRatings');

      let updatedAnime = mockAnimeData;
      if (savedRatings) {
        const ratings = JSON.parse(savedRatings);
        updatedAnime = mockAnimeData.map(anime => {
          const rated = ratings.find((r: any) => r.id === anime.id);
          return rated ? { ...anime, userRating: rated.rating } : anime;
        });
      }

      if (savedWatchlist) {
        const parsedWatchlist = JSON.parse(savedWatchlist);
        setWatchlist(parsedWatchlist);
        updatedAnime = updatedAnime.map(anime => ({
          ...anime,
          inWatchlist: parsedWatchlist.some((w: Anime) => w.id === anime.id),
        }));
      }

      setAnimeList(updatedAnime);
      setWatchHistory(mockWatchHistory);
      if (savedTotalRatings) setTotalRatings(parseInt(savedTotalRatings));
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Calculate recommendation scores based on watch history
  const recommendedAnime = useMemo(() => {
    if (!watchHistory.length) return animeList;

    // Calculate genre preferences from watch history
    const watchedGenres = watchHistory.flatMap(wh => {
      const anime = animeList.find(a => a.id === wh.id);
      return anime ? anime.genre : [];
    });

    const genrePreference = watchedGenres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate relevance score for each anime
    return animeList.map(anime => {
      const genreScore = anime.genre.reduce(
        (score, genre) => score + (genrePreference[genre] || 0),
        0
      );

      // Bonus points if from same studio as watched anime
      const studioBonus = watchHistory.some(wh => {
        const watchedAnime = animeList.find(a => a.id === wh.id);
        return watchedAnime?.studio === anime.studio;
      }) ? 1 : 0;

      const relevanceScore = genreScore + studioBonus;
      return { ...anime, relevanceScore };
    });
  }, [animeList, watchHistory]);

  // Filter and sort anime
  useEffect(() => {
    let results = [...recommendedAnime];

    // Apply filters
    if (searchTerm) {
      results = results.filter(anime =>
        anime.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGenres.length > 0) {
      results = results.filter(anime =>
        selectedGenres.every(genre => anime.genre.includes(genre))
      );
    }

    if (selectedMood) {
      results = results.filter(anime => anime.mood === selectedMood);
    }

    if (selectedStudio) {
      results = results.filter(anime => anime.studio === selectedStudio);
    }

    if (goreFilter) {
      results = results.filter(anime => anime.gore === goreFilter);
    }

    if (episodeFilter) {
      switch (episodeFilter) {
        case 'short':
          results = results.filter(anime => anime.episodes <= 12);
          break;
        case 'medium':
          results = results.filter(anime => anime.episodes > 12 && anime.episodes <= 24);
          break;
        case 'long':
          results = results.filter(anime => anime.episodes > 24);
          break;
      }
    }

    // Apply sorting
    if (sortBy === 'title') {
      results.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'relevance') {
      results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
    }

    setFilteredAnime(results);
  }, [
    recommendedAnime,
    searchTerm,
    selectedGenres,
    selectedMood,
    selectedStudio,
    goreFilter,
    episodeFilter,
    sortBy,
  ]);

  // Get all unique values for filters
  const allGenres = Array.from(new Set(animeList.flatMap(anime => anime.genre))).sort();
  const allMoods = Array.from(new Set(animeList.map(anime => anime.mood))).sort();
  const allStudios = Array.from(new Set(animeList.map(anime => anime.studio))).sort();

  const toggleWatchlist = (anime: Anime) => {
    const isInWatchlist = watchlist.some(item => item.id === anime.id);
    const updatedWatchlist = isInWatchlist
      ? watchlist.filter(item => item.id !== anime.id)
      : [...watchlist, anime];

    setWatchlist(updatedWatchlist);
    localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
    setAnimeList(prevList =>
      prevList.map(item =>
        item.id === anime.id ? { ...item, inWatchlist: !isInWatchlist } : item
      )
    );
  };

  const rateAnime = (animeId: number, rating: number) => {
    const updatedAnimeList = animeList.map(anime =>
      anime.id === animeId ? { ...anime, userRating: rating } : anime
    );
    setAnimeList(updatedAnimeList);
    setTotalRatings(prev => prev + 1);

    const ratings = updatedAnimeList
      .filter(anime => anime.userRating)
      .map(anime => ({ id: anime.id, rating: anime.userRating }));
    localStorage.setItem('ratings', JSON.stringify(ratings));
    localStorage.setItem('totalRatings', (totalRatings + 1).toString());
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading anime database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Otaku Guide</h1>

      {totalRatings >= 5 && (
        <div className="flex items-center gap-2 mb-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
          <Check className="w-5 h-5" />
          <span>You've earned the Otaku badge! (5+ ratings)</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search & Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search anime..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div>
                <Label>Genres</Label>
                <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                  {allGenres.map(genre => (
                    <div key={genre} className="flex items-center space-x-2">
                      <Checkbox
                        id={`genre-${genre}`}
                        checked={selectedGenres.includes(genre)}
                        onCheckedChange={() => toggleGenre(genre)}
                      />
                      <Label htmlFor={`genre-${genre}`}>{genre}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Mood</Label>
                <Select value={selectedMood} onValueChange={setSelectedMood}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Moods" />
                  </SelectTrigger>
                  <SelectContent>
                    {allMoods.map(mood => (
                      <SelectItem key={mood} value={mood}>
                        {mood}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Studio</Label>
                <Select value={selectedStudio} onValueChange={setSelectedStudio}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Studios" />
                  </SelectTrigger>
                  <SelectContent>
                    {allStudios.map(studio => (
                      <SelectItem key={studio} value={studio}>
                        {studio}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Content Filters</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="gore-filter"
                      checked={goreFilter}
                      onCheckedChange={(checked) => setGoreFilter(checked as boolean)}
                    />
                    <Label htmlFor="gore-filter">Show only gory anime</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label>Length</Label>
                <Select value={episodeFilter} onValueChange={setEpisodeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short (1-12 episodes)</SelectItem>
                    <SelectItem value="medium">Medium (13-24 episodes)</SelectItem>
                    <SelectItem value="long">Long (25+ episodes)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Sort By</Label>
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as 'title' | 'rating' | 'relevance')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Title" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="relevance">Recommended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Watchlist */}
          <Card>
            <CardHeader>
              <CardTitle>Your Watchlist</CardTitle>
              <CardDescription>{watchlist.length} anime</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {watchlist.length === 0 ? (
                <p className="text-gray-500">Your watchlist is empty</p>
              ) : (
                <ul className="space-y-2">
                  {watchlist.map(anime => (
                    <li key={anime.id} className="flex justify-between items-center">
                      <span className="truncate">{anime.title}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleWatchlist(anime)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Streaming History */}
          <Card>
            <CardHeader>
              <CardTitle>Streaming History</CardTitle>
              <CardDescription>From Crunchyroll & Netflix</CardDescription>
            </CardHeader>
            <CardContent>
              {watchHistory.length === 0 ? (
                <p className="text-gray-500">No streaming history</p>
              ) : (
                <ul className="space-y-2">
                  {watchHistory.map(item => (
                    <li key={item.id} className="text-sm flex justify-between">
                      <span>
                        {item.title} ({item.watchedEpisodes} eps)
                      </span>
                      <Badge variant="outline">{item.source}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Anime list */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAnime.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No anime found matching your criteria</p>
              </div>
            ) : (
              filteredAnime.map(anime => (
                <Card key={anime.id} className="hover:shadow-lg transition-shadow h-full flex flex-col">
                  <div className="bg-gray-200 h-40 flex items-center justify-center">
                    {anime.imageUrl ? (
                      <img 
                        src={anime.imageUrl} 
                        alt={anime.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500">No image available</span>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{anime.title}</CardTitle>
                      <Button
                        variant={anime.inWatchlist ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleWatchlist(anime)}
                      >
                        {anime.inWatchlist ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </Button>
                    </div>
                    <CardDescription className="flex flex-wrap gap-1 items-center">
                      <span>{anime.studio}</span>
                      <span>•</span>
                      <span>{anime.episodes} eps</span>
                      <span>•</span>
                      <span>{anime.year}</span>
                      {anime.source && (
                        <>
                          <span>•</span>
                          <Badge variant="outline">{anime.source}</Badge>
                        </>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4 flex-grow">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {anime.genre.map(g => (
                        <Badge key={g} variant="secondary" className="text-xs">
                          {g}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{anime.rating.toFixed(1)}</span>
                      </div>
                      <Badge variant="outline">{anime.mood}</Badge>
                      {anime.gore && (
                        <Badge variant="destructive">Gore</Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start gap-2 pt-0">
                    {anime.streamingUrl && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => window.open(anime.streamingUrl, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Watch on {anime.source}
                      </Button>
                    )}
                    <div className="w-full">
                      <Label>Your Rating</Label>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Button
                            key={star}
                            variant={
                              anime.userRating && star <= anime.userRating ? 'default' : 'outline'
                            }
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => rateAnime(anime.id, star)}
                          >
                            <Star className="w-4 h-4" />
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
