module.exports = ({modelDB}) => {

  const baseQuery = modelDB.find({});

  return _createMethod(baseQuery);

  function _createMethod(q = baseQuery){
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
    return _createMethod(baseQuery);
  }

  function findByMac(mac_address) {
    const q = baseQuery.find({mac_address});
    return _createMethod(q);
  }

  function dateFrom(date) {
    const q = baseQuery.find({
      timestamp: {$gte: date}
    });
    return _createMethod(q);
  }

  function dateTo(date) {
    const q = baseQuery.find({
      timestamp: {$lte: date}
    });
    return _createMethod(q);
  }

  function sort(order) {
    const q = baseQuery.sort({timestamp: order});
    return _createMethod(q);
  }

  function limit(value) {
    const q = baseQuery.limit(value);
    return _createMethod(q);
  }

  function create(obj) {
    return modelDB.create(obj);
  }

  function submit() {
    return baseQuery.exec();
  }

  function deleteAllMac(mac_address) {
    return modelDB.deleteMany({mac_address});
  }

}