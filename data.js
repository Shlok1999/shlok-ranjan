// Default portfolio content. The admin panel overwrites a copy of this
// object in localStorage under the key "portfolio_data". The public site
// reads localStorage first and falls back to this file if nothing is saved yet.
const DEFAULT_PORTFOLIO_DATA = {
  hero: {
    name: "Shlok Ranjan",
    role: "Full-Stack & AI Engineer",
    tagline: "I build the orchestration layer — multi-agent systems, RAG pipelines, and the full-stack products that put them in front of real users.",
    location: "Navi Mumbai, India",
    email: "09shlok1999ae1@gmail.com",
    github: "https://github.com/",
    resumeUrl: "#"
  },
  about: "Three years into building production software, currently splitting time between a cloud gaming platform at IOOGN and a BS in Data Science at IIT Madras. My focus has narrowed to the orchestration layer of AI products — coordinating specialist agents, wiring retrieval pipelines to real data, and shipping the full-stack surface around them so the system is actually usable, not just a demo.",
  skills: [
    {
      group: "Languages & Frameworks",
      items: ["JavaScript", "TypeScript", "Python", "Node.js", "Express.js", "React.js", "Redux", "React Native", "Next.js", "Java (Android)", "TailwindCSS"]
    },
    {
      group: "AI & Data Engineering",
      items: ["LLM Orchestration", "Retrieval-Augmented Generation", "Multi-Agent Systems", "pgvector", "Workflow Automation (N8N)"]
    },
    {
      group: "Cloud & Architecture",
      items: ["Google Cloud", "Scalable Architecture", "Git", "Docker", "REST APIs", "Third-Party API Integration"]
    },
    {
      group: "Databases",
      items: ["MongoDB", "MySQL", "SQL", "NoSQL"]
    },
    {
      group: "Tools & Design",
      items: ["Figma", "Android Studio"]
    }
  ],
  experience: [
    {
      role: "Software Engineer",
      org: "IOOGN",
      location: "Remote",
      period: "Sep 2025 — Present",
      points: [
        "Spearheaded end-to-end development of a highly scalable cloud gaming application.",
        "Integrated new technologies and third-party APIs to extend core application functionality.",
        "Implemented architectural strategies that measurably increased client-side efficiency and scalability."
      ]
    },
    {
      role: "Co-founder",
      org: "Paavam AI",
      location: "Remote",
      period: "Jan 2025 — Sep 2025",
      points: [
        "Delivered a Gen AI application built for real estate clients end to end.",
        "Engineered the application on Google Cloud using a Retrieval-Augmented Generation architecture.",
        "Automated multi-step workflows with N8N to chain several AI tools into one pipeline."
      ]
    },
    {
      role: "Fullstack Developer",
      org: "Avenue Sound",
      location: "Navi Mumbai",
      period: "Jul 2022 — Sep 2025",
      points: [
        "Designed and scaled applications for MSME clients across web and mobile.",
        "Built and launched a responsive full-stack website on the MERN stack.",
        "Maintained the native Android codebase and designed UI/UX for both platforms in Figma."
      ]
    }
  ],
  projects: [
    {
      name: "Loudr",
      stack: "TypeScript · Node.js · Claude API · Multi-Agent Orchestration",
      description: "A music marketing platform for independent Indian artists. Built a multi-agent backend with an orchestrator dispatching six specialist agents — Release Strategist, Content Creator, Playlist Pitcher, Ad Strategist, Analytics, and PR — in parallel, now wired to live Instagram and Spotify data.",
      link: "https://loudr.grootin.in"
    },
    {
      name: "Cloud Gaming Platform",
      stack: "Node.js · Next.js · Google Cloud · Scalable Architecture",
      description: "An end-to-end cloud gaming application, from backend services to client integration, architected for horizontal scale under growing client load.",
      link: "https://glorygames.cloud"
    },
    {
      name: "AI Real Estate Assistant",
      stack: "Google Cloud · RAG · LLMs · N8N",
      description: "A Gen AI application for real estate clients using a RAG architecture for accurate, context-aware responses, deployed on Google Cloud with N8N-automated workflows.",
      link: "#"
    },
    {
      name: "SlashCareers",
      stack: "React · Node.js · LLM APIs",
      description: "A solo-built AI career platform helping users navigate career decisions with LLM-driven guidance.",
      link: "https://playtree.in"
    },
    {
      name: "MSME Business Platform",
      stack: "MERN Stack · Java (Android) · Figma",
      description: "A responsive full-stack web app plus a companion native Android app for MSME clients, with UI/UX designed in Figma across both.",
      link: "https://vendor-hub-577.emergent.host/"
    }
  ],
  education: [
    {
      degree: "BS, Data Science",
      school: "IIT Madras",
      period: "In Progress"
    },
    {
      degree: "High School",
      school: "Gyan Ganga Vidyapeeth",
      period: "2016 — 2018"
    }
  ]
};

// Reads saved data from localStorage, falling back to the defaults above.
function loadPortfolioData() {
  try {
    const saved = localStorage.getItem("portfolio_data");
    if (saved) {
      const data = JSON.parse(saved);
      if (data && data.hero && data.hero.email === "hello@shlokranjan.dev") {
        data.hero.email = "09shlok1999ae1@gmail.com";
        localStorage.setItem("portfolio_data", JSON.stringify(data));
      }
      return data;
    }
  } catch (e) {
    console.warn("Could not parse saved portfolio data, using defaults.", e);
  }
  return DEFAULT_PORTFOLIO_DATA;
}
