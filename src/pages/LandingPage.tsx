import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Book, Shield, GraduationCap, ArrowRight, Library, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/store';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    getCurrentUser().then(user => setIsLoggedIn(!!user));
  }, []);

  const features = [
    {
      icon: <Book className="w-6 h-6 text-primary" />,
      title: "Extensive Collection",
      description: "Access thousands of books, journals, and digital resources across all departments."
    },
    {
      icon: <Shield className="w-6 h-6 text-success" />,
      title: "Smart Management",
      description: "Seamlessly track issues, returns, and availability with our automated system."
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-warning" />,
      title: "Student-Centric",
      description: "Personalized dashboards to track your borrowing history and due dates."
    }
  ];

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Library className="w-6 h-6 text-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">LDBMS</span>
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Button onClick={() => navigate('/admin')} variant="default" className="rounded-full px-6">
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button onClick={() => navigate('/login')} variant="ghost" className="rounded-full px-6">
                  Log in
                </Button>
                <Button onClick={() => navigate('/register')} className="rounded-full px-6 shadow-lg shadow-primary/20 transition-transform hover:scale-105 active:scale-95">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-semibold mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Library Management</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8 leading-[1.1]">
                Empower Your Learning with <span className="text-primary italic">Modern Intelligence</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                A production-grade system designed for high-performance library operations, intuitive student experiences, and real-time management.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button onClick={() => navigate('/register')} size="lg" className="h-14 px-8 rounded-2xl text-base font-semibold group translate-y-0 hover:-translate-y-1 transition-all duration-300">
                  Join the Library
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <div className="flex items-center gap-4 px-6 h-14 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-bold">
                        U{i}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Trusted by 500+ Students</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating elements for visual interest */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-[10%] hidden lg:block"
        >
          <div className="glass-card p-6 rotate-[-6deg] backdrop-blur-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-sm font-bold">Book Issued</p>
              </div>
            </div>
            <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-success" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[60%] right-[10%] hidden lg:block"
        >
          <div className="glass-card p-6 rotate-[6deg] backdrop-blur-md">
            <div className="flex items-center gap-4 mb-3">
              <Library className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="text-sm font-bold">Total Assets</p>
                <p className="text-2xl font-display font-bold text-primary">12,450+</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white/[0.02]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 hover:-translate-y-2"
              >
                <div className="mb-6 p-4 rounded-2xl bg-white/[0.03] w-fit group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Library className="w-4 h-4" />
            <span className="font-bold text-foreground">LDBMS Control</span>
          </div>
          <p>© 2026 Library Digital Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
