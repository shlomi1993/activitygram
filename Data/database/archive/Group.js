class Group {
  constructor(name = 'name', 
              date_of_creation = Date(),
              description = "",
              conditions = "",
              group_managers = [],
              participants = [],
              image = null,
              qr_code = null,
              common_interest = null,
              history_of_events = []) {
    this.id = null;
    this.name = name;
    this.date_of_creation = date_of_creation;
    this.description = description;
    this.conditions = conditions;
    this.group_managers = group_managers;
    this.participants = participants;
    this.image = image;
    this.qr_code = qr_code;
    this.common_interest = common_interest;
    this.history_of_events = history_of_events;
    this.forDB = {name : name,
                  date_of_creation : date_of_creation,
                  description : description,
                  conditions : conditions,
                  group_managers : group_managers,
                  participants : participants,
                  image : image,
                  qr_code : qr_code,
                  common_interest : common_interest,
                  history_of_events : history_of_events};
  }
  set set_id(val){
    this.id = val;
  }
}
module.exports = Group;