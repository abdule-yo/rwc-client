"use client";

import { motion } from "framer-motion";
import { GraduationCap, Mail, Sparkles, Users } from "lucide-react";

export const Contributors = ({ onBack }: { onBack: () => void }) => {
  const team = [
    
    {
      name: "Anjum Anwar Shaik",
      email: "sharjillrenegade7@gmail.com",
      matrix: "24228605",
      isMetric: true
    },
    {
      name: "AAQUIB TAYYABI",
      email: "aaquib.tayyabi@gmail.com",
      matrix: "24231463"
    },
    {
      name: "Amosha Wondosen",
      email: "wonamu05@gmai.com",
      matrix: "24216970"
    },
    {
      name: "Abdule Yousuf",
      email: "abdulebaroo@gmail.com",
      matrix:'25065370',
      isMetric: true
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-foreground p-8 flex flex-col items-center relative overflow-hidden">
       {/* Background Gradients */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px]" />
       </div>

      {/* Header */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-16 z-10">
        <button
          onClick={onBack}
          className="text-foreground/60 hover:text-accent transition-colors font-orbitron text-sm uppercase tracking-wider"
        >
          ← Return to Menu
        </button>
        <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" />
            <h1 className="font-orbitron text-xl text-accent tracking-widest">PROJECT CONTRIBUTORS</h1>
        </div>
      </div>

      {/* Team Grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10">
        {team.map((member, idx) => (
            <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-accent/40 hover:bg-slate-900/60 transition-all duration-300 backdrop-blur-sm"
            >
                <div className="absolute top-4 right-4 text-slate-700 font-orbitron text-xs opacity-50">
                    #0{idx + 1}
                </div>
                
                <div className="w-12 h-12 rounded-lg bg-slate-800 group-hover:bg-accent/10 flex items-center justify-center mb-6 transition-colors">
                    <span className="font-orbitron text-xl text-foreground/40 group-hover:text-accent transition-colors">
                        {member.name.charAt(0)}
                    </span>
                </div>

                <h3 className="font-orbitron text-lg text-white mb-6 tracking-wide truncate">{member.name}</h3>

                <div className="space-y-3">
                    <div className="flex items-start gap-3 text-sm text-foreground/60 group-hover:text-foreground/80 transition-colors">
                        <Mail className="w-4 h-4 mt-0.5" />
                        <span className="break-all">{member.email}</span>
                    </div>
                    
                    {member.matrix && (
                        <div className="flex items-center gap-3 text-sm text-foreground/60 group-hover:text-foreground/80 transition-colors">
                            <GraduationCap className="w-4 h-4" />
                            <span>{member.matrix}</span>
                        </div>
                    )}
                </div>
                
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/0 to-transparent group-hover:via-accent/50 transition-all duration-500" />
            </motion.div>
        ))}
      </div>
      
      {/* Footer Model Info */}
      <div className="mt-20 text-center space-y-2 z-10">
        <p className="text-foreground/40 font-mono text-xs uppercase tracking-widest">Powered By</p>
        <div className="flex items-center justify-center gap-2 text-accent/60 font-orbitron text-sm">
            <Sparkles className="w-4 h-4" />
            <span>GOOGLE VIT-BASE-PATCH16-224</span>
        </div>
      </div>
    </div>
  );
};
