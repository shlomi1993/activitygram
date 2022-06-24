# Shlomi Ben-Shushan


import pickle
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import pairwise_distances


MODEL_CF = './models/model_collaborative_filtering'

class CollaborativeFiltering:

    def __init__(self):
        self.unique_users = []
        self.unique_interests = []
        self.userId_to_index = {}   # a mapper from user-id to serial index.
        self.interestId_to_index = {}  # a mapper from interest-id to serial index.
        self.interestId_to_title = {}  # a mapper from interest-id to interest title.
        self.user_based_matrix = []
        self.item_based_matrix = []

def create_pred_matrix(ratings_file, interests_file):
    cf = CollaborativeFiltering()
    interests = pd.read_csv(interests_file, low_memory=False)
    ratings = pd.read_csv(ratings_file, low_memory=False)

    # Update object's attributes.
    cf.unique_users = ratings['userId'].unique().tolist()
    cf.unique_users.sort(key=lambda u: int(u, 16))
    cf.unique_interests = ratings['interestId'].unique().tolist()
    cf.unique_interests.sort(key=lambda i: int(i, 16))
    cf.userId_to_index = dict(zip(cf.unique_users, list(range(len(cf.unique_users)))))
    cf.interestId_to_index = dict(zip(cf.unique_interests, list(range(len(cf.unique_interests)))))
    cf.interestId_to_title = dict(zip(interests['interestId'], interests['title']))

    # Create rating difference matrix and calculate mean.
    ratings_pd = ratings.pivot_table(index='userId', columns='interestId', values='rating')
    mean = ratings_pd.mean(axis=1).to_numpy().reshape(-1, 1)
    ratings_diff = ratings_pd.to_numpy() - mean
    ratings_diff[np.isnan(ratings_diff)] = 0
    
    # Calculate the required prediction matrix (depending on user_based boolean).
    user_similarity = 1 - pairwise_distances(ratings_diff, metric='cosine')
    user_based_pred = mean + user_similarity.dot(ratings_diff) / np.array([np.abs(user_similarity).sum(axis=1)]).T
    item_similarity = 1 - pairwise_distances(ratings_diff.T, metric='cosine')
    item_based_pred = mean + ratings_diff.dot(item_similarity) / np.array([np.abs(item_similarity).sum(axis=1)])

    # Reset user rated interests in the prediction matrix.
    for u, m in zip(ratings['userId'], ratings['interestId']):
        i = cf.userId_to_index[u]
        j = cf.interestId_to_index[m]
        user_based_pred[i][j] = 0
        item_based_pred[i][j] = 0
    cf.user_based_matrix = user_based_pred
    cf.item_based_matrix = item_based_pred
    with open(MODEL_CF, 'wb') as out:
        pickle.dump(cf, out)

def predict_interests(user_id, k, is_user_based=True):
    try:
        with open(MODEL_CF, 'rb') as file: 
            cf = pickle.load(file)
    except FileNotFoundError:
        return { 'error': 'Could not find CF model file.' }
    output = []
    matrix = cf.user_based_matrix if is_user_based else cf.item_based_matrix
    try:
        row = matrix[cf.userId_to_index[user_id]]
    except KeyError:
        msg = f'Index error: {user_id}'
        print(msg)
        return { 'error': msg }
    recommendations = list(zip(cf.unique_interests, row))
    recommendations.sort(reverse=True, key=lambda tup: tup[1])
    for r in recommendations[:k]:
        output.append({
            'interest_id': r[0],
            'interest_name': cf.interestId_to_title[r[0]],
            'match': r[1]
        })
    return output

# test
# cf = CollaborativeFiltering()
# create_pred_matrix('./datasets/ratings.csv', './datasets/interests.csv')
# print(predict_interests('627659c91fbdd7e2c67d5e11', 10, True))
