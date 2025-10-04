"use client";
import React from "react";
import { Link } from "react-router-dom";
import { DNAWavyBackground } from "./DNAWavyBackground";
import heartImg from "../assets/heart.png";
import medicalAiImg from "../assets/medical-ai.jpg";

const Hero = () => {
  const heroStyles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 0",
    },
    content: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 20px",
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "3rem",
      alignItems: "center",
    },
    textSection: {
      textAlign: "left",
      maxWidth: "600px",
    },
    title: {
      fontSize: "clamp(2.5rem, 6vw, 4rem)",
      fontWeight: "bold",
      color: "#1f2937", // Dark gray
      lineHeight: "1.1",
      marginBottom: "1.5rem",
    },
    highlight: {
      color: "#10b981", // Emerald green to match DNA theme
      fontWeight: "bold",
    },
    description: {
      fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
      color: "#6b7280", // Medium gray
      lineHeight: "1.6",
      marginBottom: "2.5rem",
      maxWidth: "500px",
    },
    buttonContainer: {
      display: "flex",
      gap: "1rem",
      flexWrap: "wrap",
    },
    primaryButton: {
      backgroundColor: "#10b981", // Emerald green
      color: "white",
      fontWeight: "600",
      padding: "0.875rem 2rem",
      borderRadius: "0.375rem",
      textDecoration: "none",
      transition: "all 0.3s ease",
      fontSize: "1rem",
      border: "none",
      cursor: "pointer",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    },
    secondaryButton: {
      backgroundColor: "transparent",
      color: "#6b7280",
      fontWeight: "600",
      padding: "0.875rem 2rem",
      borderRadius: "0.375rem",
      textDecoration: "none",
      transition: "all 0.3s ease",
      fontSize: "1rem",
      border: "2px solid #d1d5db",
      cursor: "pointer",
    },
    imageSection: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    placeholderImage: {
      width: "100%",
      maxWidth: "500px",
      height: "300px",
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      borderRadius: "1rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#10b981",
      fontSize: "1.125rem",
      fontWeight: "500",
      border: "2px dashed rgba(16, 185, 129, 0.3)",
    },
  };

  // Responsive grid
  const mediaQuery = window.matchMedia("(min-width: 1024px)");
  if (mediaQuery.matches) {
    heroStyles.content.gridTemplateColumns = "1fr 1fr";
    heroStyles.textSection.textAlign = "left";
  }

  return (
    <DNAWavyBackground style={heroStyles.container}>
      <div style={heroStyles.content}>
        {/* Text Content */}
        <div style={heroStyles.textSection}>
          <h1 style={heroStyles.title}>
            Empowering Prevention Through{" "}
            <span style={heroStyles.highlight}>Prediction</span>
          </h1>
          <p style={heroStyles.description}>
            Our AI/ML-powered tool supports early diagnosis and medical
            decision-making, providing doctors, patients, and administrators with
            secure, accessible, and fast predictive tools, reports, records, and
            booking systems.
          </p>
          <div style={heroStyles.buttonContainer}>
            <Link
              to="/register"
              style={heroStyles.primaryButton}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#059669";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow =
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#10b981";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow =
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
              }}
            >
              Get Started
            </Link>
            <Link
              to="#about"
              style={heroStyles.secondaryButton}
              onMouseEnter={(e) => {
                e.target.style.borderColor = "#10b981";
                e.target.style.color = "#10b981";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = "#d1d5db";
                e.target.style.color = "#6b7280";
              }}
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Image/Visual Section */}
        <div style={heroStyles.imageSection}>
          <img
            src={medicalAiImg}
            alt="Medical AI Technology"
            style={{
              width: "100%",
              maxWidth: "500px",
              height: "300px",
              objectFit: "cover",
              borderRadius: "1rem",
              border: "none",
              backgroundColor: "transparent",
            }}
          />
        </div>
      </div>
    </DNAWavyBackground>
  );
};

export default Hero;