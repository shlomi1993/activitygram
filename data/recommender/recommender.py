# Shlomi Ben-Shushan


import sys
import pandas as pd
from collaborative_filtering import CollaborativeFiltering
from time import sleep
from quart import Quart, request, g, jsonify


class Recommender:

    def __init__(self):
        self.cf = CollaborativeFiltering()
        self.db = []  # place-holder
        self.update()
        self.auto_update = True

    def fetch(self):
        interests = pd.read_csv('datasets/debug/interests.csv', low_memory=False)
        ratings = pd.read_csv('datasets/debug/ratings.csv', low_memory=False)
        return interests, ratings

    def update(self):
        interests, ratings = self.fetch()
        self.cf.create_pred_matrix(ratings, interests)

    def get_app(self):
        app = Quart(__name__)

        async def scheduled_update():
            while self.auto_update:
                sleep(600)
                self.update()

        app.add_background_task(scheduled_update)
        self.auto_update = True

        @app.route('/', methods=['GET'])
        async def get_test():
            return 'service is up'

        @app.route('/turnon', methods=['GET'])
        async def turn_on():
            if not self.auto_update:
                app.add_background_task(scheduled_update)
                self.auto_update = True
            return 'dataset auto-update if on'

        @app.route('/turnoff', methods=['GET'])
        async def turn_off():
            if self.auto_update:
                self.auto_update = False
            return 'dataset auto-update if off'

        @app.route('/update', methods=['GET'])
        async def update():
            self.update()
            return 'dataset update completed'

        @app.route('/predict', methods=['GET'])
        async def predict():
            uid = request.args.get('uid')
            k = int(request.args.get('k'))
            user_based = True if request.args.get('userbased') == '1' else False
            result = self.cf.predict_interests(uid, k, user_based)
            return jsonify(result)

        return app


if __name__ == '__main__':
    recommender = Recommender()
    recommender.get_app().run(host=sys.argv[1], port=int(sys.argv[2]))
