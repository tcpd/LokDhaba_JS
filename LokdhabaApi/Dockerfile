# Dockerfile - this is a comment. Delete me if you want.
FROM python:3.7
EXPOSE 5000


# Create the working directory (and set it as the working directory)
RUN mkdir -p /app
WORKDIR /app

ENV PYTHONFAULTHANDLER 1

# Install the package dependencies (this step is separated
# from copying all the source code to avoid having to
# re-install all python packages defined in requirements.txt
# whenever any source code change is made)
COPY requirements.txt /app
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt
RUN python -m spacy download en_core_web_md
