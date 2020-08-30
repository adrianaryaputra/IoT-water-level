const {
  getMeasurement,
  postMeasurement,
  deleteMeasurement,
} = require('../controller')

module.exports = ({httpRouter, httpCallback, Config}) => {
  
  httpRouter.get(
    Config.HTTP_ADDRESS, 
    httpCallback(getMeasurement)
  );

  httpRouter.post(
    Config.HTTP_ADDRESS, 
    httpCallback(postMeasurement)
  );

  httpRouter.delete(
    Config.HTTP_ADDRESS, 
    httpCallback(deleteMeasurement)
  );

  return httpRouter;
}