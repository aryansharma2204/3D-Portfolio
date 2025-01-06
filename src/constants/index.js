import {
  mobile,
  backend,
  unity,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  NCRTCLOGO,
  PW,
  AsteroidsShooter,
  threejs,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Web Developer",
    icon: web,
  },
  {
    title: "React Native Developer",
    icon: mobile,
  },
  {
    title: "Backend Developer",
    icon: backend,
  },
  {
    title: "Unity Developer",
    icon: unity,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "docker",
    icon: docker,
  },
];

const experiences = [
  {
    title: "Unity Game Developer Intern",
    company_name: "National Capital Region Transport Corporation",
    icon: NCRTCLOGO, // You'll need to import this icon
    iconBg: "#383E56",
    date: "September 2024 - October 2024",
    points: [
      "Gained hands-on experience with Unity game engine and C# programming",
      "Implemented physics-based interactions and coroutines for dynamic game mechanics",
      "Worked with 3D models and Unity Physics principles for interactive simulations",
      "Collaborated with technical teams to develop and optimize game features",
    ],
  },
  {
    title: "Subject Matter Expert",
    company_name: "Physics Wallah",
    icon: PW, // You'll need to import this icon
    iconBg: "#E6DEDD",
    date: "May 2022 - September 2022",
    points: [
      "Provided expert guidance in Physics and Mathematics for JEE Mains and NEET students",
      "Developed comprehensive study materials and problem-solving strategies",
      "Mentored students to improve their understanding of complex concepts",
      "Created personalized learning plans based on individual student needs",
    ],
  },
];

const certifications = [
  {
    name: "Certified React Developer",
    organization: "Meta",
    date: "June 2023",
    image: "PW",
  },
  {
    name: "Unity Game Development Certification",
    organization: "Unity Technologies",
    date: "April 2022",
    image: "https://example.com/unity-cert.png",
  },
];

/*
const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Rick does.",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];
*/

const projects = [
/* {
    name: "Car Rent",
    description:
      "Web-based platform that allows users to search, book, and manage car rentals from various providers, providing a convenient and efficient solution for transportation needs.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "mongodb",
        color: "green-text-gradient",
      },
      {
        name: "tailwind",
        color: "pink-text-gradient",
      },
    ],
    image: carrent,
    source_code_link: "https://github.com/",
  },
  {
    name: "Job IT",
    description:
      "Web application that enables users to search for job openings, view estimated salary ranges for positions, and locate available jobs based on their current location.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "restapi",
        color: "green-text-gradient",
      },
      {
        name: "scss",
        color: "pink-text-gradient",
      },
    ],
    image: jobit,
    source_code_link: "https://github.com/",
  },
  {
    name: "Trip Guide",
    description:
      "A comprehensive travel booking platform that allows users to book flights, hotels, and rental cars, and offers curated recommendations for popular destinations.",
    tags: [
      {
        name: "nextjs",
        color: "blue-text-gradient",
      },
      {
        name: "supabase",
        color: "green-text-gradient",
      },
      {
        name: "css",
        color: "pink-text-gradient",
      },
    ],
    image: tripguide,
    source_code_link: "https://github.com/",
  },*/

  {
    name: "Asteroids Shooter",
    description:
      "Asteroid Shooter is a Unity-powered game built with C#, where players control a gun to defend against falling asteroids. Using left-click, players destroy asteroids with a beam, while right-click causes them to fall strategically. The project showcases dynamic gameplay mechanics and efficient physics-based interactions.",
    tags: [
      {
        name: "Unity",
        color: "blue-text-gradient",
      },
      {
        name: "Unity Assets Store",
        color: "green-text-gradient",
      },
      {
        name: "C#",
        color: "pink-text-gradient",
      },
    ],
    image: AsteroidsShooter,
    source_code_link: "https://aryansharma2204.itch.io/asteroids-shooter",
    platform: "itchio",
  },
];

export { services, technologies, experiences, certifications/*testimonials*/, projects };
