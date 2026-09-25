export const config = {
    developer: {
        name: "Mokshyagna",
        fullName: "Kakulapati Neelima",
        title: "Engineering Student",
        description: "Engineering Student building intelligent systems and modern web applications. Passionate about machine learning, deep learning, and creating next-gen autonomous agents."
    },
    social: {
        github: "Neelima-16",
        email: "theneelimakakulapati@gmail.com",
        location: "Hyderabad"
    },
    about: {
        title: "About Me",
        description: "I'm Neelima Kakulapati, a Computer Science undergraduate who believes technology should solve meaningful problems, not just demonstrate technical skills. My journey began with curiosity about programming and has grown into a passion for building software powered by Python, Artificial Intelligence, and Data Analytics. Every project I work on teaches me something new—whether it's designing intuitive user experiences, analyzing complex datasets, or developing intelligent applications. I enjoy turning ideas into practical solutions through clean architecture, thoughtful design, and continuous learning. Beyond coding, I'm constantly exploring emerging technologies, improving my problem-solving abilities, and preparing myself to become an engineer who creates products that make a real impact."
    },
    experiences: [
        {
            position: "Learning Something New",
            company: "Self-Development",
            period: "2025 - Present",
            location: "Hyderabad",
            description: "Continuously exploring emerging technologies, researching advanced AI systems, and pushing the boundaries of what's possible in tech.",
            responsibilities: [
                "Researching cutting-edge AI and ML technologies",
                "Experimenting with new frameworks and tools",
                "Contributing to open-source projects",
                "Building innovative personal projects"
            ],
            technologies: ["Research", "Innovation", "Open Source", "New Tech"]
        },
        {
            position: "AI & Full-Stack Developer",
            company: "Freelance & Projects",
            period: "2025",
            location: "Hyderabad",
            description: "Building intelligent AI systems and full-stack web applications. Developing ML models, LLM-powered tools, and responsive web apps as part of freelance and self-initiated projects.",
            responsibilities: [
                "Developing machine learning models with TensorFlow and PyTorch",
                "Building full-stack applications with React and Node.js",
                "Working with LLMs and transformer architectures",
                "Creating and deploying autonomous AI systems"
            ],
            technologies: ["Python", "TensorFlow", "React", "Node.js", "LLMs", "TypeScript"]
        },
        {
            position: "Web Developer",
            company: "Self-Projects",
            period: "2024",
            location: "Hyderabad",
            description: "Started building complete web applications from frontend to backend, creating responsive UIs, RESTful APIs, and integrating databases — all driven by personal projects and curiosity.",
            responsibilities: [
                "Developing full-stack web applications using React and Node.js",
                "Building RESTful APIs and integrating databases",
                "Creating responsive and interactive user interfaces",
                "Deploying and maintaining personal web projects"
            ],
            technologies: ["React", "Node.js", "MongoDB", "Express", "Next.js", "TypeScript"]
        },
        {
            position: "B.Tech. Computer Science Engineering",
            company: "MIC College of Technology",
            period: "2023 - 2027",
            location: "Andhra Pradesh",
            description: "Following graduation from Viswabharathi Junior College, I am pursuing a Bachelor of Technology in Computer Science Engineering at MIC College of Technology in Andhra Pradesh.",
            responsibilities: [
                "Studying core CS fundamentals — algorithms, OS, DBMS, and networking",
                "Applying machine learning and AI concepts to academic and personal projects",
                "Collaborating on full-stack development projects",
                "Actively participating in coding contests and technical events"
            ],
            technologies: ["C++", "Python", "Java", "React", "SQL", "Machine Learning", "DSA"]
        },
        {
            position: "Intermediate — MPC",
            company: "Viswabharathi Junior College",
            period: "2023",
            location: "Andhra Pradesh",
            description: "Following my graduation from Nagarjuna High School, I enrolled in Viswabharathi Junior College in 2021, pursuing a MPC program, and graduated in 2023.",
            responsibilities: [
                "Studied Mathematics, Physics, and Chemistry at an advanced level",
                "Developed strong logical reasoning and analytical thinking",
                "Applied mathematical concepts that underpin algorithms and ML",
                "Graduated in 2023"
            ],
            technologies: ["Mathematics", "Physics", "Chemistry", "Analytical Reasoning"]
        },
        {
            position: "High School Graduation",
            company: "Nagarjuna High School",
            period: "2021",
            location: "Jaggayyapeta, Andhra Pradesh",
            description: "I graduated from Nagarjuna High School, Jaggayyapeta, Andhra Pradesh in 2021.",
            responsibilities: [
                "Completed foundational academics across Science and Mathematics",
                "Developed early interest in computers and technology",
                "Participated in school-level technical and creative activities"
            ],
            technologies: ["Computer Science Basics", "Mathematics", "Science"]
        }
    ],

    contact: {
        email: "theneelimakakulapati@gmail.com",
        github: "https://github.com/Neelima-16",
        linkedin: "https://www.linkedin.com/in/kakulapati-neelima/",
        instagram: "https://www.instagram.com/"
    },
    skills: {
        develop: {
            title: "Artificial Intelligence",
            description: "Curious mind. Endless learner. Builder at heart.",
            details: "I enjoy building intelligent applications by combining Machine Learning, Natural Language Processing, and Generative AI to solve real-world challenges.",
            tools: ["Python", "TensorFlow", "PyTorch", "Hugging Face", "LangChain", "OpenAI API", "LlamaIndex", "MLflow", "Weights & Biases", "Docker", "Kubernetes", "FastAPI", "Streamlit", "Gradio", "ONNX", "Pandas", "NumPy", "Git", "Linux"]
        },
        design: {
            title: "FULL-STACK",
            description: "Modern web development & scalable applications",
            details: "Building responsive and performant web applications using React, Next.js, Node.js, and databases. Creating seamless user experiences with modern UI/UX principles.",
            tools: ["React", "Next.js", "Node.js", "TypeScript", "MongoDB", "PostgreSQL", "TailwindCSS", "REST APIs", "Docker", "Git"]
        }
    }
};

export interface OrgMemberItem {
    login: string;
    avatarUrl: string;
    url: string;
    role?: string;
}

export interface OrgRepoItem {
    name: string;
    description: string;
    url: string;
    language?: string;
    stars?: number;
    forks?: number;
    pushedAt?: string;
    updatedAt?: string;
}

export interface OrganizationItem {
    id: string | number;
    name: string;
    login: string;
    role: string;
    avatarUrl: string;
    url: string;
    description: string;
    location?: string;
    email?: string;
    publicRepos?: number;
    membersCount?: number;
    verified?: boolean;
    members?: OrgMemberItem[];
    repositories?: OrgRepoItem[];
}
