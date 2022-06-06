from flask import Flask, jsonify, request
from geopy import geocoders
import json


app = Flask(__name__)
geolocator = geocoders.Nominatim(user_agent='AqdHYN8WZH0xzQR9RGgb264VJl087NRvLrj4tAwT292vwuakZhx2HuKiN_UR2kzS')

@app.route('/')
def index():
    return 'Geocoder service is up.'

@app.route('/geocode', methods=['GET'])
def geocode():
    address = request.args.get('address')
    location = geolocator.geocode(address)
    return jsonify({
        "latitude": location.latitude,
        "longitude": location.longitude  
    })
    
@app.route('/reverse', methods=['GET'])
def reverse():
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')
    location = geolocator.reverse(latitude + ', ' + longitude)
    return jsonify({
        "address": location.address
    })

if __name__ == '__main__':
    file = open('../Service/connections.json', 'r')
    conn = json.loads(file.read())
    file.close()
    ip = conn['Geocoder']['ip']
    port = conn['Geocoder']['port']
    app.run(host=ip, port=port)
    print(f'Gecoding service is available at: http://{ip}:{port}/')
