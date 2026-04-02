import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { login } from '@/lib/store';
import { BookOpen, LogIn, UserPlus, ShieldCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from '@/components/ui/form';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().min(1, 'Email or Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginValues) => {
    setLoading(true);
    try {
      const user = await login(values.email, values.password);
      if (user) {
        toast.success(`Welcome back, ${user.username}!`);
        navigate(user.role === 'admin' ? '/admin' : '/student');
      } else {
        toast.error('Invalid credentials. Please verify your details.');
      }
    } catch (err) {
      toast.error('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background selection:bg-primary/20">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] bg-primary/10 blur-[100px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-secondary/10 blur-[100px] rounded-full animate-pulse delay-700" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] transition-all group-hover:scale-110" />
          
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="p-4 bg-primary/10 rounded-2xl mb-4 group-hover:rotate-12 transition-transform duration-500">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Access Hub</h1>
            <p className="text-sm text-muted-foreground mt-2">Sign in to manage your library resources</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email or Username</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="lex@university.edu" 
                        className="h-14 rounded-2xl bg-secondary/50 border-white/5 focus:bg-background transition-all" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] uppercase font-bold" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Secure Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="h-14 rounded-2xl bg-secondary/50 border-white/5 focus:bg-background transition-all" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] uppercase font-bold" />
                  </FormItem>
                )}
              />

              <div className="pt-4 space-y-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                  {loading ? 'Authenticating...' : 'Sign In'}
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/50"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                    <span className="bg-card px-4 text-muted-foreground">New Scholar?</span>
                  </div>
                </div>

                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full h-14 rounded-2xl text-sm font-bold border-white/5 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <Link to="/register">
                    <UserPlus className="w-4 h-4" />
                    Create Student Account
                  </Link>
                </Button>
              </div>
            </form>
          </Form>
          
          <div className="mt-10 flex items-center justify-center gap-2 text-muted-foreground">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-widest font-medium">Secured by Enterprise Auth</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
