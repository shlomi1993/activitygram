# Shlomi Ben-Shushan


import os
import json
import collaborative_filtering as cf
import text_classifier as tc
from quart import Quart, request, jsonify


class Recommender:

    def get_app(self):
        
        app = Quart(__name__)

        @app.route('/', methods=['GET'])
        async def ping():
            return 'Recommender service is up'

        # http://localhost:8090/train_cf?interests=../Data/recommender/datasets/debug/interests.csv&ratings=../Data/recommender/datasets/debug/ratings.csv
        @app.route('/train_cf', methods=['GET'])
        async def train_cf():
            interests = request.args.get('interests')
            ratings = request.args.get('ratings')
            cf.create_pred_matrix(ratings, interests)
            return 'Collaborative Filtering prediction matrix is up-to-date.'

        # http://localhost:8090/predict_cf?uid=123464&k=10&userbased=1
        @app.route('/predict_cf', methods=['GET'])
        async def predict_cf():
            uid = request.args.get('uid')
            k = int(request.args.get('k'))
            user_based = True if request.args.get('userbased') == '1' else False
            result = cf.predict_interests(uid, k, user_based)
            return jsonify(result)

        # http://localhost:8090/train_nn?uid=123464&train=../Data/recommender/datasets/train.json
        @app.route('/train_nn', methods=['GET'])
        async def train_nn():
            uid = request.args.get('uid')
            train = request.args.get('train')
            result = tc.train_model(uid, train, n_epochs=100)
            return jsonify(result)

        # http://localhost:8090/predict_nn?uid=123464&test=../Data/recommender/datasets/test.json
        @app.route('/predict_nn', methods=['GET'])
        async def predict_nn():
            uid = int(request.args.get('uid'))
            if os.path.exists(tc.MODEL_UID + str(uid)):
                # Use cache.
                test = request.args.get('test')
                predictions = tc.predict(uid, test)
                # How to return results?
                return jsonify(predictions)
            else:
                return jsonify('No model found for user {uid}.')

        return app


if __name__ == '__main__':
    recommender = Recommender()
    file = open('../Service/connections.json', 'r')
    conn = json.loads(file.read())
    file.close()
    ip = conn['Recommender']['ip']
    port = conn['Recommender']['port']
    recommender.get_app().run(host=ip, port=port)
