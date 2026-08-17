export type MinisterialTitle =
  | 'Pastor'
  | 'Reverend'
  | 'Bishop'
  | 'Apostle'
  | 'Evangelist'
  | 'Prophet'
  | 'Prophetess'
  | 'Teacher'
  | 'Deacon'
  | 'Deaconess'
  | 'Elder'
  | 'Minister'
  | 'Brother'
  | 'Sister'
  | 'Dr.'
  | 'Other';

export type MinisterialPosition =
  | 'Senior Pastor / General Overseer'
  | 'Associate / Resident Pastor'
  | 'Youth / Campus Pastor'
  | 'Children / Teens Minister'
  | 'Music / Worship Director'
  | 'Evangelist / Outreach Director'
  | 'Missions Coordinator'
  | 'Church Administrator / Executive'
  | 'Prayer / Intercession Leader'
  | 'Bible Study / Christian Education Teacher'
  | 'Church Worker / Deacon / Elder'
  | 'Other';

export type ProgrammeCategory =
  | 'All'
  | 'Conferences'
  | 'Leadership Summits'
  | 'Ministers Retreats'
  | 'Pastoral Workshops'
  | 'Worship Conclaves'
  | 'Youth Summits';

export type RegistrationStatus = 'confirmed' | 'checked_in' | 'vip' | 'cancelled';

export type AdminRole =
  | 'super_admin'
  | 'secretariat_admin'
  | 'registration_officer'
  | 'media_manager';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  passcode: string;
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
  isPrimaryOwner?: boolean;
  phone?: string;
}

export interface MemberUser {
  id: string;
  email: string;
  password?: string;
  title: MinisterialTitle;
  fullName: string;
  phone: string;
  whatsapp?: string;
  churchName: string;
  ministerialPosition: MinisterialPosition;
  customPosition?: string;
  city: string;
  state?: string;
  country: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface ChurchLeader {
  id: string;
  title: MinisterialTitle;
  fullName: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  churchName: string;
  denomination?: string;
  keyPosition: string;
  positionDescription: string;
  ministryFocus?: string[];
  yearsInMinistry?: number;
  city: string;
  state?: string;
  country: string;
  photoUrl: string;
  websiteOrSocial?: string;
  isVerified?: boolean;
  registeredAt: string;
  memberId?: string;
}

export type MediaType = 'audio' | 'video' | 'file';

export interface SermonMedia {
  id: string;
  title: string;
  speaker: string;
  speakerTitle?: MinisterialTitle;
  speakerRole?: string;
  churchName?: string;
  programmeId?: string;
  programmeTitle?: string;
  date: string;
  mediaType: MediaType;
  mediaUrl: string;
  fileUrl?: string;
  fileName?: string;
  fileSizeBytes?: string;
  duration?: string;
  coverImageUrl?: string;
  category: string;
  scriptureRef?: string;
  description: string;
  tags?: string[];
  viewsOrPlays?: number;
  downloadCount?: number;
  isFeatured?: boolean;
  uploadedAt: string;
  uploadedBy?: string;
}

export interface Speaker {
  id: string;
  name: string;
  role: string;
  ministry: string;
  imageUrl?: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  sessionTitle: string;
  speaker?: string;
  venueRoom?: string;
}

export interface Programme {
  id: string;
  title: string;
  theme: string;
  scripture: string;
  category: string;
  bannerUrl: string;
  startDate: string;
  endDate: string;
  time: string;
  venue: string;
  city: string;
  country: string;
  speakers: Speaker[];
  schedule: ScheduleItem[];
  description: string;
  capacity: number;
  registeredCount: number;
  isFeatured?: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  registrationDeadline: string;
  contactEmail: string;
  contactPhone: string;
  isFree: boolean;
  registrationFee?: string;
  materialsIncluded?: string[];
}

export interface Registration {
  id: string;
  title: MinisterialTitle;
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  churchName: string;
  denomination?: string;
  ministerialPosition: MinisterialPosition;
  customPosition?: string;
  city: string;
  state: string;
  country: string;
  programmeId: string;
  programmeTitle: string;
  arrivalDate?: string;
  departureDate?: string;
  attendeesCount?: number;
  attendeeNames?: string[];
  specialRequirements?: string;
  prayerRequests?: string;
  passportPhotoUrl?: string;
  qrCodeData?: string;
  status: RegistrationStatus;
  checkInStatus?: 'checked_in' | 'not_checked_in';
  checkInTime?: string;
  registeredAt: string;
  checkedInAt?: string;
  notes?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  programmeId?: string;
  programmeTitle?: string;
  imageUrl: string;
  eventDate: string;
  category: string;
  tags?: string[];
}

export interface RegistrationFilters {
  search: string;
  programmeId: string;
  position: string;
  status: string;
  sortBy: 'latest' | 'oldest' | 'name' | 'programme';
}

export interface SiteSettings {
  // Master Administrative Email & Security
  primaryAdminEmail?: string; // Editable master admin login email (default: asamuelbukunmi@gmail.com)
  adminPasscode: string;

