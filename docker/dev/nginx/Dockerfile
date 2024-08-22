FROM nginx:1.23

RUN unlink /var/log/nginx/access.log
RUN unlink /var/log/nginx/error.log

RUN mkdir /usr/share/nginx/ginkoai
COPY dist/ /usr/share/nginx/ginkoai/

COPY docker/dev/nginx/conf.d/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80