import { PropsWithChildren } from "react";
import "./styles/Landing.css";
import { config } from "../config";

const Landing = ({ children }: PropsWithChildren) => {
  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName = nameParts.slice(1).join(" ") || "";

  const titleParts = (config.developer.title || "Engineering Student").split(" ");
  const titleFirst = titleParts[0] || "Engineering";
  const titleSecond = titleParts.slice(1).join(" ") || "Student";
  const article = /^[aeiou]/i.test(titleFirst) ? "An" : "A";

  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              {firstName.toUpperCase()}
              {' '}
              <br />
              {lastName && <span>{lastName.toUpperCase()}</span>}
            </h1>
          </div>
          <div className="landing-info">
            <h3>{article}</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">{titleFirst}</div>
            </h2>
            <h2>
              <div className="landing-h2-info">{titleSecond}</div>
            </h2>
          </div>
          {/* Mobile photo - shows only on mobile when 3D character is hidden */}
          <div className="mobile-photo">
            <img src="/images/mypicnbg.png" alt={config.developer.fullName} />
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
