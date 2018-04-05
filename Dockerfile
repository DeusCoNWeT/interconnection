
FROM ubuntu:17.10

RUN apt-get update && apt-get install -y curl libxss1 libappindicator1 libindicator7 software-properties-common wget git xvfb
RUN add-apt-repository "deb http://deb.opera.com/opera/ stable non-free" && wget -O - http://deb.opera.com/archive.key | apt-key add -
RUN curl -L -o google-chrome.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
#RUN curl -L -o opera-stable.deb http://download3.operacdn.com/pub/opera/desktop/52.0.2871.40/linux/opera-stable_52.0.2871.40_amd64.deb
RUN apt-get update && apt-get upgrade -y
RUN DEBIAN_FRONTEND=noninteractive apt-get install -yq opera-stable
RUN dpkg -i google-chrome.deb || apt-get install -fy
RUN apt-get install -y firefox
RUN rm google-chrome.deb
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash - && apt-get install -y nodejs
RUN npm i -g gulp bower

