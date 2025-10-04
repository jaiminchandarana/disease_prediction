import React from "react";
import { DNAWavyBackground } from "./DNAWavyBackground"; // Adjust path if needed

const About = () => {
  return (
    <section id="about" className="py-5 position-relative" style={{ background: "transparent" }}>
      {/* DNA Wavy Background */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none"
      }}>
        <DNAWavyBackground />
      </div>
      {/* Main Content */}
      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <img
              src="/api/placeholder/600/400"
              alt="Healthcare team"
              className="img-fluid rounded-3 shadow"
            />
          </div>
          <div className="col-lg-6">
            <h2 className="fw-bold text-dark mb-4">About Us</h2>
            <p className="text-muted mb-4">
              Wellnex is a smart AI/ML-powered disease prediction software designed for doctors, patients, and administrators. 
              Our mission is to provide secure, reliable, and intelligent healthcare solutions for early disease detection and 
              improved patient outcomes.
            </p>
            <ul className="list-unstyled">
              <li className="mb-2">✔ AI-powered predictions</li>
              <li className="mb-2">✔ Role-based dashboards</li>
              <li className="mb-2">✔ Secure data management</li>
              <li className="mb-2">✔ Patient-doctor interaction</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
