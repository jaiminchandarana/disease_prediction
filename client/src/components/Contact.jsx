import React from "react";

const Contact = () => {
  return (
    <section id="contact" className="py-5" style={{ background: "transparent" }}>
      <div className="container">
        <h2 className="fw-bold text-dark mb-4 text-center">Contact Us</h2>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <form className="p-4 shadow rounded bg-white">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input type="text" className="form-control" placeholder="Enter your name" />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" placeholder="Enter your email" />
              </div>
              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea className="form-control" rows="4" placeholder="Enter your message"></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
