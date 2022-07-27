# Shlomi Ben-Shushan


import sys
import os
import json
from flask import Flask, jsonify, request
import collaborative_filtering as cf
import text_classifier as tc


INTERESTS_PATH = './datasets/interests.csv'
RATINGS_PATH = './datasets/ratings.csv'
DATASET_PATH = './datasets/train_uid_'


app = Flask(__name__)


@app.route('/', methods=['GET'])
def index():
    print('ping request recieved.')
    return 'Recommender service is up'


@app.route('/train_cf', methods=['POST'])
def train_cf():
    body = json.loads(request.data)
    interests = body['interests']
    ratings = body['ratings']
    with open(INTERESTS_PATH, 'w') as f:
        f.write(interests)
    with open(RATINGS_PATH, 'w') as f:
        f.write(ratings)
    cf.create_pred_matrix(RATINGS_PATH, INTERESTS_PATH)
    return jsonify({'result': 'Collaborative Filtering prediction matrix is up-to-date.'})


@app.route('/predict_cf', methods=['GET'])
def predict_cf():
    uid = request.args.get('uid')
    k = int(request.args.get('k'))
    user_based = True if request.args.get('userbased') == '1' else False
    result = cf.predict_interests(uid, k, user_based)
    return jsonify(result)


@app.route('/train_nn', methods=['POST'])
def train_nn():
    body = json.loads(request.data)
    uid = body['uid']
    train = body['train']
    result = tc.train_model(uid, train, n_epochs=100)
    return jsonify(result)


@app.route('/predict_nn', methods=['POST'])
def predict_nn():
    req = json.loads(request.data)
    uid = req['uid']
    test_set = req['testSet']
    if os.path.exists(tc.MODEL_UID + str(uid)):
        predictions = tc.predict(uid, test_set)
        return jsonify(predictions)
    else:
        return jsonify([{'error': f'No model found for user {uid}.'}])


@app.route('/dataset_size', methods=['GET'])
def dataset_size():
    uid = request.args.get('uid')
    file_path = DATASET_PATH + str(uid) + '.json'
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            content = json.loads(f.read())
            return jsonify(len(content))
    else:
        return jsonify(0);


if __name__ == '__main__':
    ip = sys.argv[1]
    port = int(sys.argv[2])
    app.run(host=ip, port=port)
