from __future__ import division

import numpy as np
import math
import pandas as pd
import csv
import collections

from geopy.geocoders import Nominatim
from geopy.distance import geodesic

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

geolocator = Nominatim(user_agent="Eventure")

trainingCsvPath = "dataset/training.csv"
usersCsvPath = "dataset/users.csv"
eventsCsvPath = "dataset/events.csv"


def getVector(description):
    vectorizer = TfidfVectorizer()                  # create the transform
    vectorizer.fit(description)                     # tokenize and build vocab
    return vectorizer.transform([description[0]])   # encode document and return


def getEventTfidfVector(eventName_1, eventsCsv):
    for eventRecord in eventsCsv.iterrows():
        eventRecord = eventRecord[1]
        eventName = eventRecord['event_name']
        if eventName.strip().lower() == eventName_1.strip().lower():
            eventDescription = [eventRecord['description']]
            return getVector(eventDescription)


def getPastEventsTfidfVector(userPastEvents, eventsCsv):
    # past_events_ids = get_past_events_of_user(uid)
    userPastEventsList = userPastEvents.split(",")
    # print("past list: ", userPastEventsList)
    pastEventsTfidfVectorList = [getEventTfidfVector(eventName, eventsCsv) for eventName in userPastEventsList]
    pastEventsDescription = ''
    for description in pastEventsTfidfVectorList:
        pastEventsDescription = pastEventsDescription + description
    pastEventsTfidfVector = getVector(pastEventsDescription)
    return pastEventsTfidfVector


def computeCosineSimilarity(vector_1, vector_2):
    return

def compute_relevance_feature(userPastEvents, upcomingEventName, eventsCsv):
    pastEventsTfidfVector = getPastEventsTfidfVector(userPastEvents, eventsCsv)
    upcomingEventTfidfVector = getEventTfidfVector(upcomingEventName, eventsCsv)
    eventsCosineSimilarity = cosine_similarity(pastEventsTfidfVector, upcomingEventTfidfVector)
    return eventsCosineSimilarity  # 0..1


def computeFeatures(tUserName, tEventName, usersCsvPath, eventsCsvPath):
    print("user: ", tUserName, " event: ", tEventName)
    usersCsv = pd.read_csv(usersCsvPath)
    eventsCsv = pd.read_csv(eventsCsvPath)

    for userRecord in usersCsv.iterrows():
        userRecord = userRecord[1]
        userName = userRecord['user_name']
        if userName.lower() == tUserName.lower():
            userLocation = userRecord['user_location']
            print("user loc: ", userLocation)
            userPastEvents = userRecord['past_event_names']

    for eventRecord in eventsCsv.iterrows():
        eventRecord = eventRecord[1]
        eventName = eventRecord['event_name']
        if eventName.lower() == tEventName.lower():
            eventLocation = eventRecord['event_location']
            print("event loc: ", eventLocation)
            # histogram
            upcomingEventName = eventName.lower()
        # print(upcomingEventDescription)

    # call tProximity = calculateProximity(userLocation, eventLocation)
    # call tRelevance = calculateRelevance(?,?)
    tProximity = calculateProximity(userLocation, eventLocation)
    tRelevance = compute_relevance_feature(upcomingEventName, userPastEvents, eventsCsv)
    print("tRelevance: ", tRelevance)
    # relevance
    featureVector = [tUserName, tEventName, tProximity, tRelevance]
    return featureVector


def calculateProximity(userLocation, eventLocation):
    uLocation = geolocator.geocode(userLocation)
    eLocation = geolocator.geocode(eventLocation)
    print("uloc: ", uLocation)
    print("eloc: ", eLocation)

    userLatitude = int(uLocation.latitude)
    userLongitude = int(uLocation.longitude)
    print("user lat: ", userLatitude)

    eventLatitude = int(eLocation.latitude)
    eventLongitude = int(eLocation.longitude)
    print("event lat: ", eventLatitude)

    userCoordinates = (userLatitude, userLongitude)
    print("user coordinates: ", userCoordinates)
    eventCoordinates = (eventLatitude, eventLongitude)
    print("event coordinates: ", eventCoordinates)
    # print("user past events", userPastEvents)

    distance = geodesic(userCoordinates, eventCoordinates).miles
    print("distance: ", distance)

    return distance


def prepareDataForWatsonTraining(trainingCsvPath, usersCsvPath, eventsCsvPath):
    trainingCsv = pd.read_csv(trainingCsvPath)
    with open('Documents/Events/finalCsvs/testTrainingData.csv', mode='w') as testTrainingData:
        csvWriter = csv.writer(testTrainingData, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        for trainingDataRow in trainingCsv.iterrows():
            trainingDataRow = trainingDataRow[1]
            featureVector = computeFeatures(trainingDataRow['user_name'], trainingDataRow['event_name'], usersCsvPath,
                                            eventsCsvPath)
            csvWriter.writerow(
                [featureVector[0], featureVector[1], featureVector[2], featureVector[3]])  # add featureVector[1] later
        return testTrainingData


finalTrainingData = prepareDataForWatsonTraining(trainingCsvPath, usersCsvPath, eventsCsvPath)