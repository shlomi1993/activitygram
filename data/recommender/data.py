# Shlomi Ben-Shushan


import pymongo


def description(data):
    """
    This function prints useful information about the given data.

    :param data: a tuple of data from ratingsOld.csv and interests_subset.csv files.
    :return: None. Prints information instead.
    """
    for d in data:
        print(d.head())
        print(d.info())
        print(d.describe(include='all').transpose())


def information(data):
    """
    ?

    :param data: a tuple of data from ratingsOld.csv and interests_subset.csv files.
    :return: None. Prints information instead.
    """

    return {
        'n_users': len(data),
        'n_interests': len(data['interestId'].unique()),
        'n_ratings': len(data['userId'].unique())
    }
