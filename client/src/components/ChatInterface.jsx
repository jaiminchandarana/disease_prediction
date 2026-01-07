import React, { useState, useEffect, useRef } from 'react'
import { Send, Bot, User, Loader2, Image } from 'lucide-react'

const ChatInterface = () => {
  // Mock user data since we don't have AuthContext
  const user = {
    name: 'John Smith',
    role: 'patient'
  }
  
  const [messages, setMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [notifications, setNotifications] = useState([])
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  // Simple notification system
  const showNotification = (message, type = 'success') => {
    const notification = {
      id: Date.now(),
      message,
      type
    }
    setNotifications(prev => [...prev, notification])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id))
    }, 3000)
  }

  useEffect(() => {
    // Initialize chat with welcome message
    const welcomeMessage = {
      id: 1,
      text: `Hello ${user?.name}! I'm your AI health assistant. I'm here to help you with health-related questions, symptom analysis, and medical guidance. How can I assist you today?`,
      sender: 'ai',
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!currentMessage.trim() && !uploadedImage) return

    const userMessage = {
      id: Date.now(),
      text: currentMessage,
      sender: 'user',
      timestamp: new Date(),
      image: uploadedImage?.preview
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setUploadedImage(null)
    setLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateHealthResponse(currentMessage)
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
      setLoading(false)
    }, 2000)
  }

  const generateHealthResponse = (message) => {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
      return "Fever can be a sign of infection or inflammation. Monitor your temperature regularly. If it persists above 101°F (38.3°C) for more than 24 hours, consider consulting a healthcare provider. Stay hydrated and rest."
    }
    
    if (lowerMessage.includes('headache') || lowerMessage.includes('head pain')) {
      return "Headaches can have various causes including stress, dehydration, or tension. Try staying hydrated, resting in a dark room, and gentle neck stretches. If headaches are severe or frequent, please consult a doctor."
    }
    
    if (lowerMessage.includes('cough') || lowerMessage.includes('coughing')) {
      return "A persistent cough could indicate respiratory irritation or infection. Stay hydrated, use a humidifier, and avoid irritants. If the cough persists for more than a week or includes blood, seek medical attention."
    }
    
    if (lowerMessage.includes('chest pain') || lowerMessage.includes('heart')) {
      return "Chest pain should be taken seriously. If you're experiencing severe chest pain, shortness of breath, or pain radiating to your arm or jaw, seek immediate medical attention or call emergency services."
    }
    
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "You're welcome! I'm here to help with any health-related questions you may have. Remember, while I can provide general guidance, always consult with healthcare professionals for serious concerns."
    }
    
    return "I understand your concern. Based on what you've described, I recommend monitoring your symptoms closely. If symptoms worsen or persist, please consider consulting with a healthcare professional for proper evaluation and treatment."
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage({
          file: file,
          preview: e.target.result,
          name: file.name
        })
        toast.success('Image uploaded successfully')
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="container-fluid p-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg" style={{ height: '80vh' }}>
            <div className="card-header bg-gradient-primary text-white py-3">
              <div className="d-flex align-items-center">
                <FaRobot className="me-3" size={24} />
                <div>
                  <h5 className="mb-0 fw-bold">AI Health Assistant</h5>
                  <small className="opacity-75">Personal healthcare guidance and support</small>
                </div>
              </div>
            </div>
            
            <div className="card-body d-flex flex-column p-0">
              {/* Messages Area */}
              <div className="flex-grow-1 p-4" style={{ overflowY: 'auto', maxHeight: 'calc(80vh - 200px)' }}>
                {messages.map((message) => (
                  <div key={message.id} className={`d-flex mb-4 ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div className={`d-flex align-items-start ${message.sender === 'user' ? 'flex-row-reverse' : ''}`} style={{ maxWidth: '85%' }}>
                      <div className={`rounded-circle d-flex align-items-center justify-content-center ${message.sender === 'user' ? 'bg-primary ms-3' : 'bg-light me-3'}`} style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                        {message.sender === 'user' ? 
                          <FaUser className="text-white" size={18} /> : 
                          <FaRobot className="text-primary" size={18} />
                        }
                      </div>
                      <div className={`card border-0 ${message.sender === 'user' ? 'bg-primary text-white' : 'bg-light'} shadow-sm`}>
                        <div className="card-body p-3">
                          {message.image && (
                            <img src={message.image} alt="Uploaded" className="img-fluid rounded mb-2" style={{ maxHeight: '200px', maxWidth: '100%' }} />
                          )}
                          <p className="mb-2">{message.text}</p>
                          <small className={`opacity-75 ${message.sender === 'user' ? 'text-white-50' : 'text-muted'}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="d-flex justify-content-start mb-4">
                    <div className="d-flex align-items-start">
                      <div className="rounded-circle d-flex align-items-center justify-content-center bg-light me-3" style={{ width: '40px', height: '40px' }}>
                        <FaRobot className="text-primary" size={18} />
                      </div>
                      <div className="card border-0 bg-light shadow-sm">
                        <div className="card-body p-3">
                          <FaSpinner className="spinner-border spinner-border-sm me-2" />
                          <span>AI is analyzing your message...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Image Preview */}
              {uploadedImage && (
                <div className="px-4 py-2 border-top bg-light">
                  <div className="d-flex align-items-center">
                    <img src={uploadedImage.preview} alt="Preview" className="rounded" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                    <div className="ms-3 flex-grow-1">
                      <small className="text-muted">{uploadedImage.name}</small>
                    </div>
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => setUploadedImage(null)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-top bg-light">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control border-0 shadow-sm"
                    placeholder="Ask me about your health concerns..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    style={{ borderRadius: '20px 0 0 20px' }}
                  />
                  <button 
                    className="btn btn-outline-secondary border-0"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload Image"
                  >
                    <FaImage />
                  </button>
                  <button 
                    className="btn btn-primary border-0 px-4"
                    onClick={handleSendMessage}
                    disabled={loading || (!currentMessage.trim() && !uploadedImage)}
                    style={{ borderRadius: '0 20px 20px 0' }}
                  >
                    {loading ? <FaSpinner className="spinner-border spinner-border-sm" /> : <FaPaperPlane />}
                  </button>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                
                <div className="mt-2">
                  <small className="text-muted">
                    💡 Tip: Describe your symptoms in detail for better assistance. You can also upload images for visual analysis.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface