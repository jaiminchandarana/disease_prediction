import React, { useState, useRef } from 'react'
import { useAuth } from '../auth/AuthContext'
import { FaUpload, FaImage, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaDownload, FaShare } from 'react-icons/fa'
import toast from 'react-hot-toast'

const ImageAnalysis = () => {
  const { user } = useAuth()
  const [uploadedImages, setUploadedImages] = useState([])
  const [analysisResults, setAnalysisResults] = useState([])
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files)
    
    files.forEach(file => {
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const newImage = {
            id: Date.now() + Math.random(),
            file: file,
            preview: e.target.result,
            name: file.name,
            size: file.size,
            uploadTime: new Date()
          }
          setUploadedImages(prev => [...prev, newImage])
          toast.success(`${file.name} uploaded successfully`)
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const analyzeImages = async () => {
    if (uploadedImages.length === 0) {
      toast.error('Please upload at least one image to analyze')
      return
    }

    setLoading(true)
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 4000))
      
      const mockResults = uploadedImages.map(image => ({
        imageId: image.id,
        imageName: image.name,
        findings: [
          {
            condition: 'Inflammatory Changes',
            confidence: 87,
            description: 'Visible inflammatory markers detected in the tissue',
            severity: 'Moderate',
            recommendations: [
              'Consider anti-inflammatory treatment',
              'Monitor patient response',
              'Follow-up imaging in 2 weeks'
            ]
          },
          {
            condition: 'Tissue Abnormality',
            confidence: 72,
            description: 'Unusual tissue pattern requiring further investigation',
            severity: 'Mild',
            recommendations: [
              'Additional diagnostic tests recommended',
              'Biopsy consideration if symptoms persist',
              'Patient education on warning signs'
            ]
          }
        ],
        technicalAnalysis: {
          imageQuality: 'Good',
          resolution: '1920x1080',
          contrastLevel: 'Adequate',
          artifacts: 'Minimal motion artifacts detected'
        },
        aiConfidence: 85,
        processingTime: '3.2 seconds'
      }))

      setAnalysisResults(mockResults)
      toast.success('Image analysis completed successfully!')
    } catch (error) {
      toast.error('Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const removeImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId))
    setAnalysisResults(prev => prev.filter(result => result.imageId !== imageId))
    toast.success('Image removed')
  }

  const downloadReport = (result) => {
    // Mock report generation
    const reportData = {
      patientId: 'P12345',
      doctor: user.name,
      analysisDate: new Date().toLocaleString(),
      imageName: result.imageName,
      findings: result.findings,
      technicalAnalysis: result.technicalAnalysis
    }
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", `analysis_report_${result.imageName}.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
    
    toast.success('Report downloaded successfully')
  }

  return (
    <div className="container-fluid p-4">
      <div className="row">
        {/* Upload Section */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-lg">
            <div className="card-header bg-primary text-white py-3">
              <h5 className="mb-0 fw-bold">
                <FaImage className="me-2" />
                Medical Image Analysis
              </h5>
              <small className="opacity-75">AI-powered diagnostic imaging assistance</small>
            </div>
            
            <div className="card-body p-4">
              {/* Upload Area */}
              <div 
                className="border-2 border-dashed border-primary rounded p-5 text-center mb-4"
                style={{ cursor: 'pointer' }}
                onClick={() => fileInputRef.current?.click()}
              >
                <FaUpload className="text-primary mb-3" size={48} />
                <h6 className="text-primary mb-2">Click to Upload Medical Images</h6>
                <p className="text-muted small mb-0">
                  Supports: X-rays, CT scans, MRI, Ultrasound images<br />
                  Max file size: 50MB per image
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />

              {/* Uploaded Images */}
              {uploadedImages.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Uploaded Images ({uploadedImages.length})</h6>
                  <div className="row g-3">
                    {uploadedImages.map((image) => (
                      <div key={image.id} className="col-md-6">
                        <div className="card border">
                          <img 
                            src={image.preview} 
                            className="card-img-top" 
                            alt={image.name}
                            style={{ height: '150px', objectFit: 'cover' }}
                          />
                          <div className="card-body p-2">
                            <small className="fw-semibold d-block">{image.name}</small>
                            <small className="text-muted">
                              {(image.size / 1024 / 1024).toFixed(2)} MB
                            </small>
                            <button 
                              className="btn btn-sm btn-outline-danger float-end"
                              onClick={() => removeImage(image.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Analysis Button */}
              <div className="d-grid">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={analyzeImages}
                  disabled={loading || uploadedImages.length === 0}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="me-2 spinner-border spinner-border-sm" />
                      Analyzing Images...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="me-2" />
                      Start AI Analysis
                    </>
                  )}
                </button>
              </div>

              {/* Disclaimer */}
              <div className="alert alert-warning border-0 mt-4">
                <FaExclamationTriangle className="me-2" />
                <strong>Clinical Decision Support:</strong>
                <br />
                <small>
                  This AI tool provides diagnostic assistance and should be used alongside clinical judgment. 
                  All findings require professional medical interpretation.
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-lg">
            <div className="card-header bg-success text-white py-3">
              <h5 className="mb-0 fw-bold">Analysis Results</h5>
              <small className="opacity-75">AI diagnostic findings and recommendations</small>
            </div>
            
            <div className="card-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {analysisResults.length === 0 ? (
                <div className="text-center py-5">
                  <FaImage className="text-muted mb-3" size={64} />
                  <h6 className="text-muted">No analysis results yet</h6>
                  <p className="text-muted small">Upload and analyze images to see results here</p>
                </div>
              ) : (
                analysisResults.map((result) => (
                  <div key={result.imageId} className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="fw-bold mb-0">{result.imageName}</h6>
                      <div className="btn-group">
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => downloadReport(result)}
                        >
                          <FaDownload className="me-1" />
                          Report
                        </button>
                        <button className="btn btn-sm btn-outline-secondary">
                          <FaShare className="me-1" />
                          Share
                        </button>
                      </div>
                    </div>

                    {/* AI Confidence */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <small className="fw-semibold">AI Confidence</small>
                        <small className="text-muted">{result.aiConfidence}%</small>
                      </div>
                      <div className="progress" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar bg-success" 
                          style={{ width: `${result.aiConfidence}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Findings */}
                    <div className="mb-3">
                      <h6 className="fw-bold mb-2">Clinical Findings</h6>
                      {result.findings.map((finding, index) => (
                        <div key={index} className="card border-start border-4 border-warning mb-2">
                          <div className="card-body p-3">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="mb-1">{finding.condition}</h6>
                              <span className={`badge ${
                                finding.severity === 'High' ? 'bg-danger' :
                                finding.severity === 'Moderate' ? 'bg-warning text-dark' :
                                'bg-success'
                              }`}>
                                {finding.severity}
                              </span>
                            </div>
                            <p className="small text-muted mb-2">{finding.description}</p>
                            <small className="fw-semibold text-primary">Confidence: {finding.confidence}%</small>
                            
                            {/* Recommendations */}
                            <div className="mt-2">
                              <small className="fw-semibold d-block mb-1">Recommendations:</small>
                              {finding.recommendations.map((rec, recIndex) => (
                                <small key={recIndex} className="d-block text-muted">
                                  • {rec}
                                </small>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Technical Analysis */}
                    <div className="card bg-light">
                      <div className="card-body p-3">
                        <h6 className="fw-bold mb-2">Technical Analysis</h6>
                        <div className="row g-2">
                          <div className="col-6">
                            <small className="text-muted d-block">Image Quality</small>
                            <small className="fw-semibold">{result.technicalAnalysis.imageQuality}</small>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block">Resolution</small>
                            <small className="fw-semibold">{result.technicalAnalysis.resolution}</small>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block">Contrast</small>
                            <small className="fw-semibold">{result.technicalAnalysis.contrastLevel}</small>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block">Processing Time</small>
                            <small className="fw-semibold">{result.processingTime}</small>
                          </div>
                        </div>
                        <div className="mt-2">
                          <small className="text-muted d-block">Artifacts</small>
                          <small>{result.technicalAnalysis.artifacts}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageAnalysis