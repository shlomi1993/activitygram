# Shlomi Ben-Shushan


import numpy as np
from sklearn.metrics.pairwise import pairwise_distances


class CollaborativeFiltering:

    def __init__(self):
        """
        Collaborative-Filtering object constructor.
        Initialize attributes that needed to be shared with different functions.
        """
        self.unique_users = []
        self.unique_interests = []
        self.userId_to_index = {}   # a mapper from user-id to serial index.
        self.interestId_to_index = {}  # a mapper from interest-id to serial index.
        self.interestId_to_title = {}  # a mapper from interest-id to interest title.
        self.user_based_matrix = []
        self.item_based_matrix = []

    def create_pred_matrix(self, ratings, interests):
        """
        This function creates user-based prediction matrix if user_based is True
        and item-based prediction matrix if it is False.

        :param ratings:
        :param interests:
        :return:
        """

        # Update object's attributes.
        self.unique_users = ratings['userId'].unique().tolist()
        self.unique_users.sort()
        self.unique_interests = ratings['interestId'].unique().tolist()
        self.unique_interests.sort()
        self.userId_to_index = dict(zip(self.unique_users, list(range(len(self.unique_users)))))
        self.interestId_to_index = dict(zip(self.unique_interests, list(range(len(self.unique_interests)))))
        self.interestId_to_title = dict(zip(interests['interestId'], interests['title']))

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
            i = self.userId_to_index[u]
            j = self.interestId_to_index[m]
            user_based_pred[i][j] = 0
            item_based_pred[i][j] = 0
        self.user_based_matrix = user_based_pred
        self.item_based_matrix = item_based_pred

    def predict_interests(self, user_id, k, is_user_based=True):
        """
        This method predicts the "k" interests recommended to the user "user_id"
        according to the user-based-matrix if "is_user_based" is True or to the
        item-based-matrix if it is False. This method returns the interests as
        tuples of interest-ID and match-score for the given user.

        :param user_id: a number that represents a user.
        :param k: the number of predictions needed
        :param is_user_based: a boolean that tells which matrix to use.
        :return: list of k most recommended interests as tuples as described above.
        """
        output = []
        matrix = self.user_based_matrix if is_user_based else self.item_based_matrix
        row = matrix[self.userId_to_index[int(user_id)]]
        recommendations = list(zip(self.unique_interests, row))
        recommendations.sort(reverse=True, key=lambda tup: tup[1])
        for r in recommendations[:k]:
            output.append({
                'interest_id': r[0],
                'interest_name': self.interestId_to_title[r[0]],
                'match': r[1]
            })
        return output
