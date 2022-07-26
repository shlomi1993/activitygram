class Event {
  constructor(name = 'name', 
              date = Date(),
              description = "",
              conditions = "",
              group_managers = [],
              participants = [],
              image = null,
              qr_code = null,
              common_interest = null,
              is_done = false) {
    this.id = null;
    this.name = name;
    this.date = date;
    this.description = description;
    this.conditions = conditions;
    this.group_managers = group_managers;
    this.participants = participants;
    this.image = image;
    this.qr_code = qr_code;
    this.common_interest = common_interest;
    this.is_done = is_done;
    this.forDB = {name : name,
                  date : date,
                  description : description,
                  conditions : conditions,
                  group_managers : group_managers,
                  participants : participants,
                  image : image,
                  qr_code : qr_code,
                  common_interest : common_interest,
                  is_done : is_done};
  }
  set set_id(val){
    this.id = val;
  }
}
module.exports = Event;