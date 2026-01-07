import React, { useEffect, useRef } from "react";

export const DNAWavyBackground = ({ children, style, ...props }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Animation variables
    let time = 0;
    
    // DNA helix parameters
    const helixParams = {
      amplitude: 80,
      frequency: 0.01,
      speed: 0.01,
      helixWidth: 200,
      baseSpacing: 30
    };

    // Colors for DNA theme
    const colors = {
      background: "rgba(240, 253, 250, 0.95)", // Very light mint
      helix1: "rgba(16, 185, 129, 0.3)", // Emerald green
      helix2: "rgba(59, 130, 246, 0.25)", // Blue
      bases: "rgba(16, 185, 129, 0.4)", // Connection lines
      particles: "rgba(16, 185, 129, 0.6)"
    };

    const animate = () => {
      // Clear canvas with light background
      ctx.fillStyle = colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerY = canvas.height * 0.5;
      
      // Draw DNA double helix
      drawDNAHelix(ctx, time, centerY, colors);
      
      // Draw floating DNA particles
      drawFloatingParticles(ctx, time, colors);
      
      // Draw subtle wave overlay
      drawWaveOverlay(ctx, time, colors);

      time += 0.5;
      animationId = requestAnimationFrame(animate);
    };

    const drawDNAHelix = (ctx, time, centerY, colors) => {
      ctx.lineWidth = 3;
      
      // Draw first helix strand
      ctx.beginPath();
      ctx.strokeStyle = colors.helix1;
      for (let x = 0; x <= canvas.width; x += 2) {
        const y1 = centerY + Math.sin(x * helixParams.frequency + time * helixParams.speed) * helixParams.amplitude;
        if (x === 0) {
          ctx.moveTo(x, y1);
        } else {
          ctx.lineTo(x, y1);
        }
      }
      ctx.stroke();

      // Draw second helix strand (opposite phase)
      ctx.beginPath();
      ctx.strokeStyle = colors.helix2;
      for (let x = 0; x <= canvas.width; x += 2) {
        const y2 = centerY + Math.sin(x * helixParams.frequency + time * helixParams.speed + Math.PI) * helixParams.amplitude;
        if (x === 0) {
          ctx.moveTo(x, y2);
        } else {
          ctx.lineTo(x, y2);
        }
      }
      ctx.stroke();

      // Draw base pairs (connecting lines)
      ctx.lineWidth = 2;
      ctx.strokeStyle = colors.bases;
      for (let x = 0; x <= canvas.width; x += helixParams.baseSpacing) {
        const y1 = centerY + Math.sin(x * helixParams.frequency + time * helixParams.speed) * helixParams.amplitude;
        const y2 = centerY + Math.sin(x * helixParams.frequency + time * helixParams.speed + Math.PI) * helixParams.amplitude;
        
        ctx.beginPath();
        ctx.moveTo(x, y1);
        ctx.lineTo(x, y2);
        ctx.stroke();
        
        // Draw base pair dots
        ctx.fillStyle = colors.particles;
        ctx.beginPath();
        ctx.arc(x, y1, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x, y2, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawFloatingParticles = (ctx, time, colors) => {
      ctx.fillStyle = colors.particles;
      
      for (let i = 0; i < 30; i++) {
        const x = (i * 50 + Math.sin(time * 0.01 + i) * 20) % canvas.width;
        const y = (i * 30 + Math.cos(time * 0.015 + i) * 15) % canvas.height;
        const size = 2 + Math.sin(time * 0.02 + i) * 1;
        
        ctx.globalAlpha = 0.4 + Math.sin(time * 0.01 + i) * 0.3;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const drawWaveOverlay = (ctx, time, colors) => {
      // Subtle wave overlay for depth
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      
      for (let x = 0; x <= canvas.width; x += 2) {
        const y = canvas.height * 0.8 + Math.sin(x * 0.005 + time * 0.008) * 40;
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      
      const gradient = ctx.createLinearGradient(0, canvas.height * 0.7, 0, canvas.height);
      gradient.addColorStop(0, "rgba(16, 185, 129, 0.1)");
      gradient.addColorStop(1, "rgba(16, 185, 129, 0.05)");
      
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  const containerStyle = {
    position: "relative",
    width: "100%",
    minHeight: "100vh",
    overflow: "hidden",
    backgroundColor: "#f8fafc", // Light blue-gray background
    ...style
  };

  const canvasStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 0
  };

  const contentStyle = {
    position: "relative",
    zIndex: 1,
    width: "100%",
    height: "100%"
  };

  return (
    <div style={containerStyle} {...props}>
      <canvas ref={canvasRef} style={canvasStyle} />
      <div style={contentStyle}>
        {children}
      </div>
    </div>
  );
};