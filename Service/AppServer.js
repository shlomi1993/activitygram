const fs = require("fs");
const conn = JSON.parse(fs.readFileSync("connections.json"));

const axios = require("axios");
const multer = require("multer");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const database = require("../Data/database/database");

const recommenderUri = `http://${conn.Recommender.ip}:${conn.Recommender.port}`;
const geocoderUri = `http://${conn.Geocoder.ip}:${conn.Geocoder.port}`;

let allActivities;
var ratingsSize = 0;
var userActivityLogSizes = {};

app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "./images");
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  let msg = "AppServer is listening.";
  res.status(200).send(msg);
  console.log(msg);
});

app.get("/geocode", (req, res) => {
  let request = `${geocoderUri}/geocode?address=${req.query.address}`;
  axios
    .get(request)
    .then((result) => {
      res.status(200).send(result.data);
      console.log("geocode request succeeded.");
    })
    .catch((err) => {
      let msg = "geocode request failed.";
      res.status(500).send(msg);
      console.error(msg);
    });
});

app.get("/geocodeReverse", (req, res) => {
  let request = `${geocoderUri}/reverse?latitude=${req.query.latitude}&longitude=${req.query.longitude}`;
  axios
    .get(request)
    .then((result) => {
      res.status(200).send(result.data);
      console.log("geocodeReverse request succeeded.");
    })
    .catch((error) => {
      let msg = "geocodeReverse request failed.";
      res.status(500).send(msg);
      console.error(msg);
    });
});

app.post("/imageUpload", upload.array("photo", 3), (req, res) => {
  res.status(200).json({
    message: "success!",
  });
});

/** USERS */

app.get("/allUsers", (req, res) => {
  database
    .getAllUsers()
    .then((result) => {
      res.status(200).send(result);
      console.log("allUsers request succeeded.");
    })
    .catch((error) => {
      let msg = "allUsers request failed.";
      res.status(500).send(msg);
      console.error(msg);
    });
});

app.get("/getUserById", (req, res) => {
  database.getUserById(req.query.user_id).then((user) => res.send(user));
});

app.get("/getUserByEmail", (req, res) => {
  database.getUserByEmail(req.query.user_email).then((user) => res.send(user));
});

app.post("/createUser", (req, res) => {
  const newUser = JSON.parse(decodeURIComponent(req.query.user));
  if (req.body.profileImage) {
    const newProfileImage = JSON.parse(
      decodeURIComponent(req.body.profileImage)
    );
    database
      .createUserWithImage(newUser, newProfileImage)
      .then((result) => {
        res.status(200).send(result);
        console.log("createUser request succeeded.");
      })
      .catch((error) => {
        let msg = "createUser request failed.";
        res.status(500).send(msg);
        console.error(msg);
      });
  } else {
    database
      .createUser(newUser)
      .then((result) => {
        res.status(200).send(result);
        console.log("createUser request succeeded.");
      })
      .catch((error) => {
        let msg = "createUser request failed.";
        res.status(500).send(msg);
        console.error(msg);
      });
  }
});

/** ACTIVITIES */

app.post("/createActivity", (req, res) => {
  let newActivity = JSON.parse(decodeURIComponent(req.query.activity));
  newActivity["images"] = JSON.parse(decodeURIComponent(req.body.images));
  newActivity["creationTime"] = Date();
  database
    .createNewActivity(newActivity)
    .then((result) => {
      res.status(200).send(result);
      console.log("createActivity request succeeded.");
    })
    .catch((error) => {
      let msg = "createActivity request failed.";
      res.status(500).send(msg);
      console.error(msg);
    });
});

app.post("/updateActivityParticipants", (req, res) => {
  const participants = JSON.parse(decodeURIComponent(req.query.participants));
  database
    .updateActivityParticipants(req.query.activity_id, participants)
    .then((result) => {
      res.status(200).send(result);
      console.log("updateActivityParticipants request succeeded.");
    })
    .catch((error) => {
      let msg =
        "updateActivityParticipants request failed. Status: " +
        error.response.statusText;
      res.status(error.response.status).send(msg);
      console.error(msg);
    });
});

app.get("/getActivityById", (req, res) => {
  database
    .getActivityById(req.query.activity_id)
    .then((event) => res.send(event));
});

app.post("/search", (req, res) => {
  console.log(`\nin app.post('/search', (req, res)`);
  console.log(`req.body ${JSON.stringify(req.body)}`);
  const name_to_search = req.body.title;
  const userState = req.body.searchUsers;
  const activitiesState = req.body.searchActivities;
  const groupState = req.body.searchGroups;

  database
    .searchActivity(name_to_search, userState, activitiesState, groupState)
    .then((result) => {
      res.send(result);
      console.log(`result = ${JSON.stringify(result)}`);
      console.log("searchActivity request succeeded.");
    })
    .catch((error) => {
      let msg = "searchActivity request failed.";
      res.status(500).send(msg);
      console.error(msg);
      console.error(error);
    });
});

app.get("/getActivitiesByInterest", (req, res) => {
  if (allActivities) {
    const filtered = allActivities.filter((act) => {
      return act.category === req.query.interest;
    });
    res.send(filtered);
  } else {
    database.getAllActivities().then((activities) => {
      const filtered = activities.filter((act) => {
        return act.category === req.query.interest;
      });
      res.send(filtered);
    });
  }
});

app.get("/getCreatedByUserActivities", (req, res) => {
  if (allActivities) {
    const filtered = allActivities
      .filter((act) => {
        return act.managers && Array.isArray(act.managers);
      })
      .filter((act) => {
        return act.managers.find((p) => {
          return p === req.query.user_id;
        });
      });
    res.send(filtered);
  } else {
    database.getAllActivities().then((activities) => {
      const filtered = activities
        .filter((act) => {
          return act.managers && Array.isArray(act.managers);
        })
        .filter((act) => {
          return act.managers.find((p) => {
            return p === req.query.user_id;
          });
        });
      res.send(filtered);
    });
  }
});

app.get("/getCreatedByUserActivities", (req, res) => {
  if (allActivities) {
    const filtered = allActivities
      .filter((act) => {
        return act.managers && Array.isArray(act.managers);
      })
      .filter((act) => {
        return act.managers.find((p) => {
          return p === req.query.user_id;
        });
      });
    res.send(filtered);
  } else {
    database.getAllActivities().then((activities) => {
      const filtered = activities
        .filter((act) => {
          return act.managers && Array.isArray(act.managers);
        })
        .filter((act) => {
          return act.managers.find((p) => {
            return p === req.query.user_id;
          });
        });
      res.send(filtered);
    });
  }
});

app.get("/getAllActivities", (req, res) => {
  database.getAllActivities().then((activities) => {
    allActivities = activities;
    res.send(activities);
  });
});

app.get('/getMyActivities', (req, res) => {
	if (allActivities) {
		const filtered =
			allActivities.filter((act) => { return act.participants && Array.isArray(act.participants) })
				.filter((act) => { return act.participants.find((p) => { return p === req.query.user_id }) });
		res.send(filtered)
	} else {
		database.getAllActivities().then((activities) => {
			const userId = req.query.user_id;
			const filtered =
				activities.filter((act) => { return act.participants && Array.isArray(act.participants) })
					.filter((act) => { return act.participants.find((p) => { return p === req.query.user_id }) });
			res.send(filtered)
		});
	}
});

/** GROUPS */

app.post("/createGroup", (req, res) => {
  newGroup = {
    title: req.body.title,
    description: req.body.description,
    commonInterests: req.body.commonInterests,
    preconditions: req.body.preconditions,
    initiator: req.body.initiator,
    managers: req.body.managers,
    participants: req.body.participants,
    images: req.body.images,
    qrCode: req.body.qrCode,
    activityHistory: [],
    creationTime: Date(),
  };
  let result = database.createGroup(newGroup);
  res.send(result);
});

/** Interests */

app.get("/allInterests", (req, res) => {
  database
    .getAllInterests()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((error) => {
      let msg = "allInterests request failed.";
      res.status(500).send(msg);
      console.error(msg);
    });
});

/** Search */

app.post("/search", (req, res) => {
  console.log(`\nin app.post('/search', (req, res)`);
  console.log(`req.body ${JSON.stringify(req.body)}`);
  const name_to_search = req.body.title;
  const userState = req.body.searchUsers;
  const activitiesState = req.body.searchActivities;
  const groupState = req.body.searchGroups;

  database
    .searchActivity(name_to_search, userState, activitiesState, groupState)
    .then((result) => {
      res.status(200).send(result);
      // console.log
      console.log("searchActivity request succeeded.");
    })
    .catch((error) => {
      let msg = "searchActivity request failed.";
      res.status(500).send(msg);
      console.error(msg);
      console.error(error);
    });
  // let result = database.searchActivity(name_to_search, userState, activitiesState, groupState)
  // console.log(`result is ${result}`)
  // res.send(result);
});
app.get("/activities", (req, res) => {
  const { name } = req.query;
  database
    .searchActivity(name)
    .then((result) => {
      res.status(200).send(result);
      // console.log
      console.log("searchActivity request succeeded.");
    })
    .catch((error) => {
      let msg = "searchActivity request failed.";
      res.status(500).send(msg);
      console.error(msg);
      console.error(error);
    });
});
app.get("/users", (req, res) => {
  const { name } = req.query;
  database
    .searchUsers(name)
    .then((result) => {
      res.status(200).send(result);
      // console.log
      console.log("searchUsers request succeeded.");
    })
    .catch((error) => {
      let msg = "searchUsers request failed.";
      res.status(500).send(msg);
      console.error(msg);
      console.error(error);
    });
});
/** RECOMMENDATIONS */

async function train_cf() {
  database.fetchDataForCF().then((results) => {
    axios
      .post(`${recommenderUri}/train_cf`, {
        interests: results["interests"],
        ratings: results["ratings"],
      })
      .then(
        (res) => {
          console.log("train_cf request succeed.");
        },
        (err) => {
          console.log("train_cf request failed.");
        }
      );
  });
}

app.get("/getInterestPrediction", (req, res) => {
  let uid = req.query.uid;
  let k = req.query.k;
  let userbased = req.query.userbased;
  let request = `${recommenderUri}/predict_cf?uid=${uid}&k=${k}&userbased=${userbased}`;
  axios
    .get(request)
    .then((result) => {
      res.status(200).send(result.data);
      console.log("getInterestPrediction request succeeded.");
    })
    .catch((err) => {
      let msg = "getInterestPrediction request failed.";
      res.status(500).send(msg);
      console.error(msg);
    });
});

async function train_nn(uid) {
  database.fetchDataForNN(uid).then((results) => {
    axios
      .post(`${recommenderUri}/train_nn`, {
        uid: uid,
        train: results,
      })
      .then(
        (res) => {
          console.log("train_nn request succeed.");
        },
        (err) => {
          console.log("train_nn request failed.");
        }
      );
  });
}

app.get("/getActivityPrediction", (req, res) => {
  let uid = req.query.uid;
  let interest = req.query.interest;
  database
    .getActivitiesByCategory(interest)
    .then((activities) => {
      test = [];
      for (const a of activities) {
        let current = Date();
        if (Date.parse(a.startDateTime) > Date.parse(current)) {
          let testObj = {
            activity_id: a._id.toString(),
            activity_name: a.title,
            description: a.description,
          };
          test.push(testObj);
        }
      }
      return test;
    })
    .then((test) => {
      axios
        .post(`${recommenderUri}/predict_nn`, {
          uid: uid,
          testSet: test,
        })
        .then((response) => {
          let ids = [];
          for (const p of response.data) {
            if (
              p.pred === "Will-be-interested" ||
              p.pred === "Will-participate"
            ) {
              // Can be separated later to to options.
              ids.push(p.aid);
            }
          }
          database
            .getActivitiesByPred(ids)
            .then((fullActivities) => {
              res.send(JSON.stringify(fullActivities));
              console.log("predict_nn request succeed.");
            })
            .catch((err) => {
              console.log("predict_nn request failed.");
            });
        })
        .catch((err) => {
          console.log("predict_nn request failed.");
        });
    });
});

async function refreshPredMatrix() {
  let n = database.getCurrentRatingSize();
  if (ratingsSize * 1.05 < n) {
    train_cf().then(() => {
      ratingsSize = n;
      console.log("Prediction matrix refreshed.");
    });
  } else {
    console.log("Prediction matrix is sufficiently updated.");
  }
}

async function refreshUserModel(uid) {
  let request = `${recommenderUri}/dataset_size?uid=${uid}`;
  axios
    .get(request)
    .then((res) => {
      let n = res.data;
      if (!userActivityLogSizes[uid] || userActivityLogSizes[uid] * 1.05 < n) {
        train_nn(uid).then(() => {
          userActivityLogSizes[uid] = n;
          console.log(`Model of uid ${uid} refreshed.`);
        });
      } else {
        console.log(`Model of uid ${uid} is sufficiently updated.`);
      }
    })
    .catch((err) => {
      console.error("refreshUserModel function failed.");
    });
}

app.listen(conn.App.port, () => {
  console.log(
    `AppServer is available at: http://${conn.App.ip}:${conn.App.port}/`
  );
});
