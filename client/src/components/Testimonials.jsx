import React from "react";

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-5">
      <div className="container text-center">
        <h2 className="fw-bold text-dark mb-5">What People Say</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <p className="card-text text-muted">
                  "Wellnex helped me detect my illness early. The prediction was accurate and the process smooth."
                </p>
                <h6 className="fw-bold">Patient A</h6>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <p className="card-text text-muted">
                  "A reliable tool for doctors. It helps us make informed decisions with AI support."
                </p>
                <h6 className="fw-bold">Dr. B</h6>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <p className="card-text text-muted">
                  "As an admin, I can manage everything in one place. Very efficient and user-friendly."
                </p>
                <h6 className="fw-bold">Admin C</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
