
#!/bin/bash
    
nodemon ./AppServer.js &

cd ../Data/recommender
python ./recommender.py 127.0.0.1 8090 &

cd ../geocoder
python ./geocoder.py 127.0.0.1 8100 &

cd ../../Service
  
wait -n
  
exit $?
