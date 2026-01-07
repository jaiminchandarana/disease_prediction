from connection import connection
from generate import generate_code
import pandas as pd
from search import search,sort

def fetch_card_data_by_admin(admin_id,term=None,column=None,order='asc'):
    try:
        column_map = {
            'doctor_name': 0,
            'prognosis': 1,
            'created_at': 2,
            'doctor_id': 3,
            'case_id': 4,
        }
        conn = connection()
        cur = conn.cursor()
        cur.execute(f'''
            SELECT d.first_name || ' ' || d.last_name as doctor_name, t.prognosis, TO_CHAR(t.created_at, 'DD FMMonth YYYY, HH12:MI AM') AS created_at, t.doctor_id, t.case_id
            FROM training_data as t 
            JOIN doctor d on t.doctor_id = d.doctor_id
            WHERE t.admin_id = {admin_id}
        ''')
        rows = cur.fetchall()
        if term:
            rows = search(rows,term)
            
        if column in column_map:
            sort(rows,column,order,column_map)
            
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error fetching data."

def fetch_card_data_by_doctor(doctor_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f'''
            SELECT d.first_name || ' ' || d.last_name as doctor_name, t.prognosis, t.created_at, t.doctor_id, t.case_id
            FROM training_data as t 
            JOIN doctor d on t.doctor_id = d.doctor_id
            WHERE t.doctor_id = d.{doctor_id}
        ''')
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error fetching data."
    
def fetch_pdf_data(case_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f'''
            SELECT itching,skin_rash,nodal_skin_eruptions,continuous_sneezing,shivering,chills,joint_pain,stomach_pain,acidity,ulcers_on_tongue,muscle_wasting,vomiting,burning_micturition,spotting_urination,fatigue,weight_gain,anxiety,cold_hands_and_feets,mood_swings,weight_loss,restlessness,lethargy,patches_in_throat,irregular_sugar_level,cough,high_fever,sunken_eyes,breathlessness,sweating,dehydration,indigestion,headache,yellowish_skin,dark_urine,nausea,loss_of_appetite,pain_behind_the_eyes,back_pain,constipation,abdominal_pain,diarrhoea,mild_fever,yellow_urine,yellowing_of_eyes,acute_liver_failure,fluid_overload,swelling_of_stomach,swelled_lymph_nodes,malaise,blurred_and_distorted_vision,phlegm,throat_irritation,redness_of_eyes,sinus_pressure,runny_nose,congestion,chest_pain,weakness_in_limbs,fast_heart_rate,pain_during_bowel_movements,pain_in_anal_region,bloody_stool,irritation_in_anus,neck_pain,dizziness,cramps,bruising,obesity,swollen_legs,swollen_blood_vessels,puffy_face_and_eyes,enlarged_thyroid,brittle_nails,swollen_extremeties,excessive_hunger,extra_marital_contacts,drying_and_tingling_lips,slurred_speech,knee_pain,hip_joint_pain,muscle_weakness,stiff_neck,swelling_joints,movement_stiffness,spinning_movements,loss_of_balance,unsteadiness,weakness_of_one_body_side,loss_of_smell,bladder_discomfort,foul_smell_of_urine,continuous_feel_of_urine,passage_of_gases,internal_itching,toxic_look,depression,irritability,muscle_pain,altered_sensorium,red_spots_over_body,belly_pain,abnormal_menstruation,dischromic_patches,watering_from_eyes,increased_appetite,polyuria,family_history,mucoid_sputum,rusty_sputum,lack_of_concentration,visual_disturbances,receiving_blood_transfusion,receiving_unsterile_injections,coma,stomach_bleeding,distention_of_abdomen,history_of_alcohol_consumption,blood_in_sputum,prominent_veins_on_calf,palpitations,painful_walking,pus_filled_pimples,blackheads,scurring,skin_peeling,silver_like_dusting,small_dents_in_nails,inflammatory_nails,blister,red_sore_around_nose,yellow_crust_ooze FROM training_data 
            WHERE case_id = {case_id}         
        ''')
        row = cur.fetchone()
        columns = [desc[0] for desc in cur.description]
        columns = [col for col, val in zip(columns, row) if val == 1]
        conn.commit()
        cur.close()
        conn.close()
        return columns
    except Exception as e:
        return "Error fetching data."
    
def fetch_pdf_header_data(case_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f'''
            SELECT d.first_name || ' ' || d.last_name AS doctor_name,t.doctor_id, t.prognosis FROM training_data t JOIN doctor d ON t.doctor_id = d.doctor_id WHERE t.case_id = {case_id}            
        ''')
        row = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return row
    except Exception as e:
        return "Error fetching data."
    
