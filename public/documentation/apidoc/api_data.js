define({ "api": [
  {
    "type": "post",
    "url": "/entity",
    "title": "Create a new entity",
    "name": "Create_Entity",
    "group": "Entity",
    "error": {
      "fields": {
        "ClientError": [
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "LoginRequired",
            "description": "<p>The user needs to log in.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "AccessDeniedError",
            "description": "<p>The user does not have sufficient privileges to perform operation.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "UserNotFoundError",
            "description": "<p>User trying to access API was not found.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "EntityExistsError",
            "description": "<p>User trying to create an entity with a name that already exists.</p> "
          }
        ],
        "ServerError": [
          {
            "group": "ServerError",
            "type": "json",
            "optional": false,
            "field": "EntityDefinitionListError",
            "description": "<p>API factory has encountered an issue while listing entities.</p> "
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": false,
            "field": "entityList",
            "description": "<p>Array containing zero or more entity objects.</p> "
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "entityList.active",
            "description": "<p>Indicates whether or not the entity is active.</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "entityList.name",
            "description": "<p>Name of the entity.</p> "
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": false,
            "field": "entityList.properties",
            "description": "<p>Properties of the entity.</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "entityList.properties.name",
            "description": "<p>Name of the property.</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "entityList.properties.value",
            "description": "<p>Default value of the property.</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "entityList.properties.type",
            "description": "<p>Data type of the property.</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example response from a successful call:",
          "content": "HTTP/1.1 200 OK\n   {\n       \"active\": true,\n       \"instanceClassName\": \"jet5505ed96c31d628c5f4a76f5\",\n       \"name\": \"jet\",\n       \"accountId\": \"5505ed96c31d628c5f4a76f5\",\n       \"_id\": \"5505ede9c31d628c5f4a76fd\",\n       \"__v\": 0,\n       \"properties\": [\n           {\n               \"name\": \"wings\",\n               \"value\": \"\",\n               \"type\": \"number\",\n               \"_id\": \"5505ede9c31d628c5f4a76fe\"\n           }\n       ]\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Entity"
  },
  {
    "type": "delete",
    "url": "/entity/:id",
    "title": "Delete a specific entity by it's ID.",
    "name": "Delete_entity_by_ID_",
    "group": "Entity",
    "error": {
      "fields": {
        "ClientError": [
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "LoginRequired",
            "description": "<p>The user needs to log in.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "AccessDeniedError",
            "description": "<p>The user does not have sufficient privileges to perform operation.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "UserNotFoundError",
            "description": "<p>User trying to access API was not found.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "EntityExistsError",
            "description": "<p>User trying to create an entity with a name that already exists.</p> "
          }
        ],
        "ServerError": [
          {
            "group": "ServerError",
            "type": "json",
            "optional": false,
            "field": "EntityDefinitionListError",
            "description": "<p>API factory has encountered an issue while listing entities.</p> "
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Index (id) of entity to delete.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Status of the delete operation (OK/ERROR).</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Human readable description of the status.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example response from a successful call:",
          "content": "HTTP/1.1 200 OK\n{\n    \"status\": \"OK\",\n    \"description\": \"Entity deleted.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Entity"
  },
  {
    "type": "get",
    "url": "/entity",
    "title": "Get all entities",
    "name": "Get_Entities",
    "group": "Entity",
    "error": {
      "fields": {
        "ClientError": [
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "LoginRequired",
            "description": "<p>The user needs to log in.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "AccessDeniedError",
            "description": "<p>The user does not have sufficient privileges to perform operation.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "UserNotFoundError",
            "description": "<p>User trying to access API was not found.</p> "
          }
        ],
        "ServerError": [
          {
            "group": "ServerError",
            "type": "json",
            "optional": false,
            "field": "EntityDefinitionListError",
            "description": "<p>API factory has encountered an issue while listing entities.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "entityList",
            "description": "<p>Array containing zero or more entity objects.</p> "
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "entityList.active",
            "description": "<p>Indicates whether or not the entity is active.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "entityList.instanceClassName",
            "description": "<p>Internal reference to instance. To be used for bug tracking or debugging.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "entityList.name",
            "description": "<p>Name of the entity.</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "entityList.accountId",
            "description": "<p>Id of the account the entity belongs to.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "entityList._id",
            "description": "<p>Entity index.</p> "
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "entityList.properties",
            "description": "<p>Properties of the entity.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "entityList.properties.name",
            "description": "<p>Name of the property.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "entityList.properties.value",
            "description": "<p>Default value of the property.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "entityList.properties.type",
            "description": "<p>Data type of the property.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "entityList.properties._id",
            "description": "<p>Property index.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example response from a successful call:",
          "content": "HTTP/1.1 200 OK\n{\n        \"entityList\": [\n            {\n                \"active\": true,\n                \"instanceClassName\": \"jet5505ed96c31d628c5f4a76f5\",\n                \"name\": \"jet\",\n                \"accountId\": \"5505ed96c31d628c5f4a76f5\",\n                \"_id\": \"5505ede9c31d628c5f4a76fd\",\n                \"__v\": 0,\n                \"properties\": [\n                    {\n                        \"name\": \"wings\",\n                        \"value\": \"\",\n                        \"type\": \"number\",\n                        \"_id\": \"5505ede9c31d628c5f4a76fe\"\n                    }\n                ]\n            },\n            {\n                \"active\": true,\n                \"instanceClassName\": \"stocklib5505ed96c31d628c5f4a76f5\",\n                \"name\": \"stocklib\",\n                \"accountId\": \"5505ed96c31d628c5f4a76f5\",\n                \"_id\": \"550ef91fd280172590625f27\",\n                \"__v\": 0,\n                \"properties\": [\n                    {\n                        \"name\": \"itemName\",\n                        \"value\": \"\",\n                        \"type\": \"string\",\n                        \"_id\": \"550ef91fd280172590625f2a\"\n                    },\n                    {\n                        \"name\": \"stockDate\",\n                        \"value\": \"\",\n                        \"type\": \"date\",\n                        \"required\": true,\n                        \"_id\": \"550ef91fd280172590625f29\"\n                    },\n                    {\n                        \"name\": \"itemCount\",\n                        \"value\": \"\",\n                        \"type\": \"number\",\n                        \"required\": true,\n                        \"_id\": \"550ef91fd280172590625f28\"\n                    }\n                ]\n            }\n        ]\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Entity"
  },
  {
    "type": "get",
    "url": "/entity/:id",
    "title": "Get a specific entity by it's ID.",
    "name": "Get_entity_by_ID_",
    "group": "Entity",
    "error": {
      "fields": {
        "ClientError": [
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "LoginRequired",
            "description": "<p>The user needs to log in.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "AccessDeniedError",
            "description": "<p>The user does not have sufficient privileges to perform operation.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "UserNotFoundError",
            "description": "<p>User trying to access API was not found.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "EntityExistsError",
            "description": "<p>User trying to create an entity with a name that already exists.</p> "
          }
        ],
        "ServerError": [
          {
            "group": "ServerError",
            "type": "json",
            "optional": false,
            "field": "EntityNotFoundError",
            "description": "<p>API factory cannot find specified entity.</p> "
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Index (id) of entity to get.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "active",
            "description": "<p>Indicates whether or not the entity is active.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "instanceClassName",
            "description": "<p>Internal reference to instance. To be used for bug tracking or debugging.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the entity.</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "accountId",
            "description": "<p>Id of the account the entity belongs to.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Entity index.</p> "
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "properties",
            "description": "<p>Properties of the entity.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "properties.name",
            "description": "<p>Name of the property.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "properties.value",
            "description": "<p>Default value of the property.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "properties.type",
            "description": "<p>Data type of the property.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "properties._id",
            "description": "<p>Property index.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example response from a successful call:",
          "content": "HTTP/1.1 200 OK\n   {\n       \"active\": true,\n       \"instanceClassName\": \"jet5505ed96c31d628c5f4a76f5\",\n       \"name\": \"jet\",\n       \"accountId\": \"5505ed96c31d628c5f4a76f5\",\n       \"_id\": \"5505ede9c31d628c5f4a76fd\",\n       \"__v\": 0,\n       \"properties\": [\n           {\n               \"name\": \"wings\",\n               \"value\": \"\",\n               \"type\": \"number\",\n               \"_id\": \"5505ede9c31d628c5f4a76fe\"\n           }\n       ]\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Entity"
  },
  {
    "type": "post",
    "url": "/instance/:entityName",
    "title": "Create an instance of the specified entity.",
    "name": "Create_instance_",
    "group": "Instance",
    "error": {
      "fields": {
        "ClientError": [
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "LoginRequired",
            "description": "<p>The user needs to log in.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "AccessDeniedError",
            "description": "<p>The user does not have sufficient privileges to perform operation.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "UserNotFoundError",
            "description": "<p>User trying to access API was not found.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "EntityDoesNotExistError",
            "description": "<p>User trying to list instances of an entity that does not exist.</p> "
          }
        ],
        "ServerError": [
          {
            "group": "ServerError",
            "type": "json",
            "optional": false,
            "field": "EntityDefinitionListError",
            "description": "<p>API factory has encountered an issue while listing entities.</p> "
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "entityName",
            "description": "<p>Name of the entity to create instance of.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "object",
            "description": "<p>Request object containing additional _id field of your newly created instance.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example response from a successful call:",
          "content": " HTTP/1.1 200 OK\n {\n    \"wings\": 200,\n    \"_id\": \"551dd3d42860e830d3fd3754\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Instance"
  },
  {
    "type": "delete",
    "url": "/instance/:entityName/:instanceId",
    "title": "Delete a specific instance of an entity by it's ID.",
    "name": "Delete_instance_by_ID_",
    "group": "Instance",
    "error": {
      "fields": {
        "ClientError": [
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "LoginRequired",
            "description": "<p>The user needs to log in.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "AccessDeniedError",
            "description": "<p>The user does not have sufficient privileges to perform operation.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "UserNotFoundError",
            "description": "<p>User trying to access API was not found.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "EntityDoesNotExistError",
            "description": "<p>User trying to list instances of an entity that does not exist.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "InstanceNotFoundError",
            "description": "<p>User trying to list an instance that does not exist.</p> "
          }
        ],
        "ServerError": [
          {
            "group": "ServerError",
            "type": "json",
            "optional": false,
            "field": "EntityDefinitionListError",
            "description": "<p>API factory has encountered an issue while listing entities.</p> "
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "entityName",
            "description": "<p>Name of the entity.</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "instanceId",
            "description": "<p>ID of the instance to delete.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Status of the delete operation (OK/ERROR).</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example response from a successful call:",
          "content": " HTTP/1.1 200 OK\n {\n    \"status\": \"OK\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Instance"
  },
  {
    "type": "delete",
    "url": "/instance/:entityName/:propertyName/:propertyValue",
    "title": "Delete instances matching a specific property and value.",
    "name": "Delete_instance_by_property_and_value_",
    "group": "Instance",
    "error": {
      "fields": {
        "ClientError": [
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "LoginRequired",
            "description": "<p>The user needs to log in.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "AccessDeniedError",
            "description": "<p>The user does not have sufficient privileges to perform operation.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "UserNotFoundError",
            "description": "<p>User trying to access API was not found.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "EntityDoesNotExistError",
            "description": "<p>User trying to list instances of an entity that does not exist.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "InstanceNotFoundError",
            "description": "<p>User trying to list an instance that does not exist.</p> "
          }
        ],
        "ServerError": [
          {
            "group": "ServerError",
            "type": "json",
            "optional": false,
            "field": "EntityDefinitionListError",
            "description": "<p>API factory has encountered an issue while listing entities.</p> "
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "entityName",
            "description": "<p>Name of the entity.</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "propertyName",
            "description": "<p>Name of the property to search. Must be defined in the entity.</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "propertyValue",
            "description": "<p>Value of the property.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Status of the delete operation (OK/ERROR).</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example response from a successful call:",
          "content": " HTTP/1.1 200 OK\n {\n    \"status\": \"OK\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Instance"
  },
  {
    "type": "get",
    "url": "/instance/:entityName",
    "title": "Get all instances for specified entity.",
    "name": "Get_instances_for_an_entity_",
    "group": "Instance",
    "error": {
      "fields": {
        "ClientError": [
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "LoginRequired",
            "description": "<p>The user needs to log in.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "AccessDeniedError",
            "description": "<p>The user does not have sufficient privileges to perform operation.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "UserNotFoundError",
            "description": "<p>User trying to access API was not found.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "EntityDoesNotExistError",
            "description": "<p>User trying to list instances of an entity that does not exist.</p> "
          }
        ],
        "ServerError": [
          {
            "group": "ServerError",
            "type": "json",
            "optional": false,
            "field": "EntityDefinitionListError",
            "description": "<p>API factory has encountered an issue while listing entities.</p> "
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "entityName",
            "description": "<p>Name of the entity to fetch instances of.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "instanceList",
            "description": "<p>Array containing instance objects. Structure here is defined by properties specified in the entity definition.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example response from a successful call:",
          "content": "HTTP/1.1 200 OK\n{\n   \"instanceList\": [\n       {\n           \"wings\": 2,\n           \"_id\": \"5505f047187e81286385956b\",\n           \"__v\": 0\n       },\n       {\n           \"wings\": 4,\n           \"_id\": \"5505f04c187e81286385956c\",\n           \"__v\": 0\n       }\n   ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Instance"
  },
  {
    "type": "get",
    "url": "/instance/:entityName/:propertyName/:propertyValue",
    "title": "Get all instances for specified entity matching given property and value.",
    "name": "Get_instances_for_an_entity_matching_given_property_and_value_",
    "group": "Instance",
    "error": {
      "fields": {
        "ClientError": [
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "LoginRequired",
            "description": "<p>The user needs to log in.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "AccessDeniedError",
            "description": "<p>The user does not have sufficient privileges to perform operation.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "UserNotFoundError",
            "description": "<p>User trying to access API was not found.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "EntityDoesNotExistError",
            "description": "<p>User trying to list instances of an entity that does not exist.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "InstanceNotFoundError",
            "description": "<p>User trying to list an instance that does not exist.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "InvalidPropertyError",
            "description": "<p>User trying to search instances by a property that does not exist.</p> "
          }
        ],
        "ServerError": [
          {
            "group": "ServerError",
            "type": "json",
            "optional": false,
            "field": "EntityDefinitionListError",
            "description": "<p>API factory has encountered an issue while listing entities.</p> "
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "entityName",
            "description": "<p>Name of the entity to fetch instances of.</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "propertyName",
            "description": "<p>Name of the property to search.</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "propertyValue",
            "description": "<p>Value of the specified property.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "instanceList",
            "description": "<p>Array containing instance objects. Structure here is defined by properties specified in the entity definition.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example response from a successful call:",
          "content": "HTTP/1.1 200 OK\n{\n   \"instanceList\": [\n       {\n           \"wings\": 2,\n           \"_id\": \"5505f047187e81286385956b\",\n           \"__v\": 0\n       },\n       {\n           \"wings\": 4,\n           \"_id\": \"5505f04c187e81286385956c\",\n           \"__v\": 0\n       }\n   ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Instance"
  },
  {
    "type": "put",
    "url": "/instance/:entityName",
    "title": "Update a specific instance of an entity.",
    "name": "Update_instance_",
    "group": "Instance",
    "error": {
      "fields": {
        "ClientError": [
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "LoginRequired",
            "description": "<p>The user needs to log in.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "AccessDeniedError",
            "description": "<p>The user does not have sufficient privileges to perform operation.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "UserNotFoundError",
            "description": "<p>User trying to access API was not found.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "EntityDoesNotExistError",
            "description": "<p>User trying to list instances of an entity that does not exist.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "InstanceNotFoundError",
            "description": "<p>User trying to list an instance that does not exist.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "InvalidPropertyError",
            "description": "<p>User trying to search instances by a property that does not exist.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "MissingArgumentException",
            "description": "<p>One or more required fields are missing.</p> "
          }
        ],
        "ServerError": [
          {
            "group": "ServerError",
            "type": "json",
            "optional": false,
            "field": "EntityDefinitionListError",
            "description": "<p>API factory has encountered an issue while listing entities.</p> "
          },
          {
            "group": "ServerError",
            "type": "json",
            "optional": false,
            "field": "InstanceUpdateFailedError",
            "description": "<p>Failure was encountered while updating instance.</p> "
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "entityName",
            "description": "<p>Name of the entity to update instance of.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "object",
            "description": "<p>Updated instance object.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example response from a successful call:",
          "content": " HTTP/1.1 200 OK\n {\n    \"wings\": 425,\n    \"_id\": \"551dd3d42860e830d3fd3754\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Instance"
  }
] });