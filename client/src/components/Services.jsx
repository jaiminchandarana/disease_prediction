import React from "react";

const Services = () => {
  return (
    <section id="services" className="py-5 position-relative" style={{ background: "transparent", overflow: "hidden" }}>
      <div className="container text-center position-relative">
        <h2 className="fw-bold text-dark mb-5">Our Services</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title">Disease Prediction</h5>
                <p className="card-text text-muted">
                  AI-driven predictions based on patient symptoms and medical history.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title">Doctor Dashboard</h5>
                <p className="card-text text-muted">
                  Manage patients, view prediction history, and generate reports with insights.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title">Admin Panel</h5>
                <p className="card-text text-muted">
                  Full control over doctors, patients, and prediction records with analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
