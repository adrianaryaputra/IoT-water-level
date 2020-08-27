module.exports = ({measurementDB}) => {

  return async (query) => {

    const measurement = measurementDB();

    if(query.mac_address) measurement.findByMac(query.mac_address);
    if(query.date_from) measurement.dateFrom(query.date_from);
    if(query.date_to) measurement.dateTo(query.date_to);
    measurement.sort(-1);
    if(query.limit) measurement.limit(query.limit);

    result = await measurement.submit();
    return result;

  }

}