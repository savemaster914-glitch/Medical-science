import React, { useState } from 'react';
import { MOCK_EDITORIAL_BOARD } from '../data/mockJournalData';
import { BoardRole, EditorialBoardMember } from '../types';
import { Mail, ExternalLink, Globe, Award, Search, UserCheck } from 'lucide-react';

export const EditorialBoardSection: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const roles = ['All', 'Editor-in-Chief', 'Managing Editor', 'Associate Editor', 'Section Editor', 'International Advisory Board'];

  const filteredBoard = MOCK_EDITORIAL_BOARD.filter(member => {
    const matchesRole = selectedRole === 'All' || member.role === selectedRole;
    const matchesSearch = searchQuery === '' ||
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.researchInterests.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  return (
    <section className="py-8 bg-white border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#081F45] bg-[#C79A3D]/20 border border-[#C79A3D]/40 px-2.5 py-0.5 rounded-xs">
            Scientific Leadership
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold font-playfair text-[#081F45] mt-1.5">
            Editorial Board & International Advisors
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Distinguished pathologists, clinical microbiologists, hematologists, and biomedical scientists guiding IMJB.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
            {roles.map(role => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-2.5 py-1 rounded-xs text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  selectedRole === role
                    ? 'bg-[#081F45] text-[#C79A3D]'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search member, institution, field..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-sm text-xs focus:ring-1 focus:ring-[#081F45] focus:outline-none"
            />
          </div>
        </div>

        {/* Board Members Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredBoard.map((member) => (
            <div
              key={member.id}
              className="bg-[#F6F7F9] hover:bg-white border-l-4 border-[#C79A3D] border-t border-r border-b border-slate-200 p-3.5 rounded-sm transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between text-left group"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-14 h-14 rounded-xs object-cover border-2 border-[#C79A3D] flex-shrink-0 shadow-2xs"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-[9px] font-extrabold uppercase bg-[#081F45] text-[#C79A3D] px-1.5 py-0.5 rounded-xs tracking-wider">
                      {member.role}
                    </span>
                    <h3 className="text-sm font-bold font-playfair text-[#081F45] mt-1 leading-tight">
                      {member.name}
                    </h3>
                    <p className="text-[11px] text-slate-600 font-medium">
                      {member.title}
                    </p>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-600 font-sans pt-1.5 border-t border-slate-200">
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium text-[11px]">
                    <Globe className="w-3 h-3 text-[#184A87] flex-shrink-0" />
                    <span>{member.institution} • <strong>{member.country}</strong></span>
                  </div>

                  {member.orcid && (
                    <div className="flex items-center gap-1.5 text-emerald-700 font-mono text-[10px]">
                      <UserCheck className="w-3 h-3 flex-shrink-0" />
                      <span>ORCID: {member.orcid}</span>
                    </div>
                  )}

                  {member.biography && (
                    <p className="text-[11px] text-slate-600 italic line-clamp-2 pt-0.5">
                      "{member.biography}"
                    </p>
                  )}
                </div>

                {/* Research Interests Tags */}
                <div className="pt-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Research Expertise</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {member.researchInterests.map((interest, i) => (
                      <span key={i} className="text-[9px] bg-white border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded-xs">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2.5 mt-2.5 border-t border-slate-200 flex items-center justify-between">
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#184A87] hover:text-[#081F45]"
                >
                  <Mail className="w-3 h-3 text-[#C79A3D]" />
                  <span>{member.email}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
