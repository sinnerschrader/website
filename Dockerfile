FROM dperson/nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /srv/www
RUN rm /srv/www/nginx.conf
