# shopify_billy
Shopify integration to billy bookkeeping


build docker images

cd billy
docker build -t sb-billy .

cd ..

cd webserver
docker build -t sb-webserver .


Start docker compose

cd ..

docker-compose -f docker-compose.dev.yml up


Attach debugger
