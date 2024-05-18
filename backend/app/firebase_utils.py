import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

# initialize firebase app
cred = credentials.Certificate("firebase.json")
firebase_admin.initialize_app(cred)

# db object to access db 
db = firestore.client()

def create_session_in_db(uid: str): 
    """
    Initializes a chat session for a user in the Firestore database

    :param uid: The user id of the user
    :type uid: str
    :return: return the session id
    """
    update_time, session_ref = db.collection("sessions").add({"uid": uid, "timestamp": datetime.now()})
    return session_ref.id

def add_message_to_db(role: str, content: str, uid: str, sid: str):
    """
    Adds a message to the Firestore database.

    :param message: The message to be added to the database
    :param uid: The user id of the user
    :type message: str
    """
    timestamp = datetime.now()
    db.collection("messages").add({"role": role, "content": content, "uid": uid, "timestamp": timestamp, "sid": sid})

def fetch_messages_from_db_for_gpt(sid: str):
    """
    Fetches messages from the Firestore database

    :param uid: The user id of the user
    :type uid: str
    :return: A list of message objects consisting of the role, contents of the message depending on the user ID
    :return: list
    """
    messages = []
    message_query = db.collection("messages").where("sid", "==", sid).order_by("timestamp").stream()
    for message in message_query:
        messages.append(message.to_dict())
    messages = [{'content': message['content'], 'role': message['role']} for message in messages]
    return messages

def clear_messages_and_sessions_for_user(uid: str):
    """
    Deletes all messages for a specific user from the Firestore database

    :param uid: The user id of the user
    :type uid: int
    """
    messages_ref = db.collection("messages")
    messages_for_user = messages_ref.where("uid", "==", uid).stream()

    for message in messages_for_user:
        message.reference.delete()
    
    sessions_ref = db.collection("sessions")
    sessions_for_user = sessions_ref.where("uid", "==", uid).stream()

    for sessions in sessions_for_user:
        sessions.reference.delete()



def set_job_description(uid: str, job_description: str, sid: str):
    """
    Sets job description for user in the Firestore database

    :param uid: The user id of the user
    :type uid: int
    """
    db.collection("sessions").document(sid).update({"job_description": job_description})

def get_job_description(sid: str):
    """
    Gets job description for user in the Firestore database

    :param uid: The user id of the user
    :type uid: int
    :return: The job description for the user
    :return: str
    """
    document = db.collection("sessions").document(sid).get()

    if document.exists:
        job_description = document.to_dict()
        return job_description.get('job_description')
    else:
        return None
    
def get_feedback_in_db(sid: str):
    """
    Gets feedback from the Firestore database

    :param sid: The session ID
    :type uid: str
    :return: The feedback from the bot
    :return: str
    """
    document = db.collection("feedback").document(sid).get()

    if document.exists:
        feedback = document.to_dict()
        return feedback.get('feedback')
    else:
        return None

def get_all_sessions_from_db(uid: str):
    """
    Gets all job sessions

    :param uid: The user id of the user
    :type uid: int
    :return: Array of job sessions
    :return: arr
    """
    documents = db.collection("sessions").where("uid", "==", uid).stream()

    documents = [{**doc.to_dict(), 'sid': doc.id} for doc in documents]

    if documents:
        return documents
    else:
        return None

def add_feedback_to_db(sid: str, feedback: str):
    """
    Adds feedback to the Firestore database

    :param feedback: The feedback to be added to the database
    :type feedback: str
    """
    db.collection("feedback").document(sid).set({"feedback": feedback}, merge=True)


#add_message_to_db("assistant", "What is your qualifications?", 1)
#add_message_to_db("user", "I am a software engineer", 1)
#print(fetch_messages_from_db_for_gpt(1))