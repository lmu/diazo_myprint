FROM python:slim

ENV APP_HOME=/var/local/theme
RUN mkdir -p $APP_HOME
COPY . $APP_HOME
WORKDIR $APP_HOME

RUN pip install --no-cache-dir -r requirements.txt

ENTRYPOINT ["paster"]
CMD ["serve", "diazo.ini"]
