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

$ curl --request POST --url http://localhost:8000/contact --header 'content-type: application/json' --data '{ "name": "Sune Spiegelhauer", "type": "person", "street": "Møllevej Syd 4", "zipcodeText": "3660", "cityText": "Stenløse", "phone": "22600359", "isCustomer": "true" }'


Attach debugger
