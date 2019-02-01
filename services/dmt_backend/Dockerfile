FROM python:3.6.5-alpine

# Update OS
RUN apk update && \
    apk add --virtual build-deps gcc python-dev musl-dev libc-dev linux-headers \
    build-base cairo-dev cairo cairo-tools \
    # pillow dependencies
    jpeg-dev zlib-dev freetype-dev lcms2-dev openjpeg-dev tiff-dev tk-dev tcl-dev \
    openssl-dev python3-dev libffi-dev libxml2-dev libxslt-dev pango-dev gdk-pixbuf \
    msttcorefonts-installer fontconfig && \
    update-ms-fonts && \
    fc-cache -f


# Set the default directory for our environment
ENV HOME /api
WORKDIR /api

# Add requirements.txt
ADD requirements.txt /api

# Install uwsgi Python web server
RUN pip install uwsgi
# Install app requirements
RUN pip install -r requirements.txt

# Create app directory
ADD . /api

# Expose port 8000 for uwsgi
EXPOSE 5000

ENTRYPOINT ["/api/entrypoint.sh"]