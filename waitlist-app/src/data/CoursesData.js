const coursesData = [
  {
    domain: "Customer Due Diligence (CDD) & KYC",
    courses: [
      {
        title: "KAWS Certified Customer Due Diligence Associate",
        code: "K-CDD-A",
        level: "Beginner",
        duration: "2 Hours",
        image:"customerduedelligenceassociate.jpeg"
      },
      {
        title: "KAWS Customer Risk Profiling Specialist",
        code: "K-CRPS",
        level: "Intermediate",
        duration: "4 Hours",
        image:"CustomerRiskProfilingSpecialist.jpeg"
      },
      {
        title: "KAWS Strategic Due Diligence Analyst",
        code: "K-SDDA",
        level: "Advanced",
        duration: "6 Hours",
      },
      {
        title: "KAWS Enhanced Due Diligence Foundations",
        code: "K-EDD-F",
        level: "Beginner",
        duration: "2 Hours",
        
      },
      {
        title: "KAWS Enhanced Risk Investigation Specialist",
        code: "K-ERIS",
        level: "Intermediate",
        duration: "4 Hours",
      },
      {
        title: "KAWS Complex Due Diligence Strategist",
        code: "K-CDDS",
        level: "Advanced",
        duration: "6 Hours",
      },
      {
        title: "KAWS Corporate KYC Fundamentals",
        code: "K-CKYC-F",
        level: "Beginner",
        duration: "2 Hours",
        image:"corporatekycfundamentals.jpeg"
      },
      {
        title: "KAWS Corporate Risk Evaluation Specialist",
        code: "K-CRES",
        level: "Intermediate",
        duration: "4 Hours",
      },
      {
        title: "KAWS Advanced Corporate Due Diligence Strategist",
        code: "K-ACDDS",
        level: "Advanced",
        duration: "6 Hours",
      },
      {
        title: "KAWS UBO Identification Fundamentals",
        code: "K-UBO-F",
        level: "Beginner",
        duration: "2 Hours",
        image:"UBOIdentificationFundamentals.jpeg"
      },
      {
        title: "KAWS Complex Ownership Structure Specialist",
        code: "K-COSS",
        level: "Intermediate",
        duration: "4 Hours",
        image:"ComplexOwnershipStructure.jpeg"

        
      },
      {
        title: "KAWS Strategic Beneficial Ownership Investigator",
        code: "K-SBOI",
        level: "Advanced",
        duration: "6 Hours",
      },
      {
        title: "KAWS Legal Entity Analysis Foundations",
        code: "K-LEAF",
        level: "Beginner",
        duration: "2 Hours",
      },
      {
        title: "KAWS Global Corporate Structure Specialist",
        code: "K-GCSS",
        level: "Intermediate",
        duration: "4 Hours",
      },
      {
        title: "KAWS Complex Entity Risk Strategist",
        code: "K-CERS",
        level: "Advanced",
        duration: "6 Hours",
      },
    ],
  },
  {
    domain: "Transaction Monitoring & Financial Crime Investigation",
    courses: [
      {
        title: "Certified Transaction Monitoring Associate",
        code: "K-TMA",
        level: "Beginner",
        duration: "2 Hours",
        image:"CertifiedTransactionMonitoringAssociate.jpeg"
      },
      {
        title: "Alert Investigation Specialist",
        code: "K-AIS",
        level: "Intermediate",
        duration: "4 Hours",
        image:"AlertInvestigationSpecialist.jpeg"
      },
      {
        title: "Financial Crime Monitoring Strategist",
        code: "K-FCMS",
        level: "Advanced",
        duration: "6 Hours",
      },
      {
        title: "Money Laundering Typologies Foundations",
        code: "K-MLTF",
        level: "Beginner",
        duration: "2 Hours",
        image:"MoneyLaunderingTypologiesFoundations.jpeg"
      },
      {
        title: "Transaction Pattern Analysis Specialist",
        code: "K-TPAS",
        level: "Intermediate",
        duration: "4 Hours",
        image:"TransactionPatternAnalysisSpecialist.jpeg"
      },
      {
        title: "Advanced Typology Investigation Analyst",
        code: "K-ATIA",
        level: "Advanced",
        duration: "6 Hours",
      },
      {
        title: "Suspicious Activity Investigation Specialist",
        code: "K-SAIS",
        level: "Intermediate",
        duration: "4 Hours",
        image:"SuspiciousActivityInvestigationSpecialist.jpeg"
      },
      {
        title: "Strategic Financial Crime Investigator",
        code: "K-SFCI",
        level: "Advanced",
        duration: "6 Hours",
      },
      {
        title: "Transaction Monitoring Case Simulation",
        code: "K-TMCS",
        level: "Beginner",
        duration: "2 Hours",
        image:"TransactionMonitoringcaseSimulation.jpeg"
      },
      {
        title: "Alert Investigation Simulation Lab",
        code: "K-AISL",
        level: "Intermediate",
        duration: "4 Hours",
      },
      {
        title: "Financial Crime Investigation Simulation",
        code: "K-FCIS",
        level: "Advanced",
        duration: "6 Hours",
      },
    ],
  },
  {
    domain: "Sanctions Screening & Watchlist Management",
    courses: [
      {
        title: "Sanctions Screening Fundamentals",
        code: "K-SSF",
        level: "Beginner",
        duration: "2 Hours",
        image:"SanctionsScreeningFundamentals.jpeg"
      },
      {
        title: "Global Sanctions Intelligence Specialist",
        code: "K-GSIS",
        level: "Intermediate",
        duration: "4 Hours",
      },
      {
        title: "Strategic Sanctions Investigation Analyst",
        code: "K-SSIA",
        level: "Advanced",
        duration: "6 Hours",
      },
      {
        title: "Watchlist Screening Fundamentals",
        code: "K-WSF",
        level: "Beginner",
        duration: "2 Hours",
        image:"WatchlistScreeningFundamentals.jpeg"
      },
      {
        title: "Name Matching Methodology",
        code: "K-NMM",
        level: "Intermediate",
        duration: "4 Hours",
        image:"NameMatchingMethodology.jpeg"
      },
      {
        title: "False Positive Investigation",
        code: "K-FPI",
        level: "Intermediate",
        duration: "4 Hours",
        image:"FalsePositiveInvestigation.jpeg"
      },
      {
        title: "Sanctions Risk Evaluation",
        code: "K-SRE",
        level: "Advanced",
        duration: "6 Hours",
      },
    ],
  },
  {
    domain: "PEP Risk & Adverse Media",
    courses: [
      {
        title: "PEP Risk Assessment Fundamentals",
        code: "K-PERI",
        level: "Beginner",
        duration: "2 Hours",
        image:"PEPRiskAssessmentFundamentals.jpeg"
      },
      {
        title: "PEP Monitoring Specialist",
        code: "K-PEMS",
        level: "Intermediate",
        duration: "4 Hours",
      },
      {
        title: "Strategic PEP Risk Analyst",
        code: "K-SPRA",
        level: "Advanced",
        duration: "6 Hours",
      },
      {
        title: "Adverse Media Detection Essentials",
        code: "K-AMDE",
        level: "Beginner",
        duration: "2 Hours",
        image:"AdverseMediaDetectionEssentials.jpeg"
      },
      {
        title: "Adverse Media Risk Analysis Specialist",
        code: "K-AMRAS",
        level: "Intermediate",
        duration: "4 Hours",
      },
      {
        title: "Strategic Adverse Media Investigator",
        code: "K-SAMI",
        level: "Advanced",
        duration: "6 Hours",
      },
    ],
  },
  {
    domain: "AML Core Compliance",
    courses: [
      {
        title: "Anti-Money Laundering Foundations Professional",
        code: "K-AMLF",
        level: "Beginner",
        duration: "2 Hours",
        image:"Anti-MoneyLaunderingFoundationsProfessional.jpeg"
      },
      {
        title: "AML Risk Assessment Specialist",
        code: "K-ARAS",
        level: "Intermediate",
        duration: "4 Hours",
        image:"AMLRiskAssessmentSpecialist.jpeg"
      },
      {
        title: "Global AML Compliance Strategist",
        code: "K-GACS",
        level: "Advanced",
        duration: "6 Hours",
      },
    ],
  },
  {
    domain: "Regulatory Frameworks (FATF, EU, US & UK)",
    courses: [
      {
        title: "FATF Standards Essentials",
        code: "K-FSE",
        level: "Beginner",
        duration: "2 Hours",
        image:"FATFStandardsEssentials.jpeg"
      },
      {
        title: "FATF Risk Based Approach Specialist",
        code: "K-FRAS",
        level: "Intermediate",
        duration: "4 Hours",
        image:"FATFRiskBasedApproachSpecialist.jpeg"
      },
      {
        title: "FATF Compliance Strategy Analyst",
        code: "K-FCSA",
        level: "Advanced",
        duration: "6 Hours",
      },
      {
        title: "EU AML Directives Foundations",
        code: "K-EUAML-F",
        level: "Beginner",
        duration: "2 Hours",
        image:"EUAMLDirectivesFoundations.jpeg"
      },
      {
        title: "European AML Compliance Specialist",
        code: "K-EACS",
        level: "Intermediate",
        duration: "4 Hours",
      },
      {
        title: "Advanced EU AML Strategy Analyst",
        code: "K-EUASA",
        level: "Advanced",
        duration: "6 Hours",
      },
      {
        title: "US AML Compliance Foundations",
        code: "K-USAML-F",
        level: "Beginner",
        duration: "2 Hours",
        image:"USAMLComplianceFoundations.jpeg"
      },
      {
        title: "Bank Secrecy Act Specialist",
        code: "K-BSAS",
        level: "Intermediate",
        duration: "4 Hours",
      },
      {
        title: "Strategic US AML Compliance Analyst",
        code: "K-USACA",
        level: "Advanced",
        duration: "6 Hours",
      },
      {
        title: "UK AML Regulations Fundamentals",
        code: "K-UKAML-F",
        level: "Beginner",
        duration: "2 Hours",
        image:"UKAMLRegulationsFundamentals.jpeg"
      },
      {
        title: "FCA Compliance Specialist",
        code: "K-FCACS",
        level: "Intermediate",
        duration: "4 Hours",
      },
      {
        title: "Strategic UK Financial Crime Analyst",
        code: "K-UKFCA",
        level: "Advanced",
        duration: "6 Hours",
      },
    ],
  },
  {
    domain: "Trade-Based Money Laundering & Crypto AML",
    courses: [
      {
        title: "Trade Based Money Laundering Foundations",
        code: "K-TBML-F",
        level: "Beginner",
        duration: "2 Hours",
        image:"TradeBasedMoneyLaunderingFoundations.jpeg"
      },
      {
        title: "TBML Detection Specialist",
        code: "K-TBML-DS",
        level: "Intermediate",
        duration: "4 Hours",
        image:"TBMLDetectionSpecialist.jpeg"
      },
      {
        title: "Strategic Trade Crime Analyst",
        code: "K-STCA",
        level: "Advanced",
        duration: "6 Hours",
      },
      {
        title: "Crypto AML Foundations",
        code: "K-CAML-F",
        level: "Beginner",
        duration: "2 Hours",
        image:"CryptoAMLFoundations.jpeg"
      },
      {
        title: "Digital Asset Risk Investigation Specialisation Specialist",
        code: "K-DARIS",
        level: "Intermediate",
        duration: "4 Hours",
        image:"DigitalAssetRiskInvestigationSpecialis.jpeg"
      },
      {
        title: "Strategic Crypto Financial Crime Analyst",
        code: "K-SCFCA",
        level: "Advanced",
        duration: "6 Hours",
      },
    ],
  },
  {
    domain: "Practical Skills Micro-Modules",
    courses: [
      {
        title: "Customer Risk Rating Essentials",
        code: "K-CRRE",
        level: "Beginner",
        duration: "1 Hour",
        image:"CustomerRiskRatingEssentials.jpeg"
      },
      {
        title: "Customer Profiling Techniques",
        code: "K-CPT",
        level: "Beginner",
        duration: "1 Hour",
 },
      {
        title: "Risk Indicator Identification",
        code: "K-RII",
        level: "Beginner",
        duration: "1 Hour",
      },
      {
        title: "Red Flag Detection Essentials",
        code: "K-RFDE",
        level: "Beginner",
        duration: "1 Hour",
        image:"RedFlagDetectionEssentials.jpeg"
      },
      {
        title: "Transaction Behavior Analysis",
        code: "K-TBA",
        level: "Intermediate",
        duration: "1 Hour",
      },
      {
        title: "Alert Escalation Framework",
        code: "K-AEF",
        level: "Intermediate",
        duration: "1 Hour",
      },
      {
        title: "Case Documentation Techniques",
        code: "K-CDT",
        level: "Intermediate",
        duration: "1 Hour",
      },
      {
        title: "Suspicious Narrative Writing",
        code: "K-SNW",
        level: "Intermediate",
        duration: "1 Hour",
        image:"SuspiciousNarrativeWriting.jpeg"
      },
      {
        title: "Corporate Registry Research",
        code: "K-CRR",
        level: "Beginner",
        duration: "1 Hour",
      },
      {
        title: "Adverse Media Search Techniques",
        code: "K-AMST",
        level: "Beginner",
        duration: "1 Hour",
      },
      {
        title: "Source of Wealth Analysis",
        code: "K-SWA",
        level: "Intermediate",
        duration: "1 Hour",
        image:"SourceofWealthAnalysis.jpeg"
      },
      {
        title: "Source of Funds Verification",
        code: "K-SFV",
        level: "Intermediate",
        duration: "1 Hour",
        image:"SourceofFundsVerification.jpeg"
      },
    ],
  },
  {
    domain: "AML Data Analysis & Compliance Intelligence",
    courses: [
      {
        title: "AML Data Interpretation",
        code: "K-ADI",
        level: "Beginner",
        duration: "2 Hours",
      },
      {
        title: "Financial Crime Data Analysis Specialist",
        code: "K-FCDAS",
        level: "Intermediate",
        duration: "4 Hours",
      },
      {
        title: "Strategic Compliance Data Analyst",
        code: "K-SCDA",
        level: "Advanced",
        duration: "6 Hours",
      },
    ],
  },
  {
    domain: "FCC Career Development & Professional Branding",
    courses: [
      {
        title: "FCC Interview Preparation Program",
        code: "K-FIP",
        level: "Beginner",
        duration: "2 Hours",
        image:"FCCInterviewPreparationProgram.jpeg"
      },
      {
        title: "Advanced FCC Interview Masterclass",
        code: "K-AFIM",
        level: "Intermediate",
        duration: "4 Hours",
         image:"AdvancedFCCInterviewMasterclass.jpeg"
      },
      {
        title: "Strategic Compliance Career Accelerator",
        code: "K-SCCA",
        level: "Advanced",
        duration: "6 Hours",
      },
      {
        title: "ATS Optimized Resume Builder",
        code: "K-AFRB",
        level: "Beginner",
        duration: "1 Hour",
        image:"ATSOptimizedFCCResumeBuilder.jpeg"
      },
      {
        title: "Advanced Compliance Resume Strategy",
        code: "K-ACRS",
        level: "Intermediate",
        duration: "2 Hours",
      },
      {
        title: "Strategic Personal Branding",
        code: "K-SPBC",
        level: "Advanced",
        duration: "4 Hours",
      },
      {
        title: "FCC LinkedIn Profile Optimization",
        code: "K-FLPO",
        level: "Beginner",
        duration: "1 Hour",
        image:"FCCLinkedInProfileOptimization.jpeg"
      },
      {
        title: "LinkedIn Authority Building",
        code: "K-LABC",
        level: "Intermediate",
        duration: "2 Hours",
      },
      {
        title: "Strategic Compliance Thought Leadership",
        code: "K-SCTL",
        level: "Advanced",
        duration: "4 Hours",
      },
      {
        title: "Naukri Recruiter Visibility Program",
        code: "K-NRVP",
        level: "Beginner",
        duration: "1 Hour",
      },
      {
        title: "Compliance Job Search Strategy",
        code: "K-CJSS",
        level: "Intermediate",
        duration: "2 Hours",
      },
      {
        title: "Strategic Career Transition Program",
        code: "K-SCTP",
        level: "Advanced",
        duration: "4 Hours",
      },
    ],
  },
  {
    domain: "Advanced Electives & Global Specializations",
    courses: [
      {
        title: "Cross Border Financial Crime Analysis",
        code: "K-CBFCA",
        level: "Intermediate",
        duration: "4 Hours",
        image:"CrossBorderFinancialCrimeAnalysis.jpeg"
      },
      {
        title: "High Risk Jurisdiction Analysis",
        code: "K-HRJA",
        level: "Intermediate",
        duration: "4 Hours",
        image:"highriskjurisdictionanalysis.jpeg"
      },
      {
        title: "Global Financial Crime Strategy",
        code: "K-GFCS",
        level: "Advanced",
        duration: "6 Hours",
      },
      {
        title: "Complex Compliance Risk Management",
        code: "K-CCRM",
        level: "Advanced",
        duration: "6 Hours",
      },
      {
        title: "Strategic Financial Crime Prevention",
        code: "K-SFCP",
        level: "Advanced",
        duration: "6 Hours",
      },
      {
        title: "Master Financial Crime Compliance Architect",
        code: "K-MFCCA",
        level: "Advanced",
        duration: "6 Hours",
      },
      {
        title: "Global Financial Crime Enforcement Studies",
        code: "K-GFCES",
        level: "Advanced",
        duration: "6 Hours",
      },
      {
        title: "Financial Crime Investigation Masterclass",
        code: "K-FCIM",
        level: "Advanced",
        duration: "6 Hours",
        image:"FinancialCrimeInvestigationMasterclass.jpeg"
      },
      {
        title: "Advanced Compliance Leadership Program",
        code: "K-ACLP",
        level: "Advanced",
        duration: "6 Hours",
      },
      {
        title: "International Financial Crime Risk Management",
        code: "K-IFCRM",
        level: "Advanced",
        duration: "6 Hours",
      },
      {
        title: "Strategic AML Governance Program",
        code: "K-SAGP",
        level: "Advanced",
        duration: "6 Hours",
      },
      {
        title: "Enterprise Compliance Strategy Program",
        code: "K-ECSP",
        level: "Advanced",
        duration: "6 Hours",
      },
      {
        title: "Global Financial Crime Policy Architect",
        code: "K-GFCPA",
        level: "Advanced",
        duration: "6 Hours",
      },
    ],
  },
  {
    domain: "Fraud Risk Management & Internal Controls",
    courses: [
      {
        title: "Fraud Risk Foundations",
        code: "K-FRF",
        level: "Beginner",
        duration: "2 Hours",
      },
      {
        title: "Fraud Risk Assessment Specialist",
        code: "K-FRAS",
        level: "Intermediate",
        duration: "4 Hours",
      },
      {
        title: "Fraud Detection & Investigation Analyst",
        code: "K-FDIA",
        level: "Intermediate",
        duration: "4 Hours",
      },
      {
        title: "Internal Controls Fundamentals",
        code: "K-ICF",
        level: "Beginner",
        duration: "2 Hours",
      },
      {
        title: "Internal Controls Review Specialist",
        code: "K-ICRS",
        level: "Intermediate",
        duration: "4 Hours",
      },
      {
        title: "Strategic Governance, Risk & Compliance Analyst",
        code: "K-SGRCA",
        level: "Advanced",
        duration: "6 Hours",
      },
    ],
  },
];

export default coursesData;
