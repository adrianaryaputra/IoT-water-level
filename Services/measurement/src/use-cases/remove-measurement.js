module.exports = ({measurementDB}) => {

  return async(mac_address) => {

    result = await measurementDB().deleteAllMac(mac_address);
    return result;

  }

}