import sys
from flask import Flask, jsonify, request
from geopy import geocoders


app = Flask(__name__)
geolocator = geocoders.Nominatim(user_agent='Activitygram')


@app.route('/')
def index():
    print('ping request recieved.')
    return 'Geocoder service is up.'


@app.route('/geocode', methods=['GET'])
def geocode():
    address = request.args.get('address')
    print(f'geocode request recieved for address {address}.')
    location = geolocator.geocode(address)
    return jsonify({
        "latitude": location.latitude,
        "longitude": location.longitude  
    })
    

@app.route('/reverse', methods=['GET'])
def reverse():
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')
    print(f'reverse request recieved for latitude {latitude}, longitude: {longitude}.')
    location = geolocator.reverse(latitude + ', ' + longitude)
    return jsonify({
        "address": location.address
    })


if __name__ == '__main__':
    ip = sys.argv[1]
    port = int(sys.argv[2])
    app.run(host=ip, port=port)
