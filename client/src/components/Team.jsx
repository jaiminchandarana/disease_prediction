import React from "react";

const Team = () => {
  return (
    <section id="team" className="py-5 bg-light">
      <div className="container text-center">
        <h2 className="fw-bold text-dark mb-5">Our Team</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <img src="/api/placeholder/400/400" className="card-img-top" alt="Team Member" />
              <div className="card-body">
                <h5 className="card-title">Dr. John Doe</h5>
                <p className="card-text text-muted">Chief Medical Officer</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <img src="/api/placeholder/400/400" className="card-img-top" alt="Team Member" />
              <div className="card-body">
                <h5 className="card-title">Jane Smith</h5>
                <p className="card-text text-muted">Lead Data Scientist</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <img src="/api/placeholder/400/400" className="card-img-top" alt="Team Member" />
              <div className="card-body">
                <h5 className="card-title">Michael Johnson</h5>
                <p className="card-text text-muted">Software Architect</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
