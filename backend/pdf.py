from weasyprint import HTML
from training_data import fetch_pdf_data,fetch_pdf_timestamp,fetch_pdf_header_data
from self_prediction import fetch_prediction_pdf_by_self,fetch_prediction_pdf_by_visit
import os


def generate_case_pdf(case_id):
    result = fetch_pdf_header_data(case_id)
    doctor_name, doctor_id, diagnosis = result[0]
    filename = "CaseReport" + str(case_id) + ".pdf"
    columns = fetch_pdf_data(case_id)

    if not isinstance(columns, list):
        raise ValueError("Expected a list of column names from fetch_pdf_data.")

    rows = ""
    for symptom in columns:
        label = symptom.replace("_", " ").capitalize()
        rows += f"""
        <tr>
            <td>{label}</td>
            <td>Yes</td>
        </tr>
        """

    timestamp = fetch_pdf_timestamp(case_id)

    html_content = f"""
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{
                font-family: 'Segoe UI', sans-serif;
                margin: 40px;
                color: #00334e;
                background-color: #f7fcfc;
            }}
            .container {{
                display: grid;
                grid-template-rows: auto auto 1fr;
                gap: 20px;
            }}
            .header {{
                display: grid;
                grid-template-columns: 1fr auto 1fr;
                align-items: center;
                border-bottom: 2px solid #00b3b3;
                padding-bottom: 15px;
            }}
            .logo {{
                display: flex;
                justify-content: flex-start;
            }}
            .logo img {{
                height: 50px;
                width: auto;
                object-fit: contain;
            }}
            .title {{
                font-size: 30px;
                color: #0077b6;
                text-align: center;
            }}
            .timestamp {{
                font-size: 15px;
                color: #4fbdba;
                text-align: right;
                margin-top: 8px;
            }}
            .info {{
                background: #e0f7fa;
                padding: 15px;
                border-radius: 10px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                font-size: 15px;
                line-height: 1.6;
            }}
            .info p {{
                margin: 5px 0;
            }}
            table {{
                width: 100%;
                border-collapse: collapse;
                background: white;
                border-radius: 10px;
                overflow: hidden;
                font-size: 14px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            }}
            th, td {{
                border: 1px solid #cceeee;
                padding: 10px;
                text-align: left;
            }}
            th {{
                background-color: #dff9fb;
                color: #00796b;
                font-weight: 600;
            }}
            tr {{
                background-color: white;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">
                    <img src="file:///C:/Users/Jaimin/OneDrive/Desktop/disease%20prediction/backend/logo/Wellnex-removebg-preview.png" alt="Logo">
                </div>
                <div class="title">Case Report</div>
                <div class="timestamp">{timestamp}</div>
            </div>

            <div class="info">
                <p><strong>Doctor Name:</strong> {doctor_name}</p>
                <p><strong>Diagnosis:</strong> {diagnosis}</p>
                <p><strong>Doctor ID:</strong> {doctor_id} &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Case ID:</strong> {case_id}</p>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Symptom</th>
                        <th>Presence</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    </body>
    </html>
    """

    HTML(string=html_content, base_url=os.getcwd()).write_pdf(filename)
    print(f"PDF generated: {filename}")

def generate_disease_pdf(prediction_id):
    result = fetch_prediction_pdf_by_self(prediction_id)

    if not result or isinstance(result, str):
        print("Failed to fetch prediction data:", result)
        return

    patient_name, patient_id, predicted_at, prediction, description, symptom, precaution = result[0]
    symptoms = [s.strip() for s in symptom.split(',') if s.strip()]
    precautions = [p.strip() for p in precaution.split(',') if p.strip()]

    rows = ""
    for symptom in symptoms:
        label = symptom.replace("_", " ").capitalize()
        rows += f"""
        <tr>
            <td>{label}</td>
            <td>Yes</td>
        </tr>
        """
    precaution_html = "<ul>" + "".join(f"<li>{p}</li>" for p in precautions) + "</ul>"
    timestamp = predicted_at
    filename = f"DiseaseReport{prediction_id}.pdf"
    html_content = f"""
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{
                font-family: 'Segoe UI', sans-serif;
                margin: 40px;
                color: #00334e;
                background-color: #f7fcfc;
            }}
            .container {{
                display: grid;
                grid-template-rows: auto auto auto 1fr;
                gap: 20px;
            }}
            .header {{
                display: grid;
                grid-template-columns: 1fr auto 1fr;
                align-items: center;
                border-bottom: 2px solid #00b3b3;
                padding-bottom: 15px;
            }}
            .logo {{
                display: flex;
                justify-content: flex-start;
            }}
            .logo img {{
                height: 50px;
                width: auto;
                object-fit: contain;
            }}
            .title {{
                font-size: 30px;
                color: #0077b6;
                text-align: center;
            }}
            .timestamp {{
                font-size: 15px;
                color: #4fbdba;
                text-align: right;
                margin-top: 8px;
            }}
            .info {{
                background: #e0f7fa;
                padding: 15px;
                border-radius: 10px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                font-size: 15px;
                line-height: 1.6;
            }}
            .info p {{
                margin: 5px 0;
            }}
            table {{
                width: 100%;
                border-collapse: collapse;
                background: white;
                border-radius: 10px;
                overflow: hidden;
                font-size: 14px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            }}
            th, td {{
                border: 1px solid #cceeee;
                padding: 10px;
                text-align: left;
            }}
            th {{
                background-color: #dff9fb;
                color: #00796b;
                font-weight: 600;
            }}
            tr {{
                background-color: white;
            }}
            .section {{
                margin-top: 30px;
                padding: 15px;
                background-color: #ffffff;
                border-left: 5px solid #00b3b3;
                box-shadow: 0 2px 6px rgba(0,0,0,0.04);
                border-radius: 8px;
                font-size: 15px;
            }}
            .section h3 {{
                color: #0077b6;
                margin-bottom: 10px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">
                    <img src="file:///C:/Users/Jaimin/OneDrive/Desktop/disease%20prediction/backend/logo/Wellnex-removebg-preview.png" alt="Logo">
                </div>
                <div class="title">Disease Report</div>
                <div class="timestamp">{timestamp}</div>
            </div>

            <div class="info">
                <p><strong>Patient Name:</strong> {patient_name}</p>
                <p><strong>Patient ID:</strong> {patient_id}</p>
                <p><strong>Prediction ID:</strong> {prediction_id}</p>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Symptom</th>
                        <th>Presence</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>

            <div class="section">
                <h3>Prediction</h3>
                <p>{prediction}</p>
            </div>

            <div class="section">
                <h3>Description</h3>
                <p>{description}</p>
            </div>

            <div class="section">
                <h3>Precaution</h3>
                {precaution_html}
            </div>
        </div>
    </body>
    </html>
    """

    HTML(string=html_content, base_url=os.getcwd()).write_pdf(filename)
    print(f"PDF generated: {filename}")
    
def generate_disease_pdf_by_visit(prediction_id):
    result = fetch_prediction_pdf_by_visit(prediction_id)

    if not result or isinstance(result, str):
        print("Failed to fetch prediction data:", result)
        return

    (
        doctor_id,
        patient_id,
        prediction,
        description,
        precaution,
        symptom,
        predicted_at,
        patient_name,
        doctor_name
    ) = result[0]

    symptoms = [s.strip() for s in symptom.split(',') if s.strip()]
    precautions = [p.strip() for p in precaution.split(',') if p.strip()]

    rows = ""
    for symptom in symptoms:
        label = symptom.replace("_", " ").capitalize()
        rows += f"""
        <tr>
            <td>{label}</td>
            <td>Yes</td>
        </tr>
        """

    precaution_html = "<ul>" + "".join(f"<li>{p}</li>" for p in precautions) + "</ul>"
    timestamp = predicted_at
    filename = f"DiseaseReport{prediction_id}.pdf"

    html_content = f"""
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{
                font-family: 'Segoe UI', sans-serif;
                margin: 40px;
                color: #00334e;
                background-color: #f7fcfc;
            }}
            .container {{
                display: grid;
                grid-template-rows: auto auto auto 1fr;
                gap: 20px;
            }}
            .header {{
                display: grid;
                grid-template-columns: 1fr auto 1fr;
                align-items: center;
                border-bottom: 2px solid #00b3b3;
                padding-bottom: 15px;
            }}
            .logo {{
                display: flex;
                justify-content: flex-start;
            }}
            .logo img {{
                height: 50px;
                width: auto;
                object-fit: contain;
            }}
            .title {{
                font-size: 30px;
                color: #0077b6;
                text-align: center;
            }}
            .timestamp {{
                font-size: 15px;
                color: #4fbdba;
                text-align: right;
                margin-top: 8px;
            }}
            .info {{
                background: #e0f7fa;
                padding: 15px;
                border-radius: 10px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                font-size: 15px;
                line-height: 1.6;
            }}
            .info p {{
                margin: 5px 0;
            }}
            table {{
                width: 100%;
                border-collapse: collapse;
                background: white;
                border-radius: 10px;
                overflow: hidden;
                font-size: 14px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            }}
            th, td {{
                border: 1px solid #cceeee;
                padding: 10px;
                text-align: left;
            }}
            th {{
                background-color: #dff9fb;
                color: #00796b;
                font-weight: 600;
            }}
            tr {{
                background-color: white;
            }}
            .section {{
                margin-top: 30px;
                padding: 15px;
                background-color: #ffffff;
                border-left: 5px solid #00b3b3;
                box-shadow: 0 2px 6px rgba(0,0,0,0.04);
                border-radius: 8px;
                font-size: 15px;
            }}
            .section h3 {{
                color: #0077b6;
                margin-bottom: 10px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">
                    <img src="file:///C:/Users/Jaimin/OneDrive/Desktop/disease%20prediction/backend/logo/Wellnex-removebg-preview.png" alt="Logo">
                </div>
                <div class="title">Disease Report</div>
                <div class="timestamp">{timestamp}</div>
            </div>

            <div class="info">
                <p><strong>Patient Name:</strong> {patient_name}</p>
                <p><strong>Patient ID:</strong> {patient_id}</p>
                <p><strong>Doctor Name:</strong> {doctor_name}</p>
                <p><strong>Doctor ID:</strong> {doctor_id}</p>
                <p><strong>Prediction ID:</strong> {prediction_id}</p>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Symptom</th>
                        <th>Presence</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>

            <div class="section">
                <h3>Prediction</h3>
                <p>{prediction}</p>
            </div>

            <div class="section">
                <h3>Description</h3>
                <p>{description}</p>
            </div>

            <div class="section">
                <h3>Precaution</h3>
                {precaution_html}
            </div>
        </div>
    </body>
    </html>
    """

    HTML(string=html_content, base_url=os.getcwd()).write_pdf(filename)
    print(f"PDF generated: {filename}")