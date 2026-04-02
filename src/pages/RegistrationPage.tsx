import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { registerStudent } from '@/lib/store';
import { BookOpen, UserPlus, ArrowLeft, Loader2, Sparkles, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from '@/components/ui/form';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { toast } from 'sonner';

const registrationSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  studentId: z.string().min(3, 'Student ID is required'),
  department: z.string().min(1, 'Please select a department'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationValues = z.infer<typeof registrationSchema>;

const RegistrationPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: '',
      email: '',
      studentId: '',
      department: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: RegistrationValues) => {
    setLoading(true);
    try {
      const result = await registerStudent(
        values.username, 
        values.password, 
        values.email, 
        values.studentId, 
        values.username, 
        values.department
      );
      
      if (result.success) {
        toast.success('Account created! Sign in to continue.');
        navigate('/login');
      } else {
        toast.error(result.error || 'Registration failed. Please check your inputs.');
      }
    } catch (err) {
      toast.error('A connection error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background selection:bg-primary/20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full rotate-45" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-secondary/5 blur-[120px] rounded-full -rotate-45" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="glass-card p-10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-24 h-24 bg-primary/5 rounded-br-[80px]" />
          
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="p-4 bg-primary/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-500">
              <GraduationCap className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Join the Library</h1>
            <p className="text-sm text-muted-foreground mt-2">Create your student portal for digital learning</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Username</FormLabel>
                      <FormControl>
                        <Input placeholder="lex_luther" className="h-12 rounded-xl bg-secondary/50 border-white/5" {...field} />
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Student ID</FormLabel>
                      <FormControl>
                        <Input placeholder="STU-001" className="h-12 rounded-xl bg-secondary/50 border-white/5" {...field} />
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-bold" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="lex@university.edu" className="h-12 rounded-xl bg-secondary/50 border-white/5" {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px] uppercase font-bold" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl bg-secondary/50 border-white/5">
                          <SelectValue placeholder="Select faculty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="glass-card">
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px] uppercase font-bold" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" className="h-12 rounded-xl bg-secondary/50 border-white/5" {...field} />
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Confirm</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" className="h-12 rounded-xl bg-secondary/50 border-white/5" {...field} />
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-bold" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-6 space-y-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                  {loading ? 'Creating Account...' : 'Register as Student'}
                </Button>

                <Button 
                  asChild 
                  variant="ghost" 
                  className="w-full h-12 rounded-xl text-sm font-medium hover:bg-secondary transition-all flex items-center justify-center gap-2"
                >
                  <Link to="/login">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sign In
                  </Link>
                </Button>
              </div>
            </form>
          </Form>
          
          <div className="mt-8 flex items-center justify-center gap-2 text-primary/60">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-widest font-black leading-none">Instant Activation</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegistrationPage;
