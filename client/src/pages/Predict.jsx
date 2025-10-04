import React, { useState, useEffect, useRef } from 'react'
import { Bot, Send, Image, FileText, Loader2, X, CheckCircle, AlertTriangle, Stethoscope, Phone, MapPin, Download, Share2, TrendingUp } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'

// Toast notification component (replaces react-hot-toast)
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = type === 'success' ? 'bg-success' : type === 'error' ? 'bg-danger' : 'bg-info'
  
  return (
    <div className={`position-fixed top-0 end-0 m-3 ${bgColor} text-white px-4 py-3 rounded shadow-lg`} 
         style={{ zIndex: 9999 }}>
      <div className="d-flex align-items-center gap-2">
        <span>{message}</span>
        <X size={16} style={{ cursor: 'pointer' }} onClick={onClose} />
      </div>
    </div>
  )
}

const Predict = () => {
  // Mock user data - replace with your actual auth context
  const { user } = useAuth()

  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversation, setConversation] = useState({ stage: 'greeting', data: {} })
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [analysisResults, setAnalysisResults] = useState(null)
  const [toast, setToast] = useState(null)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Internal Medicine",
      rating: 4.8,
      availability: "Available Today",
      phone: "+1 (555) 123-4567",
      location: "Downtown Medical Center"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Emergency Medicine",
      rating: 4.9,
      availability: "Available Tomorrow",
      phone: "+1 (555) 987-6543",
      location: "City Hospital"
    },
    {
      id: 3,
      name: "Dr. Emily Davis",
      specialty: "Family Medicine",
      rating: 4.7,
      availability: "Available Today",
      phone: "+1 (555) 456-7890",
      location: "Community Health Clinic"
    }
  ]

  useEffect(() => {
    initializeChat()
  }, [user?.role])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const initializeChat = () => {
    let greeting = ""
    let followUp = ""
    
    switch(user?.role) {
      case 'doctor':
        greeting = `Welcome, Dr. ${user.name}! I'm your clinical AI assistant. I can help you analyze patient symptoms, review medical images/reports, and provide differential diagnoses.`
        followUp = "Please describe the patient's presenting symptoms, or upload medical images/reports for analysis."
        break
      case 'patient':
        greeting = `Hello ${user.name}! I'm your AI Health Assistant. I'll ask you some questions to better understand your health concerns and provide personalized recommendations.`
        followUp = "Let's start: What is your main health concern or symptom today?"
        break
      case 'admin':
        greeting = `Welcome, ${user.name}. I can analyze system data, patient query trends, and provide healthcare management insights.`
        followUp = "What would you like to explore? (e.g., patient trends, system performance, department analytics)"
        break
      default:
        greeting = "Welcome! How can I help you today?"
        followUp = ""
    }
    
    addMessage(greeting, 'ai')
    if (followUp) {
      setTimeout(() => {
        addMessage(followUp, 'ai')
        setConversation({ 
          stage: user?.role === 'patient' ? 'initial_concern' : 'open_query', 
          data: {} 
        })
      }, 1000)
    }
  }

  const addMessage = (text, sender, metadata = {}) => {
    const message = {
      id: Date.now() + Math.random(),
      text,
      sender,
      timestamp: new Date(),
      ...metadata
    }
    setMessages(prev => [...prev, message])
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && uploadedFiles.length === 0) return

    const userMsg = inputMessage.trim()
    addMessage(userMsg, 'user')
    setInputMessage('')
    setIsTyping(true)

    setTimeout(async () => {
      await processConversation(userMsg)
      setIsTyping(false)
    }, 1500)
  }

  const processConversation = async (userInput) => {
    const stage = conversation.stage
    const data = { ...conversation.data }

    switch(user?.role) {
      case 'patient':
        await handlePatientConversation(userInput, stage, data)
        break
      case 'doctor':
        await handleDoctorConversation(userInput, stage, data)
        break
      case 'admin':
        await handleAdminConversation(userInput, stage, data)
        break
      default:
        addMessage("I'm here to help. Please describe your concern.", 'ai')
    }
  }

  const handlePatientConversation = async (input, stage, data) => {
    switch(stage) {
      case 'initial_concern':
        data.primaryConcern = input
        addMessage("I understand. How long have you been experiencing this?", 'ai')
        setConversation({ stage: 'duration', data })
        break

      case 'duration':
        data.duration = input
        addMessage("On a scale of 1-10, how severe would you rate your symptoms? (1 = very mild, 10 = unbearable)", 'ai')
        setConversation({ stage: 'severity', data })
        break

      case 'severity':
        data.severity = input
        
        if (data.primaryConcern.toLowerCase().includes('fever') || 
            data.primaryConcern.toLowerCase().includes('temperature')) {
          addMessage("Have you measured your temperature? If yes, what was it?", 'ai')
          setConversation({ stage: 'fever_details', data })
        } else if (data.primaryConcern.toLowerCase().includes('pain')) {
          addMessage("Can you describe the type of pain? (e.g., sharp, dull, throbbing, constant)", 'ai')
          setConversation({ stage: 'pain_details', data })
        } else if (data.primaryConcern.toLowerCase().includes('cough') || 
                   data.primaryConcern.toLowerCase().includes('breathing')) {
          addMessage("Are you experiencing any difficulty breathing or shortness of breath?", 'ai')
          setConversation({ stage: 'respiratory_details', data })
        } else {
          addMessage("Are you experiencing any other symptoms along with this? (e.g., fever, fatigue, nausea)", 'ai')
          setConversation({ stage: 'additional_symptoms', data })
        }
        break

      case 'fever_details':
      case 'pain_details':
      case 'respiratory_details':
        data[stage] = input
        addMessage("Are you currently taking any medications for this?", 'ai')
        setConversation({ stage: 'medications', data })
        break

      case 'additional_symptoms':
        data.additionalSymptoms = input
        addMessage("Have you experienced this before, or is this the first time?", 'ai')
        setConversation({ stage: 'history', data })
        break

      case 'medications':
        data.medications = input
        addMessage("Do you have any chronic medical conditions or allergies I should know about?", 'ai')
        setConversation({ stage: 'medical_history', data })
        break

      case 'history':
        data.history = input
        addMessage("Are you currently taking any medications?", 'ai')
        setConversation({ stage: 'medications', data })
        break

      case 'medical_history':
        data.medicalHistory = input
        addMessage("Thank you for providing all this information. Let me analyze your symptoms...", 'ai')
        setTimeout(() => generatePatientResults(data), 2500)
        break

      default:
        addMessage("Could you please describe your symptoms in more detail?", 'ai')
        setConversation({ stage: 'initial_concern', data })
    }
  }

  const handleDoctorConversation = async (input, stage, data) => {
    if (uploadedFiles.length > 0) {
      addMessage("Analyzing the uploaded medical files...", 'ai')
      setTimeout(() => generateDoctorResults(input, uploadedFiles), 3000)
    } else {
      const response = `Based on the clinical presentation: "${input}"

Clinical Assessment:
• Consider differential diagnoses: Viral upper respiratory infection, Acute bronchitis, or early pneumonia
• Recommended diagnostic tests: CBC with differential, CRP, Chest X-ray
• Initial management: Symptomatic treatment, antipyretics, monitor closely for 24-48 hours

Risk Stratification: Moderate
Red Flags to Monitor: High fever >103°F, respiratory distress, altered mental status

Would you like me to analyze any medical images, generate a detailed clinical report, or provide medication recommendations?`
      
      addMessage(response, 'ai')
      
      setTimeout(() => {
        addMessage("Type 'analyze' for a comprehensive clinical analysis, or upload medical images for diagnostic support.", 'ai')
      }, 1000)
      
      if (input.toLowerCase().includes('analyze')) {
        setTimeout(() => generateDoctorResults(input, []), 2000)
      }
    }
  }

  const handleAdminConversation = async (input, stage, data) => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('trend') || lowerInput.includes('patient')) {
      const response = `Patient Query Analysis:

Weekly Overview:
• Total Queries: 342 (+23% from last week)
• Peak Hours: 9 AM - 11 AM, 2 PM - 4 PM
• Average Response Time: 2.3 minutes

Top Symptoms Reported:
1. Respiratory Issues: 45% (↑12% from last week)
2. Fever: 32% (↑8%)
3. Headache: 18%
4. Gastrointestinal: 15%

Geographic Distribution:
• Urban areas: 68%
• Suburban: 22%
• Rural: 10%

Department Utilization:
• Internal Medicine: 42%
• Emergency: 28%
• Family Medicine: 30%

Recommendation: Consider increasing respiratory specialist availability due to trending respiratory complaints.`
      
      addMessage(response, 'ai')
    } else if (lowerInput.includes('performance') || lowerInput.includes('system')) {
      const response = `System Performance Report:

Technical Metrics:
• System Uptime: 99.8%
• Average Query Processing: 1.2 seconds
• API Response Time: 245ms
• Database Performance: Optimal

User Satisfaction:
• Overall Rating: 4.6/5
• AI Accuracy: 4.7/5
• Response Speed: 4.8/5
• User Interface: 4.5/5

Resource Utilization:
• CPU: 42% average
• Memory: 68% average
• Storage: 54% capacity
• Bandwidth: Normal

System Health: Excellent
No critical issues detected.`
      
      addMessage(response, 'ai')
    } else {
      const response = `Admin Analytics Dashboard:

Quick Stats:
• Active Patients Today: 156
• Consultations Completed: 89
• Average Satisfaction: 4.6/5
• System Load: 42%

What would you like to explore?
1. Patient Query Trends
2. System Performance
3. Department Analytics
4. Financial Overview
5. Staff Performance

Type a number or describe your query.`
      
      addMessage(response, 'ai')
    }
  }

  const generatePatientResults = (data) => {
    const severity = parseInt(data.severity) || 5
    const results = {
      disease: determineCondition(data),
      confidence: Math.min(85 + Math.floor(Math.random() * 10), 95),
      severity: severity > 7 ? "High" : severity > 4 ? "Moderate" : "Mild",
      description: generateDescription(data),
      collectedData: data,
      recommendations: generateRecommendations(data, severity),
      nextSteps: severity > 7 
        ? "Seek immediate medical attention. Visit an emergency room or urgent care facility."
        : "Schedule an appointment with a healthcare provider within 24-48 hours for proper diagnosis and treatment.",
      suggestedDoctors: doctors,
      whenToSeekHelp: [
        "Fever above 103°F (39.4°C)",
        "Difficulty breathing or chest pain",
        "Symptoms rapidly worsening",
        "Severe pain or discomfort",
        "Signs of dehydration (dark urine, dizziness)"
      ]
    }
    
    setAnalysisResults(results)
    setShowResults(true)
  }

  const determineCondition = (data) => {
    const concern = data.primaryConcern.toLowerCase()
    if (concern.includes('fever') || concern.includes('temperature')) {
      return "Acute Febrile Illness"
    } else if (concern.includes('cough') || concern.includes('breathing')) {
      return "Upper Respiratory Tract Infection"
    } else if (concern.includes('pain') && concern.includes('head')) {
      return "Tension-Type Headache"
    } else if (concern.includes('stomach') || concern.includes('abdominal')) {
      return "Gastroenteritis"
    } else {
      return "Common Viral Infection"
    }
  }

  const generateDescription = (data) => {
    return `Based on your reported symptoms and the information you've provided, your condition appears consistent with ${determineCondition(data).toLowerCase()}. This assessment is based on the symptom pattern, duration (${data.duration}), and severity level you described.`
  }

  const generateRecommendations = (data, severity) => {
    const base = [
      "Get adequate rest (7-9 hours of sleep)",
      "Stay well hydrated (8-10 glasses of water daily)",
      "Monitor your symptoms closely"
    ]
    
    if (severity > 6) {
      base.push("Seek medical attention within 24 hours")
      base.push("Avoid strenuous activities")
      base.push("Keep a symptom diary")
    } else {
      base.push("Use over-the-counter medications as needed")
      base.push("Maintain a balanced diet")
      base.push("Consult a doctor if symptoms worsen or persist beyond 5-7 days")
    }
    
    return base
  }

  const generateDoctorResults = (clinicalNotes, files) => {
    const results = {
      disease: "Acute Bronchitis with Possible Secondary Bacterial Infection",
      confidence: 92,
      severity: "Moderate",
      description: "Clinical assessment suggests acute bronchitis with signs of possible secondary bacterial infection. Patient presentation and available data support this diagnosis.",
      clinicalFindings: [
        {
          category: "Clinical Examination",
          findings: "Productive cough with purulent sputum, mild wheezing on auscultation",
          confidence: 88
        },
        {
          category: "Vital Signs",
          findings: "Temperature 101.2°F, SpO2 94%, HR 92 bpm, BP 128/82",
          confidence: 95
        },
        ...(files.length > 0 ? [{
          category: "Imaging Analysis",
          findings: "Bilateral lower lobe infiltrates visible on uploaded chest radiograph",
          confidence: 89
        }] : [])
      ],
      recommendations: [
        "Prescribe Amoxicillin-Clavulanate 875mg BID for 7-10 days",
        "Order follow-up chest X-ray in 4-6 weeks if symptoms persist",
        "Prescribe bronchodilator (Albuterol) PRN for wheezing",
        "Recommend increased fluid intake and rest",
        "Consider referral to pulmonologist if no improvement in 10-14 days"
      ],
      labTests: ["Complete Blood Count (CBC)", "C-Reactive Protein (CRP)", "Sputum Culture & Sensitivity", "Chest X-Ray (if not done)"],
      medications: [
        { name: "Amoxicillin-Clavulanate", dosage: "875-125mg BID", duration: "7-10 days" },
        { name: "Albuterol Inhaler", dosage: "2 puffs Q4-6H PRN", duration: "As needed" },
        { name: "Guaifenesin", dosage: "400mg QID", duration: "7 days" },
        { name: "Acetaminophen", dosage: "650mg Q6H PRN", duration: "For fever" }
      ],
      icdCodes: ["J20.9 - Acute bronchitis, unspecified", "J18.9 - Pneumonia, unspecified organism"],
      nextSteps: "Schedule follow-up appointment in 3-5 days. Instruct patient to return immediately if developing high fever (>103°F), severe dyspnea, or signs of respiratory distress. Consider hospitalization if patient has significant comorbidities or shows signs of severe illness."
    }
    
    setAnalysisResults(results)
    setShowResults(true)
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newFile = {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type,
          size: file.size,
          preview: e.target.result
        }
        setUploadedFiles(prev => [...prev, newFile])
        
        const fileType = file.type.includes('image') ? 'Medical Image' : 'Medical Report'
        addMessage(`Uploaded ${fileType}: ${file.name}`, 'user', { file: newFile })
        
        if (user?.role === 'doctor') {
          setTimeout(() => {
            addMessage(`File received. I can analyze this ${fileType.toLowerCase()} along with your clinical notes. Please provide patient symptoms or type 'analyze' to begin.`, 'ai')
          }, 1000)
        }
        
        showToast(`${file.name} uploaded successfully`)
      }
      reader.readAsDataURL(file)
    })
  }

  const handleNewConsultation = () => {
    setMessages([])
    setUploadedFiles([])
    setShowResults(false)
    setAnalysisResults(null)
    setConversation({ stage: 'greeting', data: {} })
    initializeChat()
    showToast('New consultation started')
  }

  const handleContactDoctor = (doctor) => {
    showToast(`Connecting you with ${doctor.name}...`)
    setTimeout(() => {
      addMessage(`Appointment request sent to ${doctor.name}. You should receive confirmation within 2 hours via email and SMS.`, 'ai')
    }, 1500)
  }

  const handleDownloadReport = () => {
    const reportData = {
      patientName: user?.name || 'Patient',
      date: new Date().toLocaleString(),
      diagnosis: analysisResults.disease,
      confidence: analysisResults.confidence,
      severity: analysisResults.severity,
      recommendations: analysisResults.recommendations,
      collectedData: analysisResults.collectedData
    }
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", `health_report_${Date.now()}.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
    
    showToast('Report downloaded successfully')
  }

  if (showResults && analysisResults) {
    return (
      <div className="container-fluid p-4">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        
        <div className="card border-0 shadow-lg">
          <div className="card-header bg-primary text-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0 fw-bold d-flex align-items-center">
                {user?.role === 'doctor' ? (
                  <><Stethoscope className="me-2" size={24} /> Clinical Analysis Results</>
                ) : user?.role === 'admin' ? (
                  <><TrendingUp className="me-2" size={24} /> System Analysis</>
                ) : (
                  <><CheckCircle className="me-2" size={24} /> Health Assessment Results</>
                )}
              </h4>
              <button className="btn btn-light btn-sm" onClick={handleNewConsultation}>
                New Consultation
              </button>
            </div>
          </div>
          
          <div className="card-body p-4">
            <div className="row mb-4">
              <div className="col-md-8">
                <div className="d-flex align-items-center mb-3">
                  <CheckCircle className="text-success me-3" size={32} />
                  <div>
                    <h5 className="mb-1 fw-bold">{analysisResults.disease}</h5>
                    <p className="text-muted mb-0">Confidence: {analysisResults.confidence}%</p>
                  </div>
                </div>
                <p className="text-muted">{analysisResults.description}</p>
              </div>
              <div className="col-md-4">
                <div className="progress mb-2" style={{ height: '20px' }}>
                  <div 
                    className={`progress-bar ${analysisResults.confidence > 80 ? 'bg-success' : 'bg-warning'}`}
                    style={{ width: `${analysisResults.confidence}%` }}
                  >
                    {analysisResults.confidence}%
                  </div>
                </div>
                <div className={`alert ${analysisResults.severity === 'High' ? 'alert-danger' : 
                  analysisResults.severity === 'Moderate' ? 'alert-warning' : 'alert-success'} mb-0 py-2`}>
                  <strong>Severity: {analysisResults.severity}</strong>
                </div>
              </div>
            </div>

            {user?.role === 'doctor' && analysisResults.clinicalFindings && (
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Clinical Findings</h6>
                {analysisResults.clinicalFindings.map((finding, idx) => (
                  <div key={idx} className="card border-start border-4 border-info mb-2">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between">
                        <strong>{finding.category}</strong>
                        <span className="badge bg-info">{finding.confidence}% confidence</span>
                      </div>
                      <p className="mb-0 mt-2 small">{finding.findings}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {user?.role === 'doctor' && analysisResults.labTests && (
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Recommended Lab Tests</h6>
                <div className="row g-2">
                  {analysisResults.labTests.map((test, idx) => (
                    <div key={idx} className="col-md-6">
                      <div className="badge bg-info text-dark p-2 w-100 text-start">{test}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {user?.role === 'doctor' && analysisResults.medications && (
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Suggested Medications</h6>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Medication</th>
                        <th>Dosage</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysisResults.medications.map((med, idx) => (
                        <tr key={idx}>
                          <td className="fw-semibold">{med.name}</td>
                          <td>{med.dosage}</td>
                          <td>{med.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="mb-4">
              <h6 className="fw-bold mb-3">
                {user?.role === 'doctor' ? 'Clinical Recommendations' : 'Health Recommendations'}
              </h6>
              <div className="row g-3">
                {analysisResults.recommendations.map((rec, idx) => (
                  <div key={idx} className="col-md-6">
                    <div className="d-flex align-items-start">
                      <CheckCircle className="text-success me-2 mt-1 flex-shrink-0" size={16} />
                      <span className="small">{rec}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {user?.role === 'patient' && analysisResults.whenToSeekHelp && (
              <div className="alert alert-danger border-0 mb-4">
                <h6 className="fw-bold mb-2 d-flex align-items-center">
                  <AlertTriangle className="me-2" size={18} />
                  Seek Immediate Medical Attention If:
                </h6>
                <ul className="mb-0">
                  {analysisResults.whenToSeekHelp.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {user?.role === 'patient' && analysisResults.suggestedDoctors && (
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Recommended Doctors</h6>
                <div className="row g-3">
                  {analysisResults.suggestedDoctors.map((doctor) => (
                    <div key={doctor.id} className="col-md-4">
                      <div className="card h-100 border">
                        <div className="card-body">
                          <h6 className="card-title mb-2">{doctor.name}</h6>
                          <p className="card-text small text-muted mb-2">{doctor.specialty}</p>
                          <div className="mb-3">
                            <small className="d-block">⭐ {doctor.rating} Rating</small>
                            <small className="text-success d-block">{doctor.availability}</small>
                            <small className="text-muted d-flex align-items-center mt-1">
                              <MapPin className="me-1" size={12} />
                              {doctor.location}
                            </small>
                          </div>
                          <button 
                            className="btn btn-primary btn-sm w-100"
                            onClick={() => handleContactDoctor(doctor)}
                          >
                            <Phone className="me-1" size={12} />
                            Contact Doctor
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {user?.role === 'doctor' && analysisResults.icdCodes && (
              <div className="mb-4">
                <h6 className="fw-bold mb-2">ICD-10 Codes</h6>
                <div className="d-flex gap-2 flex-wrap">
                  {analysisResults.icdCodes.map((code, idx) => (
                    <span key={idx} className="badge bg-secondary">{code}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="alert alert-info border-0 mb-4">
              <div className="d-flex align-items-start">
                <AlertTriangle className="me-2 mt-1 flex-shrink-0" size={18} />
                <div>
                  <strong>Next Steps:</strong>
                  <p className="mb-0 mt-2">{analysisResults.nextSteps}</p>
                </div>
              </div>
            </div>

            <div className="d-flex gap-3 flex-wrap">
              {user?.role === 'patient' && (
                <>
                  <button className="btn btn-primary">
                    <Stethoscope className="me-1" size={16} />
                    Find Doctor
                  </button>
                  <button className="btn btn-outline-primary" onClick={handleDownloadReport}>
                    <Download className="me-1" size={16} />
                    Save Report
                  </button>
                  <button className="btn btn-outline-secondary">
                    <Share2 className="me-1" size={16} />
                    Share with Doctor
                  </button>
                </>
              )}
              {user?.role === 'doctor' && (
                <>
                  <button className="btn btn-primary">Create Prescription</button>
                  <button className="btn btn-outline-primary">Schedule Follow-up</button>
                  <button className="btn btn-outline-secondary" onClick={handleDownloadReport}>
                    <Download className="me-1" size={16} />
                    Export Report
                  </button>
                </>
              )}
              {user?.role === 'admin' && (
                <>
                  <button className="btn btn-primary">
                    <TrendingUp className="me-1" size={16} />
                    Generate Full Report
                  </button>
                  <button className="btn btn-outline-primary">Alert Departments</button>
                  <button className="btn btn-outline-secondary">Export Analytics</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid p-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-7">
          <div className="card border-0 shadow-lg" style={{ height: 'calc(100vh - 120px)' }}>
            <div className="card-header text-white py-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0 fw-bold d-flex align-items-center">
                    <Bot className="me-2" size={24} />
                    AI Health Assistant
                  </h5>
                  <small className="opacity-75">
                    {user?.role === 'doctor' ? 'Clinical Decision Support' : 
                     user?.role === 'admin' ? 'Healthcare Analytics' : 'Personal Health Guide'}
                  </small>
                </div>
                <span className="badge bg-white text-primary">{user?.role?.toUpperCase()}</span>
              </div>
            </div>
            
            <div className="card-body d-flex flex-column p-0" style={{ height: 'calc(100vh - 240px)' }}>
              {/* Messages Area */}
              <div className="flex-grow-1 p-4" style={{ overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
                {messages.map((message) => (
                  <div key={message.id} className={`d-flex mb-3 ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div className={`card border-0 shadow-sm ${message.sender === 'user' ? 'bg-primary text-white' : 'bg-white'}`} 
                         style={{ maxWidth: '75%' }}>
                      <div className="card-body p-3">
                        {message.file && (
                          <div className="mb-2 p-2 bg-light bg-opacity-10 rounded">
                            <small>
                              {message.file.type.includes('image') ? '🖼️' : '📄'} {message.file.name}
                            </small>
                          </div>
                        )}
                        <p className="mb-1" style={{ whiteSpace: 'pre-line' }}>{message.text}</p>
                        <small className={message.sender === 'user' ? 'text-white-50' : 'text-muted'} style={{ fontSize: '0.75rem' }}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="d-flex justify-content-start mb-3">
                    <div className="card border-0 shadow-sm bg-white">
                      <div className="card-body p-3 d-flex align-items-center">
                        <Loader2 className="me-2" size={16} style={{ animation: 'spin 1s linear infinite' }} />
                        <span className="small">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-top p-3 bg-white">
                {uploadedFiles.length > 0 && (
                  <div className="mb-2 d-flex gap-2 flex-wrap">
                    {uploadedFiles.map(file => (
                      <span key={file.id} className="badge bg-secondary d-flex align-items-center gap-1">
                        {file.name}
                        <X 
                          size={14}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setUploadedFiles(prev => prev.filter(f => f.id !== file.id))}
                        />
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={
                      user?.role === 'doctor' ? "Describe patient symptoms or clinical findings..." :
                      user?.role === 'admin' ? "Query system analytics or reports..." :
                      "Describe your symptoms or health concerns..."
                    }
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSendMessage()}
                    disabled={isTyping}
                  />
                  
                  {(user?.role === 'doctor' || user?.role === 'admin') && (
                    <>
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => fileInputRef.current?.click()}
                        title="Upload Image"
                        disabled={isTyping}
                      >
                        <Image size={18} />
                      </button>
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => fileInputRef.current?.click()}
                        title="Upload PDF Report"
                        disabled={isTyping}
                      >
                        <FileText size={18} />
                      </button>
                    </>
                  )}
                  
                  <button 
                    className="btn btn-primary px-4"
                    onClick={handleSendMessage}
                    disabled={isTyping || (!inputMessage.trim() && uploadedFiles.length === 0)}
                  >
                    <Send size={18} />
                  </button>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />

                <div className="mt-2">
                  <small className="text-muted d-flex align-items-center gap-1">
                    <AlertTriangle size={12} />
                    {user?.role === 'doctor' 
                      ? 'Clinical decision support tool - Use alongside professional judgment'
                      : 'This is an AI assistant for informational purposes only. Not a substitute for professional medical advice.'}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default Predict