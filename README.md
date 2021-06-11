# Customer App

It is a test project.

## Requirements

Following are the requirements to run this app.

- [Python3.9]  - Programming language used.
- [Django3.2] - App is built on Django framework.
- [Bootstrap5] - CSS library to design web page.

## Installation

```bash
# Create virtual environment
virtualenv -p /usr/bin/python3.9 test-venv
source test-venv/bin/activate

# Clone the app from its repo
git clone https://github.com/chiragm2910/pcf_test
cd pcf_test

# Install dependencies
pip3 install -r requirements.txt

# migrate db migrations
python3 manage.py migrate
```

## Runserver

```bash
python3 manage.py runserver
```
