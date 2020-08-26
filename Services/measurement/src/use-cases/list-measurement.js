module.exports = ({measurementDB}) => {

  return async (query) => {

    const db = measurementDB().findAll();

    if(query.mac_address) db.findByMac(query.mac_address);
    if(query.date_from) db.dateFrom(query.date_from);
    if(query.date_to) db.dateTo(query.date_to);
    db.sort(-1);
    if(query.limit) db.limit(query.limit);

    result = await db.submit();
    return result;

  }

}