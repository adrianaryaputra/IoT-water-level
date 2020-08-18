#### 📑 Table of Content
- [Measurement Data Recording](#measurement-data-recording)
      - [🔗 URL :  `/record`](#-url--record)
  - [Retrieve Measurement Data](#retrieve-measurement-data)
    - [🔎 Parameter](#-parameter)
    - [📥 Response](#-response)
  - [Retrieve Measurement Grouped by Devices](#retrieve-measurement-grouped-by-devices)
    - [🔎 Parameter](#-parameter-1)
    - [📥 Response](#-response-1)
  - [Add a New Measurement Data](#add-a-new-measurement-data)
    - [📚 Data Structure](#-data-structure)
    - [📥 Response](#-response-2)
    - [⚠ Error Code](#-error-code)
- [Devices](#devices)
      - [🔗 URL :  `/device`](#-url--device)
  - [Retrieve List of Existing Devices](#retrieve-list-of-existing-devices)
    - [🔎 Parameter](#-parameter-2)
    - [📥 Response](#-response-3)
    - [⚠ Error Code](#-error-code-1)
  - [Add New Device](#add-new-device)
    - [📚 Data Structure](#-data-structure-1)
    - [📥 Response](#-response-4)
    - [⚠ Error Code](#-error-code-2)
  - [Edit Device](#edit-device)
    - [📚 Data Structure](#-data-structure-2)
    - [📥 Response](#-response-5)
    - [⚠ Error Code](#-error-code-3)





# Measurement Data Recording 

this is an interface to record data to the database. you can query and push data to this interface.
#### 🔗 URL :  `/record`


## Retrieve Measurement Data
| HTTP method | link      |
| :---------- | :-------- |
| `GET`       | `/record` |

retrieve available record data from database with matching queries criteria.

### 🔎 Parameter
- `mac_address` - specify devices by MAC addres to return record from. Optional.
- `limit` - amount of results. Optional, default are 20 and maximum are 200.
- `date_from` - return all record since this date. Must be a valid javascript date.
- `date_to` - return all record up to this date. Must be a valid javascript date.

### 📥 Response
A JSON list containing all measurement record matching queries criteria.
```json
[
  {
    "_id":"5f2d21f60792f188e80fdaa3",
    "mac_address":"0A-1B-2C-3D-4E-5A",
    "timestamp":"2020-08-07T09:42:14.271Z",
    "lifetime":100,
    "measurement": {
      "level":8,
      "temperature":32.43,
      "humidity":67.213
    },
  },
  { <measurementObj> },
  { <measurementObj> }
]
```


## Retrieve Measurement Grouped by Devices 
| HTTP method | link                |
| :---------- | :------------------ |
| `GET`       | `/record/aggregate` |

retrieve available record data from database with matching queries criteria, grouped by device MAC Address.

### 🔎 Parameter
- `limit` - amount of results. Optional, default are 20 and maximum are 200.
- `date_from` - return all record since this date. Must be a valid javascript date.
- `date_to` - return all record up to this date. Must be a valid javascript date.

### 📥 Response
A JSON list containing all measurement record matching queries criteria, grouped by device MAC Address.
```json
[
  {
    "_id": "00-11-22-33-44-01",
    "name": "Batubara",
    "last_seen": "2020-08-08T03:48:35.794Z",
    "update_time": 100,
    "location": {
      "lat": -7.27126,
      "long": 123.28734
    },
    "measurement": [
      {
        "level": 8,
        "temperature": 32.43,
        "humidity": 67.213,
        "timestamp": "2020-08-08T03:48:35.783Z"
      },
      { <measurementObj> },
      { <measurementObj> }
    ]
  },
  { <groupDeviceObj> },
  { <groupDeviceObj> }
]
```


## Add a New Measurement Data
| HTTP method | link      |
| :---------- | :-------- |
| `POST`      | `/record` |

this interface use **application/json** body to add new measurement data to server.

### 📚 Data Structure

```json
{
  "mac": "1a-2b-3c-4d-5e-6f",
  "lifetime": 600,
  "measurement": {
    "level": "12",
    "temperature": 32.43,
    "humidity": 67.213
  }
}
```

### 📥 Response
```json
{
  "message": "ok", 
  "param": {
    "lifetime": 100 // in second
  }
}
```

### ⚠ Error Code
| http status | message               |
| :---------- | :-------------------- |
| 422         | `invalid data schema` |






# Devices
devices is an interface to obtain information about all existing device in the system.

#### 🔗 URL :  `/device`



## Retrieve List of Existing Devices
| HTTP method | link      |
| :---------- | :-------- |
| `GET`       | `/device` |
retrieve list of devices from database

### 🔎 Parameter
`mac_address` - specify devices by MAC addres to return device details from. Optional.

### 📥 Response
A JSON list containing all devices. Example :
```json
[
  {
    "_id": "5f2d21f60792f188e80fdaa3",
    "mac_address": "0A-1B-2C-3D-4E-5A",
    "name": "Binjai",
    "status": "online",
    "update_time": 600,
    "pipe_length": 4,
    "alarm":{
      "siaga4": 2.5,
      "siaga3": 2.8,
      "siaga2": 3,
      "siaga1": 3.2,
      "evakuasi": 3.3,
    },
    "location": {
      "lat": -7.12312,
      "long": 141.32523
    }
  },
  { <deviceObj> },
  { <deviceObj> }
]
```

### ⚠ Error Code
| http status | message            |
| :---------- | :----------------- |
| 500         | cannot obtain data |



## Add New Device
| HTTP method | link      |
| :---------- | :-------- |
| `POST`      | `/device` |

this interface use **application/json** body to send a new device data to server. You can't update existing device using this method. to update existing device, use `PUT / device` instead.

### 📚 Data Structure
```json
{
  "mac_address": "0A-1B-2C-3D-4E-5A",
  "name": "Binjai",
  "update_time": 600,
  "pipe_length": 4,
  "alarm":{       //optional
    "siaga4": 2.5,
    "siaga3": 2.8,
    "siaga2": 3,
    "siaga1": 3.2,
    "evakuasi": 3.3,
  },
  "location": {   //optional
    "lat": -7.12312,
    "long": 141.32523
  }
}
```

### 📥 Response
```json
{
  "message": "ok"
}
```

### ⚠ Error Code
| http status | message                                                                |
| :---------- | :--------------------------------------------------------------------- |
| 422         | `invalid data schema`                                                  |
| 422         | `<macAddress> exist in database. use PUT method to update the devices` |



## Edit Device
| HTTP method | link      |
| :---------- | :-------- |
| `PUT`       | `/device` |

this interface use **application/json** body to edit a device data in the server. Editing non-existing data will throw an error. Use `POST /device` to add a new data. 

### 📚 Data Structure
```json
{
  "mac_address": "0A-1B-2C-3D-4E-5A",
  "name": "Binjai",
  "update_time": 600,
  "location": {
    "lat": -7.12312,
    "long": 141.32523
  }
}
```

### 📥 Response
```json
{
  "message": "ok"
}
```

### ⚠ Error Code
| http status | message                                                                |
| :---------- | :--------------------------------------------------------------------- |
| 422         | `invalid data schema`                                                  |
| 422         | `<macAddress> exist in database. use PUT method to update the devices` |