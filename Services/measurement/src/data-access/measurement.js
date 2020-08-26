module.exports = ({modelDB}) => {

  return () => {
    this.modelDB = modelDB;
    return _createMethod();
  }

  function _createMethod(q = modelDB.find({})){
    return Object.freeze({
      findAll,
      findByMac,
      create,
      dateFrom,
      dateTo,
      sort,
      limit,
      submit,
      deleteAllMac,
      baseQuery: q,
    })
  }

  function findAll() {
    return _createMethod(this.baseQuery);
  }

  function findByMac(mac_address) {
    const q = this.baseQuery.find({mac_address});
    return _createMethod(q);
  }

  function dateFrom(date) {
    const q = this.baseQuery.find({
      timestamp: {$gte: date}
    });
    return _createMethod(q);
  }

  function dateTo(date) {
    const q = this.baseQuery.find({
      timestamp: {$lte: date}
    });
    return _createMethod(q);
  }

  function sort(order) {
    const q = this.baseQuery.sort({timestamp: order});
    return _createMethod(q);
  }

  function limit(value) {
    const q = this.baseQuery.limit(value);
    return _createMethod(q);
  }

  function create(obj) {
    return modelDB.create(obj);
  }

  function submit() {
    return this.baseQuery.exec();
  }

  function deleteAllMac(mac_address) {
    return modelDB.deleteMany({mac_address});
  }

}