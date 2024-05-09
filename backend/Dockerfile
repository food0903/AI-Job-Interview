FROM python:3.9

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./app /code/app

COPY ./firebase.json /code/firebase.json

CMD ["fastapi", "run", "app/main.py", "--port", "80"]