def fetch_pdf_timestamp(case_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f'''
            SELECT TO_CHAR(created_at, 'DD FMMonth YYYY, HH12:MI AM') AS formatted_time FROM training_data WHERE case_id = {case_id}         
        ''')
        row = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return row
    except Exception as e:
        return "Error fetching data."
    
def add_training_data(prognosis,doctor_id,admin_id,itching=0,skin_rash=0,nodal_skin_eruptions=0,continuous_sneezing=0,shivering=0,chills=0,joint_pain=0,stomach_pain=0,acidity=0,ulcers_on_tongue=0,muscle_wasting=0,vomiting=0,burning_micturition=0,spotting_urination=0,fatigue=0,weight_gain=0,anxiety=0,cold_hands_and_feets=0,mood_swings=0,weight_loss=0,restlessness=0,lethargy=0,patches_in_throat=0,irregular_sugar_level=0,cough=0,high_fever=0,sunken_eyes=0,breathlessness=0,sweating=0,dehydration=0,indigestion=0,headache=0,yellowish_skin=0,dark_urine=0,nausea=0,loss_of_appetite=0,pain_behind_the_eyes=0,back_pain=0,constipation=0,abdominal_pain=0,diarrhoea=0,mild_fever=0,yellow_urine=0,yellowing_of_eyes=0,acute_liver_failure=0,fluid_overload=0,swelling_of_stomach=0,swelled_lymph_nodes=0,malaise=0,blurred_and_distorted_vision=0,phlegm=0,throat_irritation=0,redness_of_eyes=0,sinus_pressure=0,runny_nose=0,congestion=0,chest_pain=0,weakness_in_limbs=0,fast_heart_rate=0,pain_during_bowel_movements=0,pain_in_anal_region=0,bloody_stool=0,irritation_in_anus=0,neck_pain=0,dizziness=0,cramps=0,bruising=0,obesity=0,swollen_legs=0,swollen_blood_vessels=0,puffy_face_and_eyes=0,enlarged_thyroid=0,brittle_nails=0,swollen_extremeties=0,excessive_hunger=0,extra_marital_contacts=0,drying_and_tingling_lips=0,slurred_speech=0,knee_pain=0,hip_joint_pain=0,muscle_weakness=0,stiff_neck=0,swelling_joints=0,movement_stiffness=0,spinning_movements=0,loss_of_balance=0,unsteadiness=0,weakness_of_one_body_side=0,loss_of_smell=0,bladder_discomfort=0,foul_smell_of_urine=0,continuous_feel_of_urine=0,passage_of_gases=0,internal_itching=0,toxic_look=0,depression=0,irritability=0,muscle_pain=0,altered_sensorium=0,red_spots_over_body=0,belly_pain=0,abnormal_menstruation=0,dischromic_patches=0,watering_from_eyes=0,increased_appetite=0,polyuria=0,family_history=0,mucoid_sputum=0,rusty_sputum=0,lack_of_concentration=0,visual_disturbances=0,receiving_blood_transfusion=0,receiving_unsterile_injections=0,coma=0,stomach_bleeding=0,distention_of_abdomen=0,history_of_alcohol_consumption=0,blood_in_sputum=0,prominent_veins_on_calf=0,palpitations=0,painful_walking=0,pus_filled_pimples=0,blackheads=0,scurring=0,skin_peeling=0,silver_like_dusting=0,small_dents_in_nails=0,inflammatory_nails=0,blister=0,red_sore_around_nose=0,yellow_crust_ooze=0):
    try:
        case_id = generate_code()
        conn = connection()
        cur = conn.cursor()
        cur.execute(f'''
            INSERT INTO training_data
            (prognosis,doctor_id,admin_id,case_id,itching,skin_rash,nodal_skin_eruptions,continuous_sneezing,shivering,chills,joint_pain,stomach_pain,acidity,ulcers_on_tongue,muscle_wasting,vomiting,burning_micturition,spotting_urination,fatigue,weight_gain,anxiety,cold_hands_and_feets,mood_swings,weight_loss,restlessness,lethargy,patches_in_throat,irregular_sugar_level,cough,high_fever,sunken_eyes,breathlessness,sweating,dehydration,indigestion,headache,yellowish_skin,dark_urine,nausea,loss_of_appetite,pain_behind_the_eyes,back_pain,constipation,abdominal_pain,diarrhoea,mild_fever,yellow_urine,yellowing_of_eyes,acute_liver_failure,fluid_overload,swelling_of_stomach,swelled_lymph_nodes,malaise,blurred_and_distorted_vision,phlegm,throat_irritation,redness_of_eyes,sinus_pressure,runny_nose,congestion,chest_pain,weakness_in_limbs,fast_heart_rate,pain_during_bowel_movements,pain_in_anal_region,bloody_stool,irritation_in_anus,neck_pain,dizziness,cramps,bruising,obesity,swollen_legs,swollen_blood_vessels,puffy_face_and_eyes,enlarged_thyroid,brittle_nails,swollen_extremeties,excessive_hunger,extra_marital_contacts,drying_and_tingling_lips,slurred_speech,knee_pain,hip_joint_pain,muscle_weakness,stiff_neck,swelling_joints,movement_stiffness,spinning_movements,loss_of_balance,unsteadiness,weakness_of_one_body_side,loss_of_smell,bladder_discomfort,foul_smell_of_urine,continuous_feel_of_urine,passage_of_gases,internal_itching,toxic_look,depression,irritability,muscle_pain,altered_sensorium,red_spots_over_body,belly_pain,abnormal_menstruation,dischromic_patches,watering_from_eyes,increased_appetite,polyuria,family_history,mucoid_sputum,rusty_sputum,lack_of_concentration,visual_disturbances,receiving_blood_transfusion,receiving_unsterile_injections,coma,stomach_bleeding,distention_of_abdomen,history_of_alcohol_consumption,blood_in_sputum,prominent_veins_on_calf,palpitations,painful_walking,pus_filled_pimples,blackheads,scurring,skin_peeling,silver_like_dusting,small_dents_in_nails,inflammatory_nails,blister,red_sore_around_nose,yellow_crust_ooze)            
            VALUES {(prognosis.lower(),doctor_id,admin_id,case_id,itching,skin_rash,nodal_skin_eruptions,continuous_sneezing,shivering,chills,joint_pain,stomach_pain,acidity,ulcers_on_tongue,muscle_wasting,vomiting,burning_micturition,spotting_urination,fatigue,weight_gain,anxiety,cold_hands_and_feets,mood_swings,weight_loss,restlessness,lethargy,patches_in_throat,irregular_sugar_level,cough,high_fever,sunken_eyes,breathlessness,sweating,dehydration,indigestion,headache,yellowish_skin,dark_urine,nausea,loss_of_appetite,pain_behind_the_eyes,back_pain,constipation,abdominal_pain,diarrhoea,mild_fever,yellow_urine,yellowing_of_eyes,acute_liver_failure,fluid_overload,swelling_of_stomach,swelled_lymph_nodes,malaise,blurred_and_distorted_vision,phlegm,throat_irritation,redness_of_eyes,sinus_pressure,runny_nose,congestion,chest_pain,weakness_in_limbs,fast_heart_rate,pain_during_bowel_movements,pain_in_anal_region,bloody_stool,irritation_in_anus,neck_pain,dizziness,cramps,bruising,obesity,swollen_legs,swollen_blood_vessels,puffy_face_and_eyes,enlarged_thyroid,brittle_nails,swollen_extremeties,excessive_hunger,extra_marital_contacts,drying_and_tingling_lips,slurred_speech,knee_pain,hip_joint_pain,muscle_weakness,stiff_neck,swelling_joints,movement_stiffness,spinning_movements,loss_of_balance,unsteadiness,weakness_of_one_body_side,loss_of_smell,bladder_discomfort,foul_smell_of_urine,continuous_feel_of_urine,passage_of_gases,internal_itching,toxic_look,depression,irritability,muscle_pain,altered_sensorium,red_spots_over_body,belly_pain,abnormal_menstruation,dischromic_patches,watering_from_eyes,increased_appetite,polyuria,family_history,mucoid_sputum,rusty_sputum,lack_of_concentration,visual_disturbances,receiving_blood_transfusion,receiving_unsterile_injections,coma,stomach_bleeding,distention_of_abdomen,history_of_alcohol_consumption,blood_in_sputum,prominent_veins_on_calf,palpitations,painful_walking,pus_filled_pimples,blackheads,scurring,skin_peeling,silver_like_dusting,small_dents_in_nails,inflammatory_nails,blister,red_sore_around_nose,yellow_crust_ooze)}
        ''')
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        return "Error inserting data."
    
