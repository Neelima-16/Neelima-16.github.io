import "./styles/Work.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MdArrowOutward, MdClose } from "react-icons/md";
import { FaStar, FaCodeBranch, FaUsers, FaGithub } from "react-icons/fa6";
import { config } from "../config";

gsap.registerPlugin(ScrollTrigger);

const CACHE_KEY = "portfolio_github_projects_cache";

interface GithubApiRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  stargazers_count?: number;
  forks_count?: number;
  contributors_url?: string;
  owner?: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
}

export interface ContributorItem {
  login: string;
  avatarUrl: string;
  url: string;
  contributions?: number;
}

export interface ProjectItem {
  id: number | string;
  title: string;
  description: string;
  technologies: string;
  url: string;
  stars?: number;
  forks?: number;
  contributors?: ContributorItem[];
}

const formatTitle = (name: string): string => {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
};

const getRepoDescription = (_name: string, desc?: string | null): string => {
  if (desc && desc.trim().length > 0) return desc;
  return "Engineering and software development project exploring modern web technologies.";
};

const defaultContributors: ContributorItem[] = [
  {
    login: config.social.github || "Neelima-16",
    avatarUrl: "https://avatars.githubusercontent.com/u/196938545?v=4",
    url: `https://github.com/${config.social.github || "Neelima-16"}`,
    contributions: 1,
  },
];

const fallbackProjects: ProjectItem[] = [
  {
    id: 1,
    title: "AI Medical Diagnosis",
    description: "Deep learning based clinical diagnostic assistant with multi-modal medical imaging analysis.",
    technologies: "Python, PyTorch",
    url: `https://github.com/${config.social.github || "Neelima-16"}`,
    contributors: defaultContributors,
  },
  {
    id: 2,
    title: "Autonomous Agent System",
    description: "Multi-agent framework utilizing LLMs for autonomous research, task orchestration, and tool execution.",
    technologies: "Python, LangChain",
    url: `https://github.com/${config.social.github || "Neelima-16"}`,
    contributors: defaultContributors,
  },
  {
    id: 3,
    title: "Neural Vision Studio",
    description: "Interactive computer vision platform for real-time object detection and segmentation.",
    technologies: "TypeScript, React, OpenCV",
    url: `https://github.com/${config.social.github || "Neelima-16"}`,
    contributors: defaultContributors,
  },
  {
    id: 4,
    title: "FullStack ECommerce Platform",
    description: "Modern, responsive e-commerce web application featuring secure auth and database integration.",
    technologies: "React, Node.js, MongoDB",
    url: `https://github.com/${config.social.github || "Neelima-16"}`,
    contributors: defaultContributors,
  },
  {
    id: 5,
    title: "Algorithm Visualizer 3D",
    description: "Interactive WebGL visualization tool demonstrating graph search and sorting algorithms.",
    technologies: "TypeScript, Three.js",
    url: `https://github.com/${config.social.github || "Neelima-16"}`,
    contributors: defaultContributors,
  },
];

const getInitialProjects = (): ProjectItem[] => {
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore cache parse error
    }
  }
  return fallbackProjects;
};