  // General Branding & Logos
  orgName: string;
  orgTagline: string;
  orgShortCode: string;
  orgLogoUrl?: string;

  // Hero Section Write-ups & Banner
  heroBadge: string;
  heroHeadline: string;
  heroHeadlineHighlight: string;
  heroSubtitle: string;
  heroScriptureQuote: string;
  heroScriptureRef: string;
  heroBannerImageUrl: string;
  heroOverlayOpacity: number;
  heroRegisterButtonText?: string;
  heroFlyerButtonText?: string;
  heroLookupButtonText?: string;

  // Hero Stats Labels
  heroStatsMinistersCount?: string;
  heroStatsMinistersLabel?: string;
  heroStatsProgrammesCount?: string;
  heroStatsProgrammesLabel?: string;
  heroStatsLettersCount?: string;
  heroStatsLettersLabel?: string;
  heroStatsFastCount?: string;
  heroStatsFastLabel?: string;

  // Featured Programme Showcase Card (Words & Poster Image)
  featuredProgramBadge?: string;
  featuredProgramLocation?: string;
  featuredProgramTitle?: string;
  featuredProgramTheme?: string;
  featuredProgramPosterUrl?: string;
  featuredProgramDates?: string;
  featuredProgramTime?: string;
  featuredProgramFastProtocol?: string;
  featuredProgramHost?: string;
  featuredProgramHotlines?: string;
  featuredProgramRegisterBtnText?: string;
  featuredProgramFlyerBtnText?: string;

  // The 4 Core Ministerial Pillars (Words & Descriptions)
  pillarsSectionHeading?: string;
  pillarsSectionSubtitle?: string;
  pillar1Title?: string;
  pillar1Desc?: string;
  pillar2Title?: string;
  pillar2Desc?: string;
  pillar3Title?: string;
  pillar3Desc?: string;
  pillar4Title?: string;
  pillar4Desc?: string;

  // Announcement Top Bar
  announcementActive: boolean;
  announcementText: string;
  announcementLinkText?: string;
  announcementLinkTab?: 'programmes' | 'register' | 'gallery' | 'sermons' | 'leaders';

  // Official Confirmation Letter Customization
  letterOrgHeader: string;
  letterSubHeader: string;
  letterDocumentTitle: string;
  letterGreetingText: string;
  letterOpeningParagraph: string;
  letterImportantInstructions: string[];
  letterSecretariatEmail: string;
  letterSecretariatPhone: string;

  // Signatories & Verification Seals
  signatory1Name: string;
  signatory1Title: string;
  signatory1Role: string;
  signatory1SignatureUrl?: string;
  signatory2Name: string;
  signatory2Title: string;
  signatory2Role: string;
  signatory2SignatureUrl?: string;
  officialSealText: string;
  officialSealSubtext: string;

  // Rights, Legal, Disclaimers & Accreditation Policy
  copyrightNotice: string;
  accreditationRightsNotice: string;
  privacyNotice: string;
  termsNotice: string;

  // Ministers Connect Headquarters & Contacts
  headquartersAddress: string;
  supportEmail: string;
  supportPhone: string;
  whatsappContact: string;

  // Footer Specific Wording
  footerAboutTitle?: string;
  footerAboutText?: string;
  footerQuoteText?: string;
  footerNavigationTitle?: string;
  footerHeadquartersTitle?: string;
  footerNoticeTitle?: string;
  footerNoticeText?: string;
  footerNoticeBtnText?: string;
  footerCopyrightNotice?: string;
  footerDedicatedText?: string;

  // Terminology & Naming Customization
  programmeTermSingular?: string; // e.g. "Programme", "Summit", "Monthly Program"
  programmeTermPlural?: string; // e.g. "Programmes", "Summits", "Gatherings"
}