def fetch_model_data():
    try:
        conn = connection()
        columns = ["itching","skin_rash","nodal_skin_eruptions","continuous_sneezing","shivering","chills","joint_pain","stomach_pain","acidity","ulcers_on_tongue","muscle_wasting","vomiting","burning_micturition","spotting_ urination","fatigue","weight_gain","anxiety","cold_hands_and_feets","mood_swings","weight_loss","restlessness","lethargy","patches_in_throat","irregular_sugar_level","cough","high_fever","sunken_eyes","breathlessness","sweating","dehydration","indigestion","headache","yellowish_skin","dark_urine","nausea","loss_of_appetite","pain_behind_the_eyes","back_pain","constipation","abdominal_pain","diarrhoea","mild_fever","yellow_urine","yellowing_of_eyes","acute_liver_failure","fluid_overload","swelling_of_stomach","swelled_lymph_nodes","malaise","blurred_and_distorted_vision","phlegm","throat_irritation","redness_of_eyes","sinus_pressure","runny_nose","congestion","chest_pain","weakness_in_limbs","fast_heart_rate","pain_during_bowel_movements","pain_in_anal_region","bloody_stool","irritation_in_anus","neck_pain","dizziness","cramps","bruising","obesity","swollen_legs","swollen_blood_vessels","puffy_face_and_eyes","enlarged_thyroid","brittle_nails","swollen_extremeties","excessive_hunger","extra_marital_contacts","drying_and_tingling_lips","slurred_speech","knee_pain","hip_joint_pain","muscle_weakness","stiff_neck","swelling_joints","movement_stiffness","spinning_movements","loss_of_balance","unsteadiness","weakness_of_one_body_side","loss_of_smell","bladder_discomfort","foul_smell_of urine","continuous_feel_of_urine","passage_of_gases","internal_itching","toxic_look_(typhos)","depression","irritability","muscle_pain","altered_sensorium","red_spots_over_body","belly_pain","abnormal_menstruation","dischromic _patches","watering_from_eyes","increased_appetite","polyuria","family_history","mucoid_sputum","rusty_sputum","lack_of_concentration","visual_disturbances","receiving_blood_transfusion","receiving_unsterile_injections","coma","stomach_bleeding","distention_of_abdomen","history_of_alcohol_consumption","blood_in_sputum","prominent_veins_on_calf","palpitations","painful_walking","pus_filled_pimples","blackheads","scurring","skin_peeling","silver_like_dusting","small_dents_in_nails","inflammatory_nails","blister","red_sore_around_nose","yellow_crust_ooze","prognosis"]
        col_str = ", ".join(columns)
        query = ('''
            SELECT itching,skin_rash,nodal_skin_eruptions,continuous_sneezing,shivering,chills,joint_pain,stomach_pain,acidity,ulcers_on_tongue,muscle_wasting,vomiting,burning_micturition,spotting_urination,fatigue,weight_gain,anxiety,cold_hands_and_feets,mood_swings,weight_loss,restlessness,lethargy,patches_in_throat,irregular_sugar_level,cough,high_fever,sunken_eyes,breathlessness,sweating,dehydration,indigestion,headache,yellowish_skin,dark_urine,nausea,loss_of_appetite,pain_behind_the_eyes,back_pain,constipation,abdominal_pain,diarrhoea,mild_fever,yellow_urine,yellowing_of_eyes,acute_liver_failure,fluid_overload,swelling_of_stomach,swelled_lymph_nodes,malaise,blurred_and_distorted_vision,phlegm,throat_irritation,redness_of_eyes,sinus_pressure,runny_nose,congestion,chest_pain,weakness_in_limbs,fast_heart_rate,pain_during_bowel_movements,pain_in_anal_region,bloody_stool,irritation_in_anus,neck_pain,dizziness,cramps,bruising,obesity,swollen_legs,swollen_blood_vessels,puffy_face_and_eyes,enlarged_thyroid,brittle_nails,swollen_extremeties,excessive_hunger,extra_marital_contacts,drying_and_tingling_lips,slurred_speech,knee_pain,hip_joint_pain,muscle_weakness,stiff_neck,swelling_joints,movement_stiffness,spinning_movements,loss_of_balance,unsteadiness,weakness_of_one_body_side,loss_of_smell,bladder_discomfort,foul_smell_of_urine,continuous_feel_of_urine,passage_of_gases,internal_itching,toxic_look,depression,irritability,muscle_pain,altered_sensorium,red_spots_over_body,belly_pain,abnormal_menstruation,dischromic_patches,watering_from_eyes,increased_appetite,polyuria,family_history,mucoid_sputum,rusty_sputum,lack_of_concentration,visual_disturbances,receiving_blood_transfusion,receiving_unsterile_injections,coma,stomach_bleeding,distention_of_abdomen,history_of_alcohol_consumption,blood_in_sputum,prominent_veins_on_calf,palpitations,painful_walking,pus_filled_pimples,blackheads,scurring,skin_peeling,silver_like_dusting,small_dents_in_nails,inflammatory_nails,blister,red_sore_around_nose,yellow_crust_ooze,prognosis FROM training_data
        ''')
        df = pd.read_sql(query, conn)
        df.to_csv("C:/Users/Jaimin/OneDrive/Desktop/disease prediction/backend/data/training.csv", index=False)
        print("CSV saved to C:/Users/Jaimin/OneDrive/Desktop/disease prediction/backend/data/training.csv")
    except Exception as e:
        return "Error fetching data."