const Work = () => {
  const [projects, setProjects] = useState<ProjectItem[]>(getInitialProjects);
  const [selectedProjectForContributors, setSelectedProjectForContributors] =
    useState<ProjectItem | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProjectForContributors(null);
      }
    };
    if (selectedProjectForContributors) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedProjectForContributors]);

  useEffect(() => {
    const githubUser = config.social.github || "Neelima-16";
    fetch(`https://api.github.com/users/${githubUser}/repos?sort=updated&per_page=20`)
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
        return res.json();
      })
      .then(async (data: GithubApiRepo[] | { message?: string }) => {
        if (Array.isArray(data)) {
          const filteredRepos = data.filter(
            (repo) => !repo.name.toLowerCase().startsWith(githubUser.toLowerCase())
          );
          if (filteredRepos.length > 0) {
            const topRepos = filteredRepos.slice(0, 6);

            // Fetch live contributors dynamically for each repo from GitHub
            try {
              const withContributors = await Promise.all(
                topRepos.map(async (repo) => {
                  try {
                    let contributors: ContributorItem[] = [];
                    try {
                      const cRes = await fetch(
                        repo.contributors_url ||
                          `https://api.github.com/repos/${githubUser}/${repo.name}/contributors`
                      );
                      if (cRes.ok) {
                        const cData = await cRes.json();
                        if (Array.isArray(cData) && cData.length > 0) {
                          contributors = cData.map((c: any) => ({
                            login: c.login,
                            avatarUrl: c.avatar_url,
                            url: c.html_url,
                            contributions: c.contributions,
                          }));
                        }
                      }
                    } catch {
                      // Handled by fallback below
                    }

                    if (contributors.length === 0) {
                      contributors = [
                        {
                          login: repo.owner?.login || githubUser,
                          avatarUrl:
                            repo.owner?.avatar_url ||
                            "https://avatars.githubusercontent.com/u/196938545?v=4",
                          url:
                            repo.owner?.html_url ||
                            `https://github.com/${githubUser}`,
                          contributions: 1,
                        },
                      ];
                    }

                    return {
                      id: repo.id,
                      title: formatTitle(repo.name),
                      description: getRepoDescription(repo.name, repo.description),
                      technologies: repo.language || "TypeScript / Full-Stack",
                      url: repo.html_url,
                      stars: repo.stargazers_count,
                      forks: repo.forks_count,
                      contributors,
                    };
                  } catch {
                    return null;
                  }
                })
              );

              const valid = withContributors.filter(Boolean) as ProjectItem[];
              if (valid.length > 0) {
                setProjects(valid);
                try {
                  localStorage.setItem(CACHE_KEY, JSON.stringify(valid));
                } catch {
                  // Ignore localStorage errors
                }
              }
            } catch (cErr) {
              console.warn("Could not fetch all contributors:", cErr);
            }
          }
        }
      })
      .catch((err) => {
        console.warn("Using cached projects due to GitHub API error:", err);
        try {
          const cached = localStorage.getItem(CACHE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setProjects(parsed);
            }
          }
        } catch {
          // Ignore
        }
      });
  }, []);

  useEffect(() => {
    // Disable pinning on mobile to allow scrolling
    if (window.innerWidth <= 768) return;
    if (projects.length === 0) return;

    const setupScroll = () => {
      const workFlex = document.querySelector(".work-flex") as HTMLElement;
      const ctaBox = document.querySelector(".work-box-cta") as HTMLElement;
      if (!workFlex || !ctaBox) return null;

      // Reset transform before measuring to ensure accurate bounding rect
      gsap.set(workFlex, { x: 0 });

      const ctaRect = ctaBox.getBoundingClientRect();
      // Center the CTA box in the viewport
      const targetLeft = Math.max((window.innerWidth - ctaBox.offsetWidth) / 2, 80);
      const translateX = Math.max(ctaRect.left - targetLeft, 0);

      // Add a hold / pause distance so "Want to see more?" stays pinned and centered
      // before the next section arrives
      const holdDistance = Math.min(window.innerHeight * 0.6, 500);
      const totalScroll = translateX + holdDistance;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".work-section",
          start: "top top",
          end: `+=${totalScroll}`,
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          id: "work",
          invalidateOnRefresh: true,
        },
      });

      // 1. Horizontal scroll until "Want to see more?" is centered
      timeline.to(workFlex, {
        x: -translateX,
        ease: "none",
        duration: translateX,
      });

      // 2. Hold pinned in place for holdDistance so user can view/click "Explore"
      timeline.to({}, {
        duration: holdDistance,
      });

      return timeline;
    };

    let timeline = setupScroll();

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    const onResize = () => {
      timeline?.kill();
      ScrollTrigger.getById("work")?.kill();
      timeline = setupScroll();
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      timeline?.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, [projects]);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {projects.map((project, index) => (
            <div className="work-box" key={project.id}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.description}</p>
                  </div>
                </div>

                <div className="work-meta">
                  <div className="work-meta-left">
                    <h4>Tools and features</h4>
                    <p>{project.technologies}</p>
                  </div>
                  {((project.stars !== undefined && project.stars > 0) ||
                    (project.forks !== undefined && project.forks > 0) ||
                    (project.contributors !== undefined &&
                      project.contributors.length > 0)) && (
                    <div className="work-stats">
                      {project.stars !== undefined && project.stars > 0 && (
                        <span
                          className="work-stat-badge"
                          title={`${project.stars} stars`}
                        >
                          <FaStar /> {project.stars}
                        </span>
                      )}
                      {project.forks !== undefined && project.forks > 0 && (
                        <span
                          className="work-stat-badge"
                          title={`${project.forks} forks`}
                        >
                          <FaCodeBranch /> {project.forks}
                        </span>
                      )}
                      {project.contributors !== undefined &&
                        project.contributors.length > 0 && (
                          <button
                            type="button"
                            className="work-stat-badge work-stat-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedProjectForContributors(project);
                            }}
                            title={`View ${project.contributors.length} contributor${
                              project.contributors.length > 1 ? "s" : ""
                            }`}
                            data-cursor="disable"
                            aria-label={`View contributors for ${project.title}`}
                          >
                            <FaUsers className="work-stat-icon" />{" "}
                            {project.contributors.length}
                          </button>
                        )}
                    </div>
                  )}
                </div>
              </div>

              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="work-view-link"
                data-cursor="disable"
              >
                View Project <MdArrowOutward />
              </a>
              <div className="work-spacer"></div>
            </div>
          ))}

          {/* See All Works Button */}
          <div className="work-box work-box-cta">
            <div className="see-all-works">
              <h3>Want to see more?</h3>
              <p>Explore all of my projects and creations</p>
              <a
                href={`https://github.com/${config.social.github}`}
                target="_blank"
                rel="noreferrer"
                className="see-all-btn"
                data-cursor="disable"
              >
                Explore →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Project Contributors Modal — Same as sensui-moksha.github.io */}
      {selectedProjectForContributors &&
        createPortal(
          <div
            className="contributors-modal-backdrop"
            onClick={() => setSelectedProjectForContributors(null)}
          >
            <div
              className="contributors-modal-content"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="contributors-modal-title"
            >
              <div className="contributors-modal-header">
                <div className="contributors-modal-title-group">
                  <div className="contributors-icon-box">
                    <FaUsers />
                  </div>
                  <div>
                    <h3
                      id="contributors-modal-title"
                      className="contributors-title"
                    >
                      Project Contributors
                    </h3>
                    <p className="contributors-subtitle">
                      {selectedProjectForContributors.title}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="contributors-close-btn"
                  onClick={() => setSelectedProjectForContributors(null)}
                  aria-label="Close modal"
                  data-cursor="disable"
                >
                  <MdClose />
                </button>
              </div>

              <div className="contributors-list">
                {selectedProjectForContributors.contributors?.map(
                  (contributor) => (
                    <a
                      key={contributor.login}
                      href={contributor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contributor-card"
                      data-cursor="disable"
                    >
                      <div className="contributor-avatar-wrap">
                        <img
                          src={contributor.avatarUrl}
                          alt={`${contributor.login} avatar`}
                          className="contributor-avatar"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              contributor.login
                            )}&background=c2a4ff&color=0b080c&bold=true`;
                          }}
                        />
                        <span className="contributor-github-badge">
                          <FaGithub />
                        </span>
                      </div>
                      <div className="contributor-info">
                        <span className="contributor-name">
                          @{contributor.login}
                        </span>
                        {contributor.contributions ? (
                          <span className="contributor-count">
                            {contributor.contributions}{" "}
                            {contributor.contributions === 1
                              ? "commit"
                              : "commits"}
                          </span>
                        ) : (
                          <span className="contributor-count">Contributor</span>
                        )}
                      </div>
                      <div className="contributor-action">
                        <span>View Profile</span>
                        <MdArrowOutward />
                      </div>
                    </a>
                  )
                )}
              </div>

              <div className="contributors-modal-footer">
                <a
                  href={`${selectedProjectForContributors.url}/graphs/contributors`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contributors-insights-link"
                  data-cursor="disable"
                >
                  <span>View Full Contributors Insights on GitHub</span>
                  <MdArrowOutward />
                </a>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Work;


