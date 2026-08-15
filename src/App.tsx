import React, { useState, useEffect } from 'react';
import {
  Programme,
  Registration,
  GalleryItem,
  SiteSettings,
  MemberUser,
  ChurchLeader,
  SermonMedia,
} from './types';
import {
  getProgrammes,
  getRegistrations,
  getGallery,
  addProgramme,
  updateProgramme,
  addGalleryItem,
  updateGalleryItem,
  getSiteSettings,
  saveSiteSettings,
  getCurrentMember,
  logoutMember,
  getChurchLeaders,
  addChurchLeader,
  getSermons,
  addSermon,
  isAdminAuthenticated,
} from './utils/storage';
import { initFirebaseSync, subscribeToDataChanges } from './services/firebaseSync';
import { Navbar, AppTab } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeHero } from './components/HomeHero';
import { UpcomingProgrammesSection } from './components/UpcomingProgrammesSection';
import { ProgrammeDetailModal } from './components/ProgrammeDetailModal';
import { RegistrationForm } from './components/RegistrationForm';
import { ConfirmationLetter } from './components/ConfirmationLetter';
import { ChurchLeadersSection } from './components/ChurchLeadersSection';
import { SermonsSection } from './components/SermonsSection';
import { GallerySection } from './components/GallerySection';
import { AdminDashboard } from './components/AdminDashboard';
import { ProgrammeFormModal } from './components/ProgrammeFormModal';
import { GalleryUploadModal } from './components/GalleryUploadModal';
import { RegistrationLookupModal } from './components/RegistrationLookupModal';
import { MemberAuthModal } from './components/MemberAuthModal';
import { MinisterBadgeModal } from './components/MinisterBadgeModal';
import { DEFAULT_SITE_SETTINGS } from './data/seedData';

export function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('home');

  // Data States
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [churchLeaders, setChurchLeaders] = useState<ChurchLeader[]>([]);
  const [sermons, setSermons] = useState<SermonMedia[]>([]);

  // Member Authentication State
  const [currentMember, setCurrentMember] = useState<MemberUser | null>(null);
  const [isMemberAuthModalOpen, setIsMemberAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signup');
  const [authPromptMessage, setAuthPromptMessage] = useState<string | undefined>(undefined);

  // Selected states & Modals
  const [selectedProgrammeId, setSelectedProgrammeId] = useState<string | null>(null);
  const [detailProgramme, setDetailProgramme] = useState<Programme | null>(null);
  const [activeConfirmationRegistration, setActiveConfirmationRegistration] = useState<Registration | null>(null);
  const [activeBadgeRegistration, setActiveBadgeRegistration] = useState<Registration | null>(null);
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [lookupInitialQuery, setLookupInitialQuery] = useState('');

  // Admin Modals
  const [isProgrammeFormOpen, setIsProgrammeFormOpen] = useState(false);
  const [programmeToEdit, setProgrammeToEdit] = useState<Programme | null>(null);
  const [isGalleryUploadOpen, setIsGalleryUploadOpen] = useState(false);
  const [galleryItemToEdit, setGalleryItemToEdit] = useState<GalleryItem | null>(null);

  // Load data on mount and subscribe to real-time Firestore sync
  const refreshData = () => {
    try {
      setProgrammes(getProgrammes());
      setRegistrations(getRegistrations());
      setGallery(getGallery());
      setSiteSettings(getSiteSettings());
      setChurchLeaders(getChurchLeaders());
      setSermons(getSermons());
      setCurrentMember(getCurrentMember());
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  };

  useEffect(() => {
    refreshData();
    const cleanupSync = initFirebaseSync();
    const unsubscribeListeners = subscribeToDataChanges(() => {
      refreshData();
    });

    return () => {
      cleanupSync();
      unsubscribeListeners();
    };
  }, []);

  const handleUpdateSiteSettings = (updated: SiteSettings) => {
    saveSiteSettings(updated);
    setSiteSettings(updated);
  };

  // Auth Handlers
  const handleOpenMemberAuth = (mode: 'signin' | 'signup' = 'signup', promptMsg?: string) => {
    setAuthModalMode(mode);
    setAuthPromptMessage(promptMsg);
    setIsMemberAuthModalOpen(true);
  };

  const handleMemberAuthSuccess = (member: MemberUser) => {
    setCurrentMember(member);
    setIsMemberAuthModalOpen(false);
    refreshData();
  };

  const handleMemberLogout = () => {
    logoutMember();
    setCurrentMember(null);
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

  const handleAddLeaderSuccess = (_newLeader: ChurchLeader) => {
    refreshData();
  };

  const handleAddSermonSuccess = (_newSermon: SermonMedia) => {
    refreshData();
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

  const handleOpenGalleryModal = (item?: GalleryItem) => {
    setGalleryItemToEdit(item || null);
    setIsGalleryUploadOpen(true);
  };

  const handleUploadGallery = (item: Omit<GalleryItem, 'id'>) => {
    addGalleryItem(item);
    refreshData();
    setIsGalleryUploadOpen(false);
    setGalleryItemToEdit(null);
  };

  const handleUpdateGallery = (id: string, updates: Partial<Omit<GalleryItem, 'id'>>) => {
    updateGalleryItem(id, updates);
    refreshData();
    setIsGalleryUploadOpen(false);
    setGalleryItemToEdit(null);
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
        onOpenLookup={() => {
          setLookupInitialQuery('');
          setIsLookupOpen(true);
        }}
        onOpenBadgeLookup={(defaultQuery) => {
          setLookupInitialQuery(defaultQuery || '');
          setIsLookupOpen(true);
        }}
        selectedProgrammeId={selectedProgrammeId}
        registrationsCount={registrations.length}
        siteSettings={siteSettings}
        currentMember={currentMember}
        onOpenMemberAuth={(mode?: 'signin' | 'signup') => {
          const targetMode = mode || 'signup';
          handleOpenMemberAuth(
            targetMode,
            targetMode === 'signup'
              ? 'Please create your member account with your own password to proceed.'
              : 'Please sign in with your email and password.'
          );
        }}
        onMemberLogout={handleMemberLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* If an active confirmation letter is open */}
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
                currentMember={currentMember}
                onRequestSignIn={() =>
                  handleOpenMemberAuth('signin', 'Please sign in with your email and password.')
                }
                onViewExistingRegistration={handleViewRegistrationLetter}
                onMemberAuthSuccess={handleMemberAuthSuccess}
              />
            )}

            {activeTab === 'leaders' && (
              <ChurchLeadersSection
                leaders={churchLeaders}
                onAddLeaderSuccess={handleAddLeaderSuccess}
                currentMember={currentMember}
                onRequestSignIn={() =>
                  handleOpenMemberAuth('signup', 'Please sign up or sign in with your password to register as a Church Leader.')
                }
              />
            )}

            {activeTab === 'sermons' && (
              <SermonsSection
                sermons={sermons}
                onAddSermonSuccess={handleAddSermonSuccess}
                currentMember={currentMember}
                onRequestSignIn={() =>
                  handleOpenMemberAuth('signin', 'Please sign in with your member account to access study notes.')
                }
                isAdmin={isAdminAuthenticated()}
                onNavigateToAdmin={() => {
                  setActiveTab('admin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activeTab === 'gallery' && (
              <GallerySection
                gallery={gallery}
                isAdmin={isAdminAuthenticated()}
                onEditItem={handleOpenGalleryModal}
              />
            )}

            {activeTab === 'admin' && (
              <AdminDashboard
                programmes={programmes}
                registrations={registrations}
                gallery={gallery}
                churchLeaders={churchLeaders}
                siteSettings={siteSettings}
                onUpdateSiteSettings={handleUpdateSiteSettings}
                onOpenProgrammeModal={handleOpenProgrammeModal}
                onOpenGalleryModal={handleOpenGalleryModal}
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
        onOpenLookup={() => {
          setLookupInitialQuery('');
          setIsLookupOpen(true);
        }}
      />

      {/* MODALS */}
      <MemberAuthModal
        isOpen={isMemberAuthModalOpen}
        onClose={() => setIsMemberAuthModalOpen(false)}
        onSuccess={handleMemberAuthSuccess}
        initialMode={authModalMode}
        promptMessage={authPromptMessage}
      />

      <ProgrammeDetailModal
        programme={detailProgramme}
        onClose={() => setDetailProgramme(null)}
        onSelectRegister={handleSelectProgrammeForRegister}
      />

      <RegistrationLookupModal
        isOpen={isLookupOpen}
        onClose={() => {
          setIsLookupOpen(false);
          setLookupInitialQuery('');
        }}
        initialQuery={lookupInitialQuery}
        onSelectRegistration={handleViewRegistrationLetter}
        onSelectBadge={(reg) => {
          setActiveBadgeRegistration(reg);
        }}
      />

      {/* Minister Accreditation Badge Modal */}
      {activeBadgeRegistration && (
        <MinisterBadgeModal
          isOpen={Boolean(activeBadgeRegistration)}
          onClose={() => setActiveBadgeRegistration(null)}
          registration={activeBadgeRegistration}
          programme={programmes.find((p) => p.id === activeBadgeRegistration.programmeId)}
        />
      )}

      <ProgrammeFormModal
        isOpen={isProgrammeFormOpen}
        onClose={() => {
          setIsProgrammeFormOpen(false);
          setProgrammeToEdit(null);
        }}
        onSave={handleSaveProgramme}
        programmeToEdit={programmeToEdit}
      />

      <GalleryUploadModal
        isOpen={isGalleryUploadOpen}
        onClose={() => {
          setIsGalleryUploadOpen(false);
          setGalleryItemToEdit(null);
        }}
        onUpload={handleUploadGallery}
        onUpdate={handleUpdateGallery}
        itemToEdit={galleryItemToEdit}
        programmes={programmes}
      />
    </div>
  );
}

export default App;
