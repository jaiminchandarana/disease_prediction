from connection import connection

def create_admin():
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(r"CREATE TABLE admin (admin_id BIGINT PRIMARY KEY,first_name VARCHAR(50) NOT NULL,last_name VARCHAR(50) NOT NULL,hospital VARCHAR(50) NOT NULL,phone BIGINT NOT NULL,email VARCHAR(50) NOT NULL,address VARCHAR(100) DEFAULT 'null',password VARCHAR(100) NOT NULL,CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')),CONSTRAINT unique_email UNIQUE (email),CONSTRAINT unique_phone UNIQUE (phone)")
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        return "Error creating table."
    
def creat_doctor():
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(r"CREATE TABLE doctor (doctor_id BIGINT PRIMARY KEY,first_name VARCHAR(50) NOT NULL,last_name VARCHAR(50) NOT NULL,hospital VARCHAR(50) NOT NULL,phone BIGINT NOT NULL,email VARCHAR(50) NOT NULL,department VARCHAR(30),experience INT,admin_id BIGINT NOT NULL,password VARCHAR(100) NOT NULL,CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),CONSTRAINT add_fk FOREIGN KEY (admin_id) REFERENCES admin(admin_id),CONSTRAINT unique_email2 UNIQUE (email),CONSTRAINT unique_phone2 UNIQUE (phone)")
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        return "Error creating table."
    
def create_patient():
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(r"CREATE TABLE patient (patient_id BIGINT PRIMARY KEY,first_name VARCHAR(50) NOT NULL,last_name VARCHAR(50) NOT NULL,phone BIGINT NOT NULL,email VARCHAR(50) NOT NULL,address VARCHAR(100) DEFAULT 'null',admin_id BIGINT DEFAULT NULL,doctor_id BIGINT DEFAULT NULL,password VARCHAR(100) NOT NULL,CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),CONSTRAINT add_fk FOREIGN KEY (admin_id) REFERENCES admin(admin_id),CONSTRAINT add_fk2 FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id),CONSTRAINT unique_email3 UNIQUE (email),CONSTRAINT unique_phone3 UNIQUE (phone)")
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        return "Error creating table."
    
def create_booking():
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(r"create table booking(patient_id BIGINT NOT NULL,doctor_id BIGINT NOT NULL,admin_id BIGINT NOT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,handled_at TIMESTAMP DEFAULT NULL,predicted_at TIMESTAMP DEFAULT NULL,decision VARCHAR(10) DEFAULT 'pending',prediction VARCHAR(100) DEFAULT 'pending',description VARCHAR(100) DEFAULT NULL,precaution VARCHAR(100) DEFAULT NULL,symptom VARCHAR(100) DEFAULT NULL,prediction_id BIGINT DEFAULT NULL,CONSTRAINT fk_patient FOREIGN KEY (patient_id) REFERENCES patient(patient_id),CONSTRAINT fk_doctor FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id),CONSTRAINT fk_admin FOREIGN KEY (admin_id) REFERENCES admin(admin_id)")
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        return "Error creating table."
    
def create_training_data():
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute('''
            CREATE TABLE training_data(
                itching INTEGER DEFAULT 0,
                skin_rash INTEGER DEFAULT 0,
                nodal_skin_eruptions INTEGER DEFAULT 0,
                continuous_sneezing INTEGER DEFAULT 0,
                shivering INTEGER DEFAULT 0,
                chills INTEGER DEFAULT 0,
                joint_pain INTEGER DEFAULT 0,
                stomach_pain INTEGER DEFAULT 0,
                acidity	INTEGER DEFAULT 0,
                ulcers_on_tongue INTEGER DEFAULT 0,
                muscle_wasting INTEGER DEFAULT 0,
                vomiting INTEGER DEFAULT 0,
                burning_micturition INTEGER DEFAULT 0,
                spotting_urination INTEGER DEFAULT 0,
                fatigue	INTEGER DEFAULT 0,
                weight_gain	INTEGER DEFAULT 0,
                anxiety INTEGER DEFAULT 0,
                cold_hands_and_feets INTEGER DEFAULT 0,
                mood_swings INTEGER DEFAULT 0,
                weight_loss INTEGER DEFAULT 0,
                restlessness INTEGER DEFAULT 0,
                lethargy INTEGER DEFAULT 0,
                patches_in_throat INTEGER DEFAULT 0,
                irregular_sugar_level INTEGER DEFAULT 0,
                cough INTEGER DEFAULT 0,
                high_fever INTEGER DEFAULT 0,
                sunken_eyes INTEGER DEFAULT 0,
                breathlessness INTEGER DEFAULT 0,
                sweating INTEGER DEFAULT 0,
                dehydration	INTEGER DEFAULT 0,
                indigestion INTEGER DEFAULT 0,
                headache INTEGER DEFAULT 0,
                yellowish_skin INTEGER DEFAULT 0,
                dark_urine INTEGER DEFAULT 0,
                nausea INTEGER DEFAULT 0,
                loss_of_appetite INTEGER DEFAULT 0,
                pain_behind_the_eyes INTEGER DEFAULT 0,
                back_pain INTEGER DEFAULT 0,
                constipation INTEGER DEFAULT 0,
                abdominal_pain INTEGER DEFAULT 0,
                diarrhoea INTEGER DEFAULT 0,
                mild_fever INTEGER DEFAULT 0,
                yellow_urine INTEGER DEFAULT 0,
                yellowing_of_eyes INTEGER DEFAULT 0,
                acute_liver_failure INTEGER DEFAULT 0,
                fluid_overload INTEGER DEFAULT 0,
                swelling_of_stomach	INTEGER DEFAULT 0,
                swelled_lymph_nodes INTEGER DEFAULT 0,
                malaise INTEGER DEFAULT 0,
                blurred_and_distorted_vision INTEGER DEFAULT 0,	
                phlegm INTEGER DEFAULT 0,
                throat_irritation INTEGER DEFAULT 0,
                redness_of_eyes INTEGER DEFAULT 0,
                sinus_pressure INTEGER DEFAULT 0,
                runny_nose INTEGER DEFAULT 0,
                congestion INTEGER DEFAULT 0,
                chest_pain INTEGER DEFAULT 0,
                weakness_in_limbs INTEGER DEFAULT 0,
                fast_heart_rate INTEGER DEFAULT 0,
                pain_during_bowel_movements INTEGER DEFAULT 0,
                pain_in_anal_region INTEGER DEFAULT 0,
                bloody_stool INTEGER DEFAULT 0,
                irritation_in_anus INTEGER DEFAULT 0,
                neck_pain INTEGER DEFAULT 0,
                dizziness INTEGER DEFAULT 0,
                cramps INTEGER DEFAULT 0,
                bruising INTEGER DEFAULT 0,
                obesity INTEGER DEFAULT 0,
                swollen_legs INTEGER DEFAULT 0,
                swollen_blood_vessels INTEGER DEFAULT 0,
                puffy_face_and_eyes INTEGER DEFAULT 0,
                enlarged_thyroid INTEGER DEFAULT 0,
                brittle_nails INTEGER DEFAULT 0,
                swollen_extremeties INTEGER DEFAULT 0,
                excessive_hunger INTEGER DEFAULT 0,
                extra_marital_contacts INTEGER DEFAULT 0,
                drying_and_tingling_lips INTEGER DEFAULT 0,
                slurred_speech INTEGER DEFAULT 0,
                knee_pain INTEGER DEFAULT 0,
                hip_joint_pain INTEGER DEFAULT 0,
                muscle_weakness INTEGER DEFAULT 0,
                stiff_neck INTEGER DEFAULT 0,
                swelling_joints INTEGER DEFAULT 0,
                movement_stiffness INTEGER DEFAULT 0,
                spinning_movements INTEGER DEFAULT 0,
                loss_of_balance INTEGER DEFAULT 0,
                unsteadiness INTEGER DEFAULT 0,
                weakness_of_one_body_side INTEGER DEFAULT 0,
                loss_of_smell INTEGER DEFAULT 0,
                bladder_discomfort INTEGER DEFAULT 0,
                foul_smell_of_urine INTEGER DEFAULT 0,
                urine INTEGER DEFAULT 0,
                continuous_feel_of_urine INTEGER DEFAULT 0,
                passage_of_gases INTEGER DEFAULT 0,
                internal_itching INTEGER DEFAULT 0,
                toxic_look INTEGER DEFAULT 0,
                depression INTEGER DEFAULT 0,
                irritability INTEGER DEFAULT 0,
                muscle_pain	INTEGER DEFAULT 0,
                altered_sensorium INTEGER DEFAULT 0,
                red_spots_over_body INTEGER DEFAULT 0,
                belly_pain INTEGER DEFAULT 0,
                abnormal_menstruation INTEGER DEFAULT 0,
                dischromic_patches INTEGER DEFAULT 0,
                watering_from_eyes INTEGER DEFAULT 0,
                increased_appetite INTEGER DEFAULT 0,
                polyuria INTEGER DEFAULT 0,
                family_history INTEGER DEFAULT 0,
                mucoid_sputum INTEGER DEFAULT 0,
                rusty_sputum INTEGER DEFAULT 0,
                lack_of_concentration INTEGER DEFAULT 0,
                visual_disturbances	INTEGER DEFAULT 0,
                receiving_blood_transfusion	INTEGER DEFAULT 0,
                receiving_unsterile_injections INTEGER DEFAULT 0,	
                coma INTEGER DEFAULT 0,
                stomach_bleeding INTEGER DEFAULT 0,
                distention_of_abdomen INTEGER DEFAULT 0,
                history_of_alcohol_consumption INTEGER DEFAULT 0,
                blood_in_sputum INTEGER DEFAULT 0,
                prominent_veins_on_calf INTEGER DEFAULT 0,
                palpitations INTEGER DEFAULT 0,
                painful_walking INTEGER DEFAULT 0,
                pus_filled_pimples INTEGER DEFAULT 0,
                blackheads INTEGER DEFAULT 0,
                scurring INTEGER DEFAULT 0,
                skin_peeling INTEGER DEFAULT 0,
                silver_like_dusting	INTEGER DEFAULT 0,
                small_dents_in_nails INTEGER DEFAULT 0,
                inflammatory_nails INTEGER DEFAULT 0,
                blister	INTEGER DEFAULT 0,
                red_sore_around_nose INTEGER DEFAULT 0,
                yellow_crust_ooze INTEGER DEFAULT 0,	
                prognosis VARCHAR(50) NOT NULL,
                doctor_id BIGINT DEFAULT NULL,
                admin_id BIGINT DEFAULT NULL,
                case_id BIGINT DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_doctor FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id),
                CONSTRAINT fk_admin FOREIGN KEY (admin_id) REFERENCES admin(admin_id),
                ADD CONSTRAINT unique_case_id UNIQUE (case_id)
            )            
        ''')
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        return "Error creating table."
    
def create_self_prediction():
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute('''
            CREATE TABLE self_prediction(
            patient_id BIGINT NOT NULL,
            prediction VARCHAR(100) DEFAULT NULL,
            description VARCHAR(100) DEFAULT NULL,
            precaution VARCHAR(100) DEFAULT NULL,
            symptom VARCHAR(100) DEFAULT NULL,
            predicted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            prediction_id BIGINT DEFAULT NULL,
            CONSTRAINT fk_patient FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
            )            
        ''')
        conn.execute()
        cur.close()
        conn.close()
    except Exception as e:
        return "Error creating table."
    
def create_contact():
    conn = connection()
    cur = conn.cursor()
    cur.execute('''
        CREATE TABLE contact (
            name VARCHAR(30) NOT NULL,
            email VARCHAR(50) NOT NULL,
            subject VARCHAR(100) NOT NULL,
            message VARCHAR(200) NOT NULL,
            query_id BIGINT UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    cur.close()
    conn.close()