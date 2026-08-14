import React, { useState, useEffect } from 'react';
import { 
  Programme, 
  Registration, 
  GalleryItem,
  SiteSettings 
} from './types';
import { 
  getProgrammes, 
  getRegistrations, 
  getGallery, 
  addProgramme, 
  updateProgramme,
  addGalleryItem,
  getSiteSettings,
  saveSiteSettings
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeHero } from './components/HomeHero';
import { UpcomingProgrammesSection } from './components/UpcomingProgrammesSection';
import { ProgrammeDetailModal } from './components/ProgrammeDetailModal';
import { RegistrationForm } from './components/RegistrationForm';
import { ConfirmationLetter } from './components/ConfirmationLetter';
import { GallerySection } from './components/GallerySection';
import { AdminDashboard } from './components/AdminDashboard';
import { ProgrammeFormModal } from './components/ProgrammeFormModal';
import { GalleryUploadModal } from './components/GalleryUploadModal';
import { RegistrationLookupModal } from './components/RegistrationLookupModal';
import { DEFAULT_SITE_SETTINGS } from './data/seedData';

export function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'programmes' | 'register' | 'gallery' | 'admin'>('home');
  
  // Data States
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  // Selected states & Modals
  const [selectedProgrammeId, setSelectedProgrammeId] = useState<string | null>(null);
  const [detailProgramme, setDetailProgramme] = useState<Programme | null>(null);
  const [activeConfirmationRegistration, setActiveConfirmationRegistration] = useState<Registration | null>(null);
  const [isLookupOpen, setIsLookupOpen] = useState(false);

  // Admin Modals
  const [isProgrammeFormOpen, setIsProgrammeFormOpen] = useState(false);
  const [programmeToEdit, setProgrammeToEdit] = useState<Programme | null>(null);
  const [isGalleryUploadOpen, setIsGalleryUploadOpen] = useState(false);

  // Load data on mount
  const refreshData = () => {
    setProgrammes(getProgrammes());
    setRegistrations(getRegistrations());
    setGallery(getGallery());
    setSiteSettings(getSiteSettings());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleUpdateSiteSettings = (updated: SiteSettings) => {
    saveSiteSettings(updated);
    setSiteSettings(updated);
  };

  // Handlers
  const handleSelectProgrammeForRegister = (programmeId: string) => {
    setSelectedProgrammeId(programmeId);
    setActiveConfirmationRegistration(null);
    setActiveTab('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegistrationSuccess = (newReg: Registration) => {
    setActiveConfirmationRegistration(newReg);
    refreshData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProgrammeModal = (prog?: Programme) => {
    setProgrammeToEdit(prog || null);
    setIsProgrammeFormOpen(true);
  };

  const handleSaveProgramme = (programmeData: Omit<Programme, 'id' | 'registeredCount'>) => {
    if (programmeToEdit) {
      updateProgramme(programmeToEdit.id, programmeData);
    } else {
      addProgramme(programmeData);
    }
    refreshData();
    setIsProgrammeFormOpen(false);
    setProgrammeToEdit(null);
  };

  const handleUploadGallery = (item: Omit<GalleryItem, 'id'>) => {
    addGalleryItem(item);
    refreshData();
    setIsGalleryUploadOpen(false);
  };

  const handleViewRegistrationLetter = (reg: Registration) => {
    setActiveConfirmationRegistration(reg);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const featuredProgramme = programmes.find((p) => p.isFeatured) || programmes[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-200 selection:text-amber-900 font-sans">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'register') {
            setActiveConfirmationRegistration(null);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenLookup={() => setIsLookupOpen(true)}
        selectedProgrammeId={selectedProgrammeId}
        registrationsCount={registrations.length}
        siteSettings={siteSettings}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* If an active confirmation letter is open (either from just submitting or from lookup/admin) */}
        {activeConfirmationRegistration ? (
          <ConfirmationLetter
            registration={activeConfirmationRegistration}
            programme={programmes.find((p) => p.id === activeConfirmationRegistration.programmeId)}
            siteSettings={siteSettings}
            onBackToHome={() => {
              setActiveConfirmationRegistration(null);
              setActiveTab('home');
            }}
            onRegisterAnother={() => {
              setActiveConfirmationRegistration(null);
              setActiveTab('register');
            }}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <div>
                <HomeHero
                  featuredProgramme={featuredProgramme}
                  totalMinistersCount={registrations.length}
                  totalProgrammesCount={programmes.length}
                  siteSettings={siteSettings}
                  onNavigate={(tab) => {
                    setActiveTab(tab);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onSelectProgrammeForRegister={handleSelectProgrammeForRegister}
                  onOpenLookup={() => setIsLookupOpen(true)}
                />

                {/* Quick Programmes Section on Home */}
                <div className="bg-slate-100/70 border-t border-slate-200/80 mt-16">
                  <UpcomingProgrammesSection
                    programmes={programmes}
                    onSelectProgrammeForDetails={(p) => setDetailProgramme(p)}
                    onSelectProgrammeForRegister={handleSelectProgrammeForRegister}
                  />
                </div>
              </div>
            )}

            {activeTab === 'programmes' && (
              <UpcomingProgrammesSection
                programmes={programmes}
                onSelectProgrammeForDetails={(p) => setDetailProgramme(p)}
                onSelectProgrammeForRegister={handleSelectProgrammeForRegister}
              />
            )}

            {activeTab === 'register' && (
              <RegistrationForm
                programmes={programmes}
                selectedProgrammeId={selectedProgrammeId}
                onRegistrationSuccess={handleRegistrationSuccess}
                onCancel={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'gallery' && (
              <GallerySection gallery={gallery} />
            )}

            {activeTab === 'admin' && (
              <AdminDashboard
                programmes={programmes}
                registrations={registrations}
                gallery={gallery}
                siteSettings={siteSettings}
                onUpdateSiteSettings={handleUpdateSiteSettings}
                onOpenProgrammeModal={handleOpenProgrammeModal}
                onOpenGalleryModal={() => setIsGalleryUploadOpen(true)}
                onViewConfirmationLetter={handleViewRegistrationLetter}
                onDataRefresh={refreshData}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        siteSettings={siteSettings}
        onNavigate={(tab) => {
          setActiveTab(tab);
          setActiveConfirmationRegistration(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenLookup={() => setIsLookupOpen(true)}
      />

      {/* MODALS */}
      {/* 1. Programme Detail Modal */}
      <ProgrammeDetailModal
        programme={detailProgramme}
        onClose={() => setDetailProgramme(null)}
        onSelectRegister={handleSelectProgrammeForRegister}
      />

      {/* 2. Registration Verification / Lookup Modal */}
      <RegistrationLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
        onSelectRegistration={handleViewRegistrationLetter}
      />

      {/* 3. Admin Programme Create/Edit Modal */}
      <ProgrammeFormModal
        isOpen={isProgrammeFormOpen}
        onClose={() => {
          setIsProgrammeFormOpen(false);
          setProgrammeToEdit(null);
        }}
        onSave={handleSaveProgramme}
        programmeToEdit={programmeToEdit}
      />

      {/* 4. Admin Gallery Upload Modal */}
      <GalleryUploadModal
        isOpen={isGalleryUploadOpen}
        onClose={() => setIsGalleryUploadOpen(false)}
        onUpload={handleUploadGallery}
        programmes={programmes}
      />
    </div>
  );
}

export default App;
