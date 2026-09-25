import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import Lenis from "lenis";
import "./styles/Navbar.css";
import { config } from "../config";

gsap.registerPlugin(ScrollTrigger);
export let lenis: Lenis | null = null;

const Navbar = () => {
  const [hasOrgs, setHasOrgs] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("portfolio_github_orgs_cache_v3");
        if (cached) {
          const parsed = JSON.parse(cached);
          return Array.isArray(parsed) && parsed.length > 0;
        }
      } catch {
        // Ignore cache parse errors
      }
    }
    return Boolean(
      (config as unknown as { organizations?: unknown[] }).organizations?.length
    );
  });

  useEffect(() => {
    const handleOrgsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      setHasOrgs((customEvent.detail ?? 0) > 0);
    };

    window.addEventListener("portfolio-orgs-updated", handleOrgsUpdate);
    return () => {
      window.removeEventListener("portfolio-orgs-updated", handleOrgsUpdate);
    };
  }, []);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    lenis = new Lenis({
      duration: 1.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.7,
      touchMultiplier: 2,
      infinite: false,
    });

    // Start paused
    lenis.stop();

    // Handle smooth scroll animation frame
    let rafId: number;
    function raf(time: number) {
      lenis?.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Event delegation for navigation links (supports dynamically added/removed tabs)
    const navUl = document.querySelector(".header ul");
    const handleNavClick = (e: MouseEvent) => {
      const targetAnchor = (e.target as HTMLElement).closest("a");
      if (!targetAnchor || !navUl?.contains(targetAnchor)) return;

      if (window.innerWidth > 1024) {
        e.preventDefault();
        const section = targetAnchor.getAttribute("data-href");
        if (section && lenis) {
          const target = document.querySelector(section) as HTMLElement;
          if (target) {
            lenis.scrollTo(target, {
              offset: 0,
              duration: 1.5,
            });
          }
        }
      }
    };

    navUl?.addEventListener("click", handleNavClick as EventListener);

    // Handle resize
    const handleResize = () => {
      lenis?.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      navUl?.removeEventListener("click", handleNavClick as EventListener);
      window.removeEventListener("resize", handleResize);
      lenis?.destroy();
    };
  }, []);

  const initials = config.developer.fullName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("") || "KN";

  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          {initials}
        </a>
        <a
          href={`mailto:${config.contact.email}`}
          className="navbar-connect"
          data-cursor="disable"
        >
          {config.contact.email}
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#career" href="#career">
              <HoverLinks text="CAREER" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          {hasOrgs && (
            <li>
              <a data-href="#organizations" href="#organizations">
                <HoverLinks text="ORGS" />
              </a>
            </li>
          )}
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
