# Use the official Nginx image
FROM nginx:alpine

# Copy your website files
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY clock.js /usr/share/nginx/html/

# Delete the default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx config (see Step 2)
COPY nginx.conf /etc/nginx/conf.d/