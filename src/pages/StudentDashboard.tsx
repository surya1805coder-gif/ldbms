import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchBooks, getCurrentUser, logout, type Book } from '@/lib/store';
import { 
  BookOpen, Search, LogOut, Library, 
  BookMarked, Loader2, Sparkles, Clock, 
  CheckCircle2, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

type Section = 'browse' | 'my-books';

const StudentDashboard = () => {
  const [section, setSection] = useState<Section>('browse');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Queries
  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser
  });

  const { data: books = [], isLoading: loadingBooks } = useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks
  });

  const { data: studentName } = useQuery({
    queryKey: ['studentProfile', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data } = await supabase.from('students').select('name').eq('user_id', user?.id).single();
      return data?.name || null;
    }
  });

  const filter = search.toLowerCase();
  const filteredBooks = books.filter(
    b => b.title.toLowerCase().includes(filter) || b.author.toLowerCase().includes(filter) || b.book_id.toLowerCase().includes(filter)
  );

  const myBooks = user ? books.filter(b =>
    b.status === 'Issued' && (
      b.issued_to === user.username ||
      (studentName && b.issued_to === studentName)
    )
  ) : [];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-background/50">
      {/* Sidebar */}
      <aside className="w-72 bg-card border-r border-border flex flex-col shrink-0 relative z-20 shadow-xl">
        <div className="p-8 flex items-center gap-3 border-b border-border/50">
          <div className="p-2 bg-primary/10 rounded-xl">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg leading-tight uppercase tracking-wider">LDBMS</h2>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest leading-none mt-0.5">Student Portal</p>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-secondary/50 rounded-2xl p-4 flex items-center gap-3 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {user?.username?.[0].toUpperCase() || 'S'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{studentName || user?.username || 'Loading...'}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">ID: {user?.id.slice(0, 8)}...</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-6 space-y-2">
          <button
            onClick={() => { setSection('browse'); setSearch(''); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
              section === 'browse' 
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]' 
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            <Library className="w-5 h-5" />
            Browse Library
          </button>
          <button
            onClick={() => { setSection('my-books'); setSearch(''); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
              section === 'my-books' 
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]' 
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            <BookMarked className="w-5 h-5" />
            My Borrowed Books
          </button>
        </nav>

        <div className="p-6 border-t border-border/50">
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            className="w-full justify-start gap-3 rounded-2xl text-destructive hover:bg-destructive/10 hover:text-destructive h-12"
          >
            <LogOut className="w-5 h-5" />
            Logout Session
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative z-10">
        <header className="h-24 border-b border-border/50 flex items-center justify-between px-10 bg-background/40 backdrop-blur-md sticky top-0 z-30">
          <div>
            <h1 className="text-2xl font-display font-bold capitalize">{section.replace('-', ' ')}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Explore our refined collection</p>
          </div>
          
          <div className="flex items-center gap-6">
            {section === 'browse' && (
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Search assets..."
                  className="w-72 pl-12 h-11 bg-secondary/50 border-white/5 rounded-2xl focus-visible:ring-primary focus-visible:bg-secondary transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            )}
            <div className="px-4 py-2 rounded-2xl bg-primary/10 border border-primary/20 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary italic">Beta</span>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {section === 'browse' && (
                <div className="space-y-8">
                  <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-start gap-4">
                    <div className="p-3 bg-primary/20 rounded-2xl">
                      <Info className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Welcome back, {studentName?.split(' ')[0] || 'Scholar'}!</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        You can borrow up to <span className="text-primary font-bold">3 books</span> at a time. 
                        Please ensure you return items within 14 days to avoid membership suspension.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loadingBooks ? (
                      [1, 2, 3, 4, 5, 6].map(i => (
                        <Card key={i} className="glass-card shadow-none overflow-hidden">
                          <CardHeader className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-4 w-32" />
                          </CardHeader>
                          <CardContent>
                            <Skeleton className="h-8 w-24 rounded-full" />
                          </CardContent>
                        </Card>
                      ))
                    ) : filteredBooks.length === 0 ? (
                      <div className="col-span-full py-24 text-center">
                        <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search className="w-8 h-8 opacity-20" />
                        </div>
                        <h3 className="text-lg font-bold">No assets found</h3>
                        <p className="text-muted-foreground text-sm">Refine your search parameters and try again.</p>
                      </div>
                    ) : filteredBooks.map((book) => (
                      <Card key={book.book_id} className="glass-card group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300">
                        <CardHeader className="space-y-1.5 pb-3">
                          <div className="flex justify-between items-start">
                            <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground border-white/5 bg-white/5">
                              {book.book_id}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg font-display font-medium line-clamp-1">{book.title}</CardTitle>
                          <CardDescription className="text-xs group-hover:text-primary transition-colors">{book.author}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            book.status === 'Available' 
                              ? 'bg-success/10 text-success border border-success/20' 
                              : 'bg-warning/10 text-warning border border-warning/20'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${book.status === 'Available' ? 'bg-success' : 'bg-warning'} animate-pulse`} />
                            {book.status}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {section === 'my-books' && (
                <div className="space-y-8">
                  {myBooks.length === 0 ? (
                    <div className="max-w-md mx-auto text-center py-24 space-y-6">
                      <div className="w-24 h-24 bg-primary/5 rounded-[40px] flex items-center justify-center mx-auto relative group">
                        <div className="absolute inset-0 bg-primary/10 rounded-[40px] animate-ping opacity-0 group-hover:opacity-100 transition-opacity" />
                        <BookMarked className="w-10 h-10 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold">No Active Borrowings</h2>
                        <p className="text-muted-foreground">Your library record is clean. Ready to discover your next great read?</p>
                      </div>
                      <Button onClick={() => setSection('browse')} size="lg" className="rounded-2xl h-14 px-8">
                        Browse the Catalog
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="glass-card border-success/20 bg-success/5 overflow-hidden">
                          <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <div className="p-2 bg-success/20 rounded-xl">
                              <CheckCircle2 className="w-5 h-5 text-success" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">Good Standing</CardTitle>
                              <CardDescription>All items are within due dates</CardDescription>
                            </div>
                          </CardHeader>
                        </Card>
                        <Card className="glass-card border-primary/20 bg-primary/5 overflow-hidden">
                          <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <div className="p-2 bg-primary/20 rounded-xl">
                              <Clock className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{myBooks.length} Items Held</CardTitle>
                              <CardDescription>{3 - myBooks.length} borrowing slots remaining</CardDescription>
                            </div>
                          </CardHeader>
                        </Card>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                        {myBooks.map((book) => (
                          <Card key={book.book_id} className="glass-card border-primary/10 hover:border-primary/30 transition-all group">
                            <CardHeader className="space-y-1.5">
                              <div className="flex justify-between items-center mb-1">
                                <Badge variant="secondary" className="font-mono text-[10px] bg-primary/10 text-primary">
                                  {book.book_id}
                                </Badge>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-success flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3 h-3" /> Active
                                </span>
                              </div>
                              <CardTitle className="text-xl font-display font-bold group-hover:text-primary transition-colors">{book.title}</CardTitle>
                              <CardDescription className="text-sm">{book.author}</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-2">
                              <div className="p-4 rounded-2xl bg-secondary/50 border border-white/5">
                                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider mb-2">
                                  <span className="text-muted-foreground">Due Date</span>
                                  <span className="text-primary">14 Days Left</span>
                                </div>
                                <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                                  <div className="w-full h-full bg-primary" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
