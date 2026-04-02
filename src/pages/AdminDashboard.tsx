import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchBooks, fetchStudents, getStats, addBook, 
  deleteBook as removeBook, issueBook, returnBook, 
  logout, deleteStudent, fetchActivities, type Book, type Student 
} from '@/lib/store';
import {
  LayoutDashboard, BookOpen, BookUp, BookDown, Users, 
  LogOut, Plus, Trash2, Shield, X, Search, 
  TrendingUp, BookCheck, Users2, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";

type Section = 'dashboard' | 'manage-books' | 'issue-book' | 'return-book' | 'view-students';

const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'manage-books', label: 'Manage Books', icon: <BookOpen className="w-5 h-5" /> },
  { id: 'issue-book', label: 'Issue Book', icon: <BookUp className="w-5 h-5" /> },
  { id: 'return-book', label: 'Return Book', icon: <BookDown className="w-5 h-5" /> },
  { id: 'view-students', label: 'View Students', icon: <Users className="w-5 h-5" /> },
];

const AdminDashboard = () => {
  const [section, setSection] = useState<Section>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Queries
  const { data: books = [], isLoading: loadingBooks } = useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks
  });

  const { data: students = [], isLoading: loadingStudents } = useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents
  });

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['stats'],
    queryFn: getStats
  });

  const { data: activities = [], isLoading: loadingActivities } = useQuery({
    queryKey: ['activities'],
    queryFn: fetchActivities
  });

  // Mutations
  const addBookMutation = useMutation({
    mutationFn: (newBook: { id: string; title: string; author: string }) => 
      addBook(newBook.id, newBook.title, newBook.author),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Book added successfully');
      setShowAddModal(false);
    },
    onError: () => toast.error('Failed to add book')
  });

  const deleteBookMutation = useMutation({
    mutationFn: (id: string) => removeBook(id),
    onSuccess: (err) => {
      if (err) toast.error(err);
      else {
        queryClient.invalidateQueries({ queryKey: ['books'] });
        queryClient.invalidateQueries({ queryKey: ['stats'] });
        toast.success('Book deleted');
      }
    }
  });

  const issueBookMutation = useMutation({
    mutationFn: (data: { bookId: string, studentName: string }) => 
      issueBook(data.bookId, data.studentName),
    onSuccess: (err) => {
      if (err) toast.error(err);
      else {
        queryClient.invalidateQueries({ queryKey: ['books'] });
        queryClient.invalidateQueries({ queryKey: ['students'] });
        queryClient.invalidateQueries({ queryKey: ['stats'] });
        toast.success('Book issued successfully');
      }
    }
  });

  const returnBookMutation = useMutation({
    mutationFn: (id: string) => returnBook(id),
    onSuccess: (err) => {
      if (err) toast.error(err);
      else {
        queryClient.invalidateQueries({ queryKey: ['books'] });
        queryClient.invalidateQueries({ queryKey: ['students'] });
        queryClient.invalidateQueries({ queryKey: ['stats'] });
        toast.success('Book returned successfully');
      }
    }
  });

  const deleteStudentMutation = useMutation({
    mutationFn: (id: string) => deleteStudent(id),
    onSuccess: (err) => {
      if (err) toast.error(err);
      else {
        queryClient.invalidateQueries({ queryKey: ['students'] });
        toast.success('Student record removed');
      }
    }
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.book_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.student_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock data for the chart (In a real app, this would come from a 'fetchHistory' API)
  const chartData = [
    { name: 'Mon', issued: 4, returned: 2 },
    { name: 'Tue', issued: 7, returned: 5 },
    { name: 'Wed', issued: 5, returned: 8 },
    { name: 'Thu', issued: 9, returned: 4 },
    { name: 'Fri', issued: 12, returned: 7 },
    { name: 'Sat', issued: 6, returned: 10 },
    { name: 'Sun', issued: 3, returned: 4 },
  ];

  return (
    <div className="min-h-screen flex bg-background/50">
      {/* Sidebar */}
      <aside className="w-72 bg-card border-r border-border flex flex-col shrink-0 relative z-20 shadow-xl">
        <div className="p-8 flex items-center gap-3 border-b border-border/50">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg leading-tight uppercase tracking-wider">LDBMS</h2>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest leading-none mt-0.5">Administrator</p>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setSection(item.id); setSearchQuery(''); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                section === item.id 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]' 
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
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
            <p className="text-xs text-muted-foreground mt-0.5">Management & Overview Hub</p>
          </div>
          
          <div className="flex items-center gap-6">
            {(section === 'manage-books' || section === 'view-students') && (
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder={`Search ${section.split('-')[1]}...`}
                  className="w-72 pl-12 h-11 bg-secondary/50 border-white/5 rounded-2xl focus-visible:ring-primary focus-visible:bg-secondary transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Shield className="w-5 h-5 text-primary" />
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
              {section === 'dashboard' && (
                <div className="space-y-8">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="glass-card overflow-hidden group">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Collection</CardTitle>
                        <BookCheck className="h-4 w-4 text-primary" />
                      </CardHeader>
                      <CardContent>
                        {loadingStats ? <Skeleton className="h-9 w-20" /> : <div className="text-3xl font-bold font-display">{stats?.totalBooks}</div>}
                        <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
                      </CardContent>
                    </Card>
                    <Card className="glass-card overflow-hidden">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
                        <TrendingUp className="h-4 w-4 text-warning" />
                      </CardHeader>
                      <CardContent>
                        {loadingStats ? <Skeleton className="h-9 w-20" /> : <div className="text-3xl font-bold font-display text-warning">{stats?.issuedBooks}</div>}
                        <p className="text-xs text-muted-foreground mt-1">4 pending returns today</p>
                      </CardContent>
                    </Card>
                    <Card className="glass-card overflow-hidden">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Registered Students</CardTitle>
                        <Users2 className="h-4 w-4 text-success" />
                      </CardHeader>
                      <CardContent>
                        {loadingStudents ? <Skeleton className="h-9 w-20" /> : <div className="text-3xl font-bold font-display text-success">{students.length}</div>}
                        <p className="text-xs text-muted-foreground mt-1">+3 today</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Analytic Chart & Activity Feed */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 glass-card p-6">
                      <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-lg">Activity Trends</CardTitle>
                        <CardDescription>Visual overview of library traffic over the past 7 days</CardDescription>
                      </CardHeader>
                      <div className="h-[350px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="colorIssued" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorReturned" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                            <Tooltip 
                              contentStyle={{backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))'}} 
                              itemStyle={{fontSize: '12px', fontWeight: 'bold'}}
                            />
                            <Area type="monotone" dataKey="issued" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorIssued)" />
                            <Area type="monotone" dataKey="returned" stroke="hsl(var(--success))" strokeWidth={2} fillOpacity={1} fill="url(#colorReturned)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>

                    <Card className="glass-card flex flex-col">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Recent Logs</CardTitle>
                        <CardDescription>Latest system transactions</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-auto px-6">
                        <div className="space-y-6">
                          {loadingActivities ? (
                            [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full rounded-xl" />)
                          ) : activities.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground text-xs uppercase tracking-widest">No recent logs</div>
                          ) : activities.map((activity: any) => (
                            <div key={activity.id} className="flex items-start gap-4 group">
                              <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${activity.return_date ? 'bg-success' : 'bg-primary'} shadow-[0_0_8px_rgba(var(--primary),0.5)]`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold truncate">
                                  {activity.books?.title || 'Unknown Book'}
                                </p>
                                <p className="text-[10px] text-muted-foreground uppercase mt-0.5">
                                  {activity.return_date ? 'Returned by' : 'Issued to'} <span className="text-foreground font-semibold">{activity.student_name}</span>
                                </p>
                                <p className="text-[9px] text-muted-foreground mt-1 tabular-nums">
                                  {new Date(activity.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {section === 'manage-books' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-card p-6 rounded-3xl border border-border/50">
                    <div>
                      <h2 className="text-xl font-bold">Catalogue Management</h2>
                      <p className="text-sm text-muted-foreground">Total of {filteredBooks.length} books found</p>
                    </div>
                    <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                      <DialogTrigger asChild>
                        <Button className="rounded-2xl gap-2 h-12 px-6 shadow-lg shadow-primary/20">
                          <Plus className="w-5 h-5" /> Add New Book
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass-card border-white/5 rounded-3xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-display font-bold">New Catalog Entry</DialogTitle>
                          <DialogDescription>Add a new resource to the library database.</DialogDescription>
                        </DialogHeader>
                        <form className="space-y-4 pt-4" onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          addBookMutation.mutate({
                            id: formData.get('id') as string,
                            title: formData.get('title') as string,
                            author: formData.get('author') as string
                          });
                        }}>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold ml-1">Asset ID</label>
                            <Input name="id" placeholder="BK-000" className="rounded-2xl h-12 bg-secondary/50" required />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold ml-1">Book Title</label>
                            <Input name="title" placeholder="e.g. Clean Code" className="rounded-2xl h-12 bg-secondary/50" required />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold ml-1">Author Name</label>
                            <Input name="author" placeholder="e.g. Robert C. Martin" className="rounded-2xl h-12 bg-secondary/50" required />
                          </div>
                          <Button 
                            type="submit" 
                            className="w-full h-14 rounded-2xl font-bold text-base mt-4"
                            disabled={addBookMutation.isPending}
                          >
                            {addBookMutation.isPending ? "Adding Entry..." : "Create Asset"}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <Card className="glass-card overflow-hidden">
                    <Table>
                      <TableHeader className="bg-secondary/30">
                        <TableRow>
                          <TableHead className="w-[120px] font-bold">Asset ID</TableHead>
                          <TableHead className="font-bold">Book Title</TableHead>
                          <TableHead className="font-bold">Author</TableHead>
                          <TableHead className="font-bold text-center">Status</TableHead>
                          <TableHead className="text-right font-bold pr-10">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loadingBooks ? (
                          [1, 2, 3, 4, 5].map(i => (
                            <TableRow key={i}>
                              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                              <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                              <TableCell><Skeleton className="h-6 w-20 mx-auto rounded-full" /></TableCell>
                              <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-lg" /></TableCell>
                            </TableRow>
                          ))
                        ) : filteredBooks.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="h-64 text-center">
                              <div className="flex flex-col items-center gap-3 text-muted-foreground uppercase tracking-widest text-xs">
                                <Search className="w-10 h-10 opacity-20 mb-2" />
                                No assets found matching your search.
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : filteredBooks.map((book) => (
                          <TableRow key={book.book_id} className="hover:bg-secondary/20 transition-colors group">
                            <TableCell className="font-mono text-xs font-semibold text-primary">{book.book_id}</TableCell>
                            <TableCell className="font-bold py-5">{book.title}</TableCell>
                            <TableCell className="text-muted-foreground">{book.author}</TableCell>
                            <TableCell className="text-center">
                              <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                book.status === 'Available' 
                                  ? 'bg-success/10 text-success border border-success/20' 
                                  : 'bg-warning/10 text-warning border border-warning/20'
                              }`}>
                                {book.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteBookMutation.mutate(book.book_id)}
                                className="rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                              >
                                <Trash2 className="w-4.5 h-4.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                </div>
              )}

              {(section === 'issue-book' || section === 'return-book') && (
                <div className="max-w-2xl mx-auto space-y-8">
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-display font-bold">Transaction Management</h2>
                    <p className="text-muted-foreground leading-relaxed">Ensure all data is accurate before processing the {section.split('-')[0]}. Mistakes can affect student records.</p>
                  </div>
                  
                  <Card className="glass-card p-10 border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] transition-all group-hover:scale-110" />
                    
                    <form className="space-y-6 relative z-10" onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      if (section === 'issue-book') {
                        issueBookMutation.mutate({
                          bookId: formData.get('bookId') as string,
                          studentName: formData.get('studentName') as string
                        });
                        e.currentTarget.reset();
                      } else {
                        returnBookMutation.mutate(formData.get('returnId') as string);
                        e.currentTarget.reset();
                      }
                    }}>
                      {section === 'issue-book' ? (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                              <BookCheck className="w-4 h-4 text-primary" /> Book Asset ID
                            </label>
                            <Input name="bookId" placeholder="e.g. BK-111" className="h-14 rounded-2xl bg-secondary/50 border-white/5 focus:bg-background transition-all" required />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                              <Users className="w-4 h-4 text-primary" /> Recipient Name
                            </label>
                            <Select name="studentName" required>
                              <SelectTrigger className="h-14 rounded-2xl bg-secondary/50 border-white/5 focus:bg-background transition-all">
                                <SelectValue placeholder="Identify student..." />
                              </SelectTrigger>
                              <SelectContent className="glass-card">
                                {students.map(s => (
                                  <SelectItem key={s.student_id} value={s.name} className="hover:bg-primary/10">
                                    {s.name} ({s.student_id})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="pt-4">
                            <Button 
                              type="submit" 
                              className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                              disabled={issueBookMutation.isPending}
                            >
                              {issueBookMutation.isPending ? "Confirming..." : "Process Issuance"}
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-primary" /> Returning Book ID
                            </label>
                            <Input name="returnId" placeholder="BK-XXXX" className="h-14 rounded-2xl bg-secondary/50 border-white/5 focus:bg-background transition-all" required />
                          </div>
                          <div className="pt-4">
                            <Button 
                              type="submit" 
                              variant="secondary"
                              className="w-full h-16 rounded-2xl text-lg font-bold hover:scale-[1.02] active:scale-[0.98] transition-all bg-success text-success-foreground hover:bg-success/90"
                              disabled={returnBookMutation.isPending}
                            >
                              {returnBookMutation.isPending ? "Receiving..." : "Confirm Return"}
                            </Button>
                          </div>
                        </>
                      )}
                    </form>
                  </Card>
                </div>
              )}

              {section === 'view-students' && (
                <div className="space-y-6">
                  <div className="bg-card p-6 rounded-3xl border border-border/50">
                    <h2 className="text-xl font-bold">Student Directory</h2>
                    <p className="text-sm text-muted-foreground">Monitoring active library memberships and records</p>
                  </div>

                  <Card className="glass-card overflow-hidden">
                    <Table>
                      <TableHeader className="bg-secondary/30">
                        <TableRow>
                          <TableHead className="w-[120px] font-bold">Student ID</TableHead>
                          <TableHead className="font-bold">Full Name</TableHead>
                          <TableHead className="font-bold">Department</TableHead>
                          <TableHead className="text-center font-bold">Books Held</TableHead>
                          <TableHead className="text-right font-bold pr-10">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loadingStudents ? (
                          [1, 2, 3].map(i => (
                            <TableRow key={i}>
                              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                              <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                              <TableCell><Skeleton className="h-6 w-10 mx-auto rounded-full" /></TableCell>
                              <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-lg" /></TableCell>
                            </TableRow>
                          ))
                        ) : filteredStudents.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="h-64 text-center text-muted-foreground uppercase tracking-widest text-xs">
                              No student records matched.
                            </TableCell>
                          </TableRow>
                        ) : filteredStudents.map((stu) => (
                          <TableRow key={stu.student_id} className="hover:bg-secondary/20 transition-colors group">
                            <TableCell className="font-mono text-xs font-semibold text-primary">{stu.student_id}</TableCell>
                            <TableCell className="font-bold py-5">{stu.name}</TableCell>
                            <TableCell className="text-muted-foreground">{(stu as any).department || 'General'}</TableCell>
                            <TableCell className="text-center">
                              <span className="font-display font-bold text-lg">{stu.borrowed}</span>
                              <span className="text-[10px] text-muted-foreground ml-1 uppercase">/ 3</span>
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteStudentMutation.mutate(stu.student_id)}
                                className="rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                              >
                                <Trash2 className="w-4.5 h-4.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
