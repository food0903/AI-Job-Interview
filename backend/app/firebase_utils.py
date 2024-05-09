import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

# initialize firebase app
cred = credentials.Certificate("firebase.json")
firebase_admin.initialize_app(cred)

# db object to access db 
db = firestore.client()

def add_message_to_db(role: str, content: str, uid: int):
    """
    Adds a message to the Firestore database.

    :param message: The message to be added to the database
    :param uid: The user id of the user
    :type message: str
    """
    timestamp = datetime.now()
    db.collection("messages").add({"role": role, "content": content, "uid": uid, "timestamp": timestamp})

def fetch_messages_from_db_for_gpt(uid: int):
    """
    Fetches messages from the Firestore database

    :param uid: The user id of the user
    :type uid: int
    :return: A list of message objects consisting of the role, contents of the message depending on the user ID
    :return: list
    """
    messages = []
    for message in db.collection("messages").where("uid", "==", uid).order_by("timestamp").stream():
        message_dict = message.to_dict()
        messages.append({'role': message_dict['role'], 'content': message_dict['content']})
    return messages


def clear_messages_for_user(uid: int):
    """
    Deletes all messages for a specific user from the Firestore database

    :param uid: The user id of the user
    :type uid: int
    """
    messages_ref = db.collection("messages")
    messages_for_user = messages_ref.where("uid", "==", uid).stream()

    for message in messages_for_user:
        message.reference.delete()

#add_message_to_db("assistant", "What is your qualifications?", 1)
#add_message_to_db("user", "I am a software engineer", 1)
#print(fetch_messages_from_db_for_gpt(1))