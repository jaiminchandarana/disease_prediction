from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
import json
import os
from dotenv import load_dotenv
 

model = None

def get_model():
    global model
    if model is None:
        gorq_key = os.getenv("GROQ_API_KEY")
        if not gorq_key:
            # Try loading from .env if not found (though api.py should have done it)
            load_dotenv()
            gorq_key = os.getenv("GROQ_API_KEY")
        
        if gorq_key:
            model = ChatGroq(
                temperature=0,
                groq_api_key=gorq_key,
                model_name="llama-3.3-70b-versatile"
            )
    return model

def predict_disease_from_qa(qna_data):
    """
    Predict disease from Q&A data
    
    Args:
        qna_data: Dictionary containing questions and answers
        
    Returns:
        Dictionary with prediction results
    """
    try:
        # Convert Q&A data to formatted string
        qna_text = ""
        if isinstance(qna_data, dict):
            for key, value in qna_data.items():
                qna_text += f"Q: {key}\nA: {value}\n\n"
        else:
            qna_text = str(qna_data)
        
        prompt_qna = PromptTemplate.from_template(
            """
            ### USER INPUT:
            {qna}

            ### INSTRUCTION:
            You are an intelligent medical assistant.
            You will be given questions and their answers about a patient's symptoms.
            Based on these Q&As, return a predicted disease, symptoms, precautions, confidence score and severity.
            
            Format your response as JSON with the following structure:
            {{
                "disease": "disease name",
                "confidence": numeric score (0-100, vary based on symptom specificity, do NOT default to 80),
                "severity": "Mild" or "Moderate" or "High",
                "description": "brief description",
                "symptoms": "list of key symptoms",
                "precautions": "list of precautions",
                "recommendations": ["recommendation 1", "recommendation 2", ...],
                "nextSteps": "immediate next steps to take"
            }}
            
            Do not include any preamble or explanation. Return ONLY the JSON object.

            ### OUTPUT (JSON ONLY):
            """
        )
        
        
        llm = get_model()
        if not llm:
            raise ValueError("GROQ_API_KEY not found. Please set it in environment variables.")
            
        chain_qna = prompt_qna | llm
        res = chain_qna.invoke({"qna": qna_text})
        
        # Parse the response
        content = res.content.strip()
        
        # Try to extract JSON from the response
        if '{' in content and '}' in content:
            start = content.index('{')
            end = content.rindex('}') + 1
            json_str = content[start:end]
            result = json.loads(json_str)
        else:
            # If not JSON, create a structured response
            result = {
                "disease": "Need further evaluation",
                "confidence": 50,
                "severity": "Moderate",
                "description": content[:200],
                "symptoms": "Based on symptoms provided",
                "precautions": "Consult with healthcare provider",
                "recommendations": ["Seek medical attention if symptoms worsen", "Monitor symptoms closely"],
                "nextSteps": "Schedule appointment with healthcare provider"
            }
        
        return result
        
    except Exception as e:
        # Return error response
        return {
            "error": str(e),
            "disease": "Unable to predict",
            "confidence": 0,
            "severity": "Unknown",
            "description": "An error occurred during prediction",
            "symptoms": "",
            "precautions": "",
            "recommendations": [],
            "nextSteps": "Please try again or consult directly with a healthcare provider"
        }

# For testing
if __name__ == '__main__':
    qna_input = input("Enter all Q&A (as plain text or JSON): ")
    result = predict_disease_from_qa(qna_input)
    print("\n" + json.dumps(result, indent=2))
