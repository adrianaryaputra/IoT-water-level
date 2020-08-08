#### 📑 Table of Content

- [Measurement Data Recording](#measurement-data-recording)
			- [🔗 URL :  `/record`](#-url--record)
	- [Retrieve Measurement Data - `GET /record`](#retrieve-measurement-data---get-record)
		- [🔎 Parameter](#-parameter)
		- [📥 Response](#-response)
	- [Add a New Measurement Data - `POST /record`](#add-a-new-measurement-data---post-record)
		- [📚 Data Structure](#-data-structure)
		- [📥 Response](#-response-1)
		- [⚠ Error Code](#-error-code)
- [Devices](#devices)
			- [🔗 URL :  `/device`](#-url--device)
	- [Retrieve List of Existing Devices - `GET /device`](#retrieve-list-of-existing-devices---get-device)
		- [🔎 Parameter](#-parameter-1)
		- [📥 Response](#-response-2)
		- [⚠ Error Code](#-error-code-1)
	- [Add New Device - `POST /device`](#add-new-device---post-device)
		- [📚 Data Structure](#-data-structure-1)
		- [📥 Response](#-response-3)
		- [⚠ Error Code](#-error-code-2)
	- [Edit Device - `PUT /device`](#edit-device---put-device)
		- [📚 Data Structure](#-data-structure-2)
		- [📥 Response](#-response-4)
		- [⚠ Error Code](#-error-code-3)

# Measurement Data Recording 

this is an interface to record data to the database. you can query and push data to this interface.

#### 🔗 URL :  `/record`


## Retrieve Measurement Data - `GET /record`

retrieve available record data from database with matching queries criteria.

### 🔎 Parameter

`mac_address` - specify devices by MAC addres to return record from. Optional.

`limit` - amount of results. Optional, default are 20 and maximum are 200.

`date_from` - return all record since this date. Must be a valid javascript date.

`date_from` - return all record up to this date. Must be a valid javascript date.

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
	{ ... },
	{ ... }
]
```

## Add a New Measurement Data - `POST /record`

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
		"lifetime": "<Number>" // in second
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



## Retrieve List of Existing Devices - `GET /device`
retrieve listed devices from database

### 🔎 Parameter
`none` - none

### 📥 Response
A JSON list containing all devices.
```json
[
	{
  	"_id": "5f2d21f60792f188e80fdaa3",
  	"mac_address": "0A-1B-2C-3D-4E-5A",
  	"name": "Binjai",
  	"status": "online",
  	"update_time": 600,
  	"location": {
  		"lat": -7.12312,
  		"long": 141.32523
  	}
	},
	{ ... },
	{ ... }
]
```

### ⚠ Error Code
| http status | message            |
| :---------- | :----------------- |
| 500         | cannot obtain data |



## Add New Device - `POST /device`
this interface use **application/json** body to send a new device data to server. You can't update existing device using this method. to update existing device, use `PUT / device` instead.

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
| http status | message  |
| :---------- | :------------------|
| 422         | `invalid data schema`
| 422         | `<macAddress> exist in database. use PUT method to update the devices` 



## Edit Device - `PUT /device`
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
| http status | message  |
| :---------- | :------------------|
| 422         | `invalid data schema`
| 422         | `<macAddress> exist in database. use PUT method to update the devices` 