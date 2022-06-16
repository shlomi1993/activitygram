# Shlomi Ben-Shushan


from os import path
from json import loads
from flask import Flask, jsonify, request
import collaborative_filtering as cf
import text_classifier as tc


app = Flask(__name__)


@app.route('/', methods=['GET'])
def index():
    return 'Recommender service is up'

# http://localhost:8090/train_cf?interests=../Data/recommender/datasets/debug/interests.csv&ratings=../Data/recommender/datasets/debug/ratings.csv
@app.route('/train_cf', methods=['GET'])
def train_cf():
    interests = request.args.get('interests')
    ratings = request.args.get('ratings')
    cf.create_pred_matrix(ratings, interests)
    return jsonify({'result': 'Collaborative Filtering prediction matrix is up-to-date.'})

# http://localhost:8090/predict_cf?uid=123464&k=10&userbased=1
@app.route('/predict_cf', methods=['GET'])
def predict_cf():
    uid = request.args.get('uid')
    k = int(request.args.get('k'))
    user_based = True if request.args.get('userbased') == '1' else False
    result = cf.predict_interests(uid, k, user_based)
    return jsonify(result)

# http://localhost:8090/train_nn?uid=123464&train=../Data/recommender/datasets/train.json
@app.route('/train_nn', methods=['GET'])
def train_nn():
    uid = request.args.get('uid')
    train = request.args.get('train')
    result = tc.train_model(uid, train, n_epochs=100)
    return jsonify(result)

# http://localhost:8090/predict_nn?uid=123464&test=../Data/recommender/datasets/test.json
@app.route('/predict_nn', methods=['POST'])
def predict_nn():
    req = loads(request.data)
    uid = req['uid']
    test_set = req['testSet']
    if path.exists(tc.MODEL_UID + str(uid)):
        predictions = tc.predict(uid, test_set)
        return jsonify(predictions)
    else:
        return jsonify([{'error': f'No model found for user {uid}.'}])


if __name__ == '__main__':
    file = open('../Service/connections.json', 'r')
    conn = loads(file.read())
    file.close()
    ip = conn['Recommender']['ip']
    port = conn['Recommender']['port']
    app.run(host=ip, port=port)
