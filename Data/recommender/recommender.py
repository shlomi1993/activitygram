# Shlomi Ben-Shushan


from os import path
from json import loads
from flask import Flask, jsonify, request
import collaborative_filtering as cf
import text_classifier as tc


app = Flask(__name__)


@app.route('/', methods=['GET'])
def index():
    print('ping request recieved.')
    return 'Recommender service is up'

# http://localhost:8090/train_cf?interests=../Data/recommender/datasets/debug/interests.csv&ratings=../Data/recommender/datasets/debug/ratings.csv
@app.route('/train_cf', methods=['GET'])
def train_cf():
    interests = request.args.get('interests')
    ratings = request.args.get('ratings')
    print(f'train_cf request recieved for interests: {interests}, ratings: {ratings}.')
    cf.create_pred_matrix(ratings, interests)
    return jsonify({'result': 'Collaborative Filtering prediction matrix is up-to-date.'})

# http://localhost:8090/predict_cf?uid=123464&k=10&userbased=1
@app.route('/predict_cf', methods=['GET'])
def predict_cf():
    uid = request.args.get('uid')
    k = int(request.args.get('k'))
    user_based = True if request.args.get('userbased') == '1' else False
    print(f'predict_cf request recieved for uid: {uid}, k: {k}, user_based: {user_based}.')
    result = cf.predict_interests(uid, k, user_based)
    return jsonify(result)

# http://localhost:8090/train_nn?uid=123464&train=../Data/recommender/datasets/train.json
@app.route('/train_nn', methods=['GET'])
def train_nn():
    uid = request.args.get('uid')
    train = request.args.get('train')
    print(f'train_nn request recieved for uid: {uid}, train: {train}.')
    result = tc.train_model(uid, train, n_epochs=100)
    return jsonify(result)

# http://localhost:8090/predict_nn?uid=123464&test=../Data/recommender/datasets/test.json
@app.route('/predict_nn', methods=['GET'])
def predict_nn():
    uid = int(request.args.get('uid'))
    print(f'predict_nn request recieved for uid {uid}.')
    if path.exists(tc.MODEL_UID + str(uid)):
        test = request.args.get('test')
        predictions = tc.predict(uid, test)
        return jsonify(predictions)
    else:
        return jsonify(f'No model found for user {uid}.')


if __name__ == '__main__':
    file = open('../Service/connections.json', 'r')
    conn = loads(file.read())
    file.close()
    ip = conn['Recommender']['ip']
    port = conn['Recommender']['port']
    app.run(host=ip, port=port)
    print(f'Recommender service is available at: http://{ip}:{port}/')
