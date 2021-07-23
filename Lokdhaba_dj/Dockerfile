FROM python:3
ENV PYTHONUNBUFFERED 1
RUN mkdir -p /app
WORKDIR /app

COPY requirements.txt /app
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "manage.py" ,"inspectdb",">","models.py"]
CMD ["python","manage.py","makemigrations"]
CMD ["python","manage.py","migrate"]


