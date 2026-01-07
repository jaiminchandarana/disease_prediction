import React from 'react';

const Explain = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">
                <i className="fas fa-info-circle me-2"></i>
                Disease Prediction Explanation
              </h2>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <h4 className="text-primary mb-3">How Our Disease Prediction System Works</h4>
                  
                  <div className="accordion" id="explanationAccordion">
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingOne">
                        <button 
                          className="accordion-button" 
                          type="button" 
                          data-bs-toggle="collapse" 
                          data-bs-target="#collapseOne"
                        >
                          <strong>1. Symptom Analysis</strong>
                        </button>
                      </h2>
                      <div id="collapseOne" className="accordion-collapse collapse show">
                        <div className="accordion-body">
                          Our system analyzes the symptoms you provide and compares them against 
                          a comprehensive medical database. Each symptom is weighted based on its 
                          relevance to different diseases.
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingTwo">
                        <button 
                          className="accordion-button collapsed" 
                          type="button" 
                          data-bs-toggle="collapse" 
                          data-bs-target="#collapseTwo"
                        >
                          <strong>2. Machine Learning Algorithm</strong>
                        </button>
                      </h2>
                      <div id="collapseTwo" className="accordion-collapse collapse">
                        <div className="accordion-body">
                          We use advanced machine learning algorithms trained on medical data 
                          to identify patterns and correlations between symptoms and diseases. 
                          The model considers multiple factors simultaneously.
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingThree">
                        <button 
                          className="accordion-button collapsed" 
                          type="button" 
                          data-bs-toggle="collapse" 
                          data-bs-target="#collapseThree"
                        >
                          <strong>3. Probability Calculation</strong>
                        </button>
                      </h2>
                      <div id="collapseThree" className="accordion-collapse collapse">
                        <div className="accordion-body">
                          The system calculates probability scores for different diseases based 
                          on your symptoms. Higher scores indicate a stronger match between 
                          your symptoms and the disease profile.
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingFour">
                        <button 
                          className="accordion-button collapsed" 
                          type="button" 
                          data-bs-toggle="collapse" 
                          data-bs-target="#collapseFour"
                        >
                          <strong>4. Results & Recommendations</strong>
                        </button>
                      </h2>
                      <div id="collapseFour" className="accordion-collapse collapse">
                        <div className="accordion-body">
                          Based on the analysis, we provide you with the most likely diseases 
                          and recommend appropriate next steps, including when to consult 
                          with healthcare professionals.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="alert alert-warning mt-4">
                    <h5 className="alert-heading">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      Important Disclaimer
                    </h5>
                    <p className="mb-0">
                      This system is designed to assist in preliminary health assessment only. 
                      It is not a substitute for professional medical diagnosis or treatment. 
                      Always consult with qualified healthcare professionals for accurate 
                      diagnosis and appropriate medical care.
                    </p>
                  </div>

                  <div className="text-center mt-4">
                    <a href="/predict" className="btn btn-primary btn-lg">
                      <i className="fas fa-stethoscope me-2"></i>
                      Try Disease Prediction
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explain;