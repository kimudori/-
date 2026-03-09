import React, { useState, useEffect } from 'react';
import { 
  User, 
  Ship, 
  Settings, 
  Briefcase, 
  Wrench, 
  Lightbulb, 
  Award, 
  Mail, 
  Download, 
  ChevronRight, 
  Menu, 
  X,
  Lock,
  Edit2,
  Save,
  LogOut,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface Experience {
  company: string;
  role: string;
  period: string;
  tasks: string[];
  tech: string[];
  learning: string;
}

interface SkillSet {
  marine: string[];
  engineering: string[];
  tools: string[];
}

interface Case {
  title: string;
  situation: string;
  action: string;
  result: string;
}

interface Activity {
  name: string;
  focus: string;
}

interface Education {
  school: string;
  degree: string;
  status: string;
}

interface LearningLog {
  title: string;
  content: string;
}

interface PortfolioContent {
  hero_name: string;
  hero_title: string;
  hero_subtitle: string;
  hero_intro: string;
  about_background: string;
  about_why: string;
  about_strengths: string;
  experience_json: string;
  skills_json: string;
  cases_json: string;
  activities_json: string;
  education_json: string;
  certs_json: string;
  contact_email: string;
  learning_log_json: string;
  profile_image: string;
  resume_file: string;
  resume_filename: string;
}

// --- Components ---

const Navbar = ({ onAdminClick }: { onAdminClick: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="text-xl font-bold tracking-tighter text-zinc-900">
          KIM <span className="text-zinc-400 font-light">YEO-EUN</span>
        </div>
        <div className="hidden md:flex items-center space-gap-8 text-sm font-medium text-zinc-600">
          <a href="#about" className="hover:text-zinc-900 transition-colors">About</a>
          <a href="#experience" className="hover:text-zinc-900 transition-colors ml-8">Experience</a>
          <a href="#skills" className="hover:text-zinc-900 transition-colors ml-8">Skills</a>
          <a href="#cases" className="hover:text-zinc-900 transition-colors ml-8">Cases</a>
          <button onClick={onAdminClick} className="ml-8 p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-12">
    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">{title}</h2>
    {subtitle && <p className="text-zinc-500 font-medium uppercase tracking-widest text-xs">{subtitle}</p>}
    <div className="h-1 w-12 bg-zinc-900 mt-4"></div>
  </div>
);

const AdminModal = ({ isOpen, onClose, content, onUpdate, onLoginSuccess, onLogout, onFileUpload }: { isOpen: boolean; onClose: () => void; content: PortfolioContent; onUpdate: (key: keyof PortfolioContent, value: string) => void; onLoginSuccess: () => void; onLogout: () => void; onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, key: 'profile_image' | 'resume_file') => void }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = async () => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (data.success) {
      setIsAuthenticated(true);
      localStorage.setItem('admin-token', 'dummy-token-0928');
      onLoginSuccess(); // Call a callback instead of reloading
    } else {
      alert('Invalid password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    setIsAuthenticated(false);
    onLogout();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
          <h3 className="text-xl font-bold flex items-center gap-2">
            {isAuthenticated ? <Settings className="text-zinc-400" /> : <Lock className="text-zinc-400" />}
            Admin Panel
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full"><X size={20} /></button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {!isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-zinc-500 text-sm">Please enter the administrator password to edit content.</p>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none"
              />
              <button 
                onClick={handleLogin}
                className="w-full bg-zinc-900 text-white p-3 rounded-xl font-bold hover:bg-zinc-800 transition-colors"
              >
                Login
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <button 
                onClick={handleLogout}
                className="w-full bg-red-50 text-red-600 p-3 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2 mb-4"
              >
                <LogOut size={18} />
                Logout
              </button>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <label className="cursor-pointer bg-zinc-100 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-zinc-200 transition-colors">
                  <User size={24} className="text-zinc-400" />
                  <span className="text-xs font-bold uppercase">Profile Image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => onFileUpload(e, 'profile_image')} />
                </label>
                <label className="cursor-pointer bg-zinc-100 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-zinc-200 transition-colors">
                  <Briefcase size={24} className="text-zinc-400" />
                  <span className="text-xs font-bold uppercase">Resume File</span>
                  <input type="file" className="hidden" onChange={(e) => onFileUpload(e, 'resume_file')} />
                </label>
              </div>

              {Object.entries(content).map(([key, value]) => {
                if (key === 'profile_image' || key === 'resume_file') return null;
                return (
                  <div key={key} className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase">{key.replace(/_/g, ' ')}</label>
                    <textarea 
                      value={value || ''}
                      onChange={(e) => onUpdate(key as keyof PortfolioContent, e.target.value)}
                      className="w-full p-3 border border-zinc-200 rounded-xl text-sm min-h-[100px] focus:ring-2 focus:ring-zinc-900 outline-none"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [content, setContent] = useState<PortfolioContent>({
    hero_name: "Kim Yeo-eun",
    hero_title: "Field Service Engineer Candidate",
    hero_subtitle: "Ship Operation Experience & Equipment Troubleshooting",
    hero_intro: "선박 운항 경험을 바탕으로 장비의 운용 원리와 현장 문제 해결 능력을 갖춘 엔지니어 김여은입니다.",
    about_background: "한국해양대학교 해사글로벌학부 / 선박 승선 경험 (3rd Officer)",
    about_why: "장비를 직접 운용하며 설치 상태와 작동 원리에 관심이 생겼으며, 단순 사용자가 아닌 장비 이해와 문제 해결 역할로 확장하고자 합니다.",
    about_strengths: "현장 환경 적응력, 장비 운용 경험, 기술 문서 이해",
    experience_json: "[]",
    skills_json: "{}",
    cases_json: "[]",
    activities_json: "[]",
    education_json: "[]",
    certs_json: "[]",
    contact_email: "labiancaneve23@gmail.com",
    learning_log_json: "[]",
    profile_image: "",
    resume_file: "",
    resume_filename: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await fetch('/api/content');
        if (!res.ok) throw new Error('Failed to fetch content');
        const data = await res.json();
        setContent(prev => ({ ...prev, ...data }));
      } catch (err) {
        console.error('Error loading content:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadContent();
    
    // Safety timeout: force loading to false after 5 seconds
    const timer = setTimeout(() => setIsLoading(false), 5000);
    
    const token = localStorage.getItem('admin-token');
    if (token === 'dummy-token-0928') {
      setIsAdmin(true);
    }

    return () => clearTimeout(timer);
  }, []);

  const handleUpdate = async (key: keyof PortfolioContent, value: string) => {
    if (!content) return;
    const newContent = { ...content, [key]: value };
    setContent(newContent);
    
    await fetch('/api/content/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'dummy-token-0928', key, value })
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: 'profile_image' | 'resume_file') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      if (key === 'resume_file') {
        await handleUpdate('resume_filename', file.name);
      }
      await handleUpdate(key, base64String);
    };
    reader.readAsDataURL(file);
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-mono text-zinc-400">LOADING...</div>;

  const safeParse = (jsonString: string | undefined | null, fallback: any) => {
    if (!jsonString) return fallback;
    try {
      // Handle potential trailing commas by replacing ,] with ] and ,} with }
      const cleaned = jsonString.replace(/,\s*\]/g, ']').replace(/,\s*\}/g, '}');
      return JSON.parse(cleaned);
    } catch (e) {
      console.error("JSON Parse Error:", e, jsonString);
      return fallback;
    }
  };

  const experiences: Experience[] = safeParse(content.experience_json, []);
  const skills: SkillSet = safeParse(content.skills_json, { marine: [], engineering: [], tools: [] });
  const cases: Case[] = safeParse(content.cases_json, []);
  const activities: Activity[] = safeParse(content.activities_json, []);
  const education: Education[] = safeParse(content.education_json, []);
  const certs: string[] = safeParse(content.certs_json, []);
  const learningLogs: LearningLog[] = safeParse(content.learning_log_json, []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-zinc-900 selection:bg-zinc-900 selection:text-white font-sans">
      <Navbar onAdminClick={() => setIsAdminOpen(true)} />
      <AdminModal 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        content={content}
        onUpdate={handleUpdate}
        onLoginSuccess={() => setIsAdmin(true)}
        onLogout={() => setIsAdmin(false)}
        onFileUpload={handleFileUpload}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-zinc-50 -z-10 hidden lg:block"></div>
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 rounded-full text-xs font-bold text-zinc-600 mb-6">
              <Ship size={14} />
              <span>{content.hero_title}</span>
            </div>
            <h1 className="text-6xl lg:text-8xl font-bold tracking-tighter leading-[0.9] mb-8">
              {content.hero_name.split(' ')[0]}<br />
              <span className="text-zinc-300">{content.hero_name.split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-xl text-zinc-500 max-w-md mb-10 leading-relaxed">
              {content.hero_intro}
            </p>
            <div className="flex flex-wrap gap-3 mb-12">
              {['Marine Equipment', 'Troubleshooting', 'Engine Systems', 'Commissioning'].map((skill) => (
                <span key={skill} className="px-4 py-2 border border-zinc-200 rounded-full text-sm font-medium text-zinc-600">
                  {skill}
                </span>
              ))}
            </div>
            <a href="#contact" className="inline-flex items-center gap-3 bg-zinc-900 text-white px-8 py-4 rounded-full font-bold hover:bg-zinc-800 transition-all group">
              Get in Touch
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative group flex justify-center items-center"
          >
            <div className="absolute inset-0 border-2 border-zinc-200 translate-x-4 translate-y-4 -z-10"></div>
            <img 
              src={content.profile_image || "https://picsum.photos/seed/marine/800/1000"} 
              alt="Profile" 
              className="max-w-full h-auto shadow-2xl transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            {isAdmin && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label className="cursor-pointer bg-white text-zinc-900 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                  <Edit2 size={16} />
                  Change Image
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'profile_image')} />
                </label>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle title="About Me" subtitle="The Engineer's Vision" />
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Background</h4>
              <p className="text-zinc-600 leading-relaxed">{content.about_background}</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Why Service Engineer</h4>
              <p className="text-zinc-600 leading-relaxed">{content.about_why}</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Strengths</h4>
              <p className="text-zinc-600 leading-relaxed">{content.about_strengths}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-32 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle title="Professional Experience" subtitle="Field History" />
          <div className="space-y-24">
            {experiences.map((exp, idx) => (
              <div key={idx} className="grid lg:grid-cols-12 gap-12">
                <div className="lg:col-span-4">
                  <span className="text-4xl font-bold text-zinc-200 mb-4 block">0{idx + 1}</span>
                  <h3 className="text-2xl font-bold mb-1">{exp.company}</h3>
                  <p className="text-zinc-500 font-medium mb-4">{exp.role}</p>
                  <span className="inline-block px-3 py-1 bg-zinc-200 rounded text-xs font-bold text-zinc-600">
                    {exp.period}
                  </span>
                </div>
                <div className="lg:col-span-8 grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-400 uppercase mb-3">Key Responsibilities</h4>
                      <ul className="space-y-2">
                        {exp.tasks.map((task, i) => (
                          <li key={i} className="text-zinc-600 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 mt-2 shrink-0"></div>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-400 uppercase mb-3">Technical Exposure</h4>
                      <div className="flex flex-wrap gap-2">
                        {exp.tech.map((t, i) => (
                          <span key={i} className="text-xs font-medium px-2 py-1 bg-white border border-zinc-200 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 border border-zinc-100 rounded-2xl">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase mb-3">Key Learning</h4>
                    <p className="text-zinc-700 italic font-medium leading-relaxed">
                      "{exp.learning}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle title="Technical Skills" subtitle="Core Competencies" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-zinc-50 rounded-3xl border border-zinc-100">
              <Ship className="text-zinc-900 mb-6" size={32} />
              <h3 className="text-xl font-bold mb-6">Marine Systems</h3>
              <div className="flex flex-wrap gap-2">
                {skills.marine.map(s => (
                  <span key={s} className="px-3 py-1.5 bg-white rounded-lg text-sm font-medium text-zinc-600 border border-zinc-200">{s}</span>
                ))}
              </div>
            </div>
            <div className="p-8 bg-zinc-50 rounded-3xl border border-zinc-100">
              <Settings className="text-zinc-900 mb-6" size={32} />
              <h3 className="text-xl font-bold mb-6">Tools & Docs</h3>
              <div className="flex flex-wrap gap-2">
                {skills.tools.map(s => (
                  <span key={s} className="px-3 py-1.5 bg-white rounded-lg text-sm font-medium text-zinc-600 border border-zinc-200">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Solving Section */}
      <section id="cases" className="py-32 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle title="Problem Solving" subtitle="Troubleshooting Cases" />
          <div className="grid gap-8">
            {cases.map((c, idx) => (
              <div key={idx} className="bg-white p-10 rounded-3xl border border-zinc-100 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-white font-bold">
                    {idx + 1}
                  </div>
                  <h3 className="text-2xl font-bold">{c.title}</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-12">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-400 uppercase mb-3">Situation</h4>
                    <p className="text-zinc-600 leading-relaxed">{c.situation}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-400 uppercase mb-3">Action</h4>
                    <p className="text-zinc-600 leading-relaxed">{c.action}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-400 uppercase mb-3">Result</h4>
                    <p className="text-zinc-900 font-bold leading-relaxed">{c.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Log Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle title="Equipment Learning Log" subtitle="Continuous Growth" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningLogs.map((log, idx) => (
              <div key={idx} className="group p-6 border border-zinc-100 rounded-2xl hover:border-zinc-900 transition-colors">
                <BookOpen className="text-zinc-300 group-hover:text-zinc-900 mb-4 transition-colors" size={24} />
                <h4 className="font-bold mb-2">{log.title}</h4>
                <p className="text-sm text-zinc-500">{log.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education & Activities */}
      <section className="py-32 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div>
            <SectionTitle title="Education & Certs" />
            <div className="space-y-8">
              {education.map((edu, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-px bg-zinc-200 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-zinc-900"></div>
                  </div>
                  <div>
                    <h4 className="font-bold">{edu.school}</h4>
                    <p className="text-sm text-zinc-500">
                      {edu.degree}{edu.degree && edu.status ? " • " : ""}{edu.status}
                    </p>
                  </div>
                </div>
              ))}
              <div className="flex flex-wrap gap-2 pt-4">
                {certs.map(cert => (
                  <span key={cert} className="px-3 py-1 bg-white border border-zinc-200 rounded-full text-xs font-bold text-zinc-600">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div>
            <SectionTitle title="Activities" />
            <div className="space-y-6">
              {activities.map((act, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-zinc-100 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold">{act.name}</h4>
                    <p className="text-sm text-zinc-500">Focus: {act.focus}</p>
                  </div>
                  <ChevronRight className="text-zinc-300" size={20} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-12">Let's build the future of<br />marine engineering together.</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <a href={`mailto:${content.contact_email}`} className="flex items-center gap-3 text-2xl font-bold hover:text-zinc-400 transition-colors">
              <Mail size={24} />
              {content.contact_email}
            </a>
            <div className="flex flex-col gap-2">
              <a 
                href="/api/resume/download" 
                className="flex items-center gap-3 bg-white text-zinc-900 px-8 py-4 rounded-full font-bold hover:bg-zinc-200 transition-all"
              >
                <Download size={20} />
                Download Resume
              </a>
              {isAdmin && (
                <label className="cursor-pointer text-xs text-zinc-500 hover:text-white transition-colors flex items-center justify-center gap-1">
                  <Edit2 size={12} />
                  Upload New Resume
                  <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'resume_file')} />
                </label>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-zinc-100 text-center text-sm text-zinc-400">
        <p>© {new Date().getFullYear()} Kim Yeo-eun. All rights reserved.</p>
      </footer>
    </div>
  );
}
