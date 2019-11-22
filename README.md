# MongoDB-aggregate-FrameWork

#### The followings things are discussed
##### 1.Aggregation Stages
        a. $group
        b. $match
        c. $sort
        d. $project
        e. $out
        
##### 2. Stages Chaining
##### 3. Accumulator Operator { $sum ,$avg }
##### 4. Unary Operators {$type}


##### Sample documents in the collection person is {1000 entries are there.}
      /* 1 */
      {
          "_id" : ObjectId("5dd3cb21b6686ce0703dd745"),
          "index" : 0,
          "name" : "Aurelia Gonzales",
          "isActive" : false,
          "registered" : ISODate("2015-02-11T04:22:39.000Z"),
          "age" : 20,
          "gender" : "female",
          "eyeColor" : "green",
          "favoriteFruit" : "banana",
          "company" : {
              "title" : "YURTURE",
              "email" : "aureliagonzales@yurture.com",
              "phone" : "+1 (940) 501-3963",
              "location" : {
                  "country" : "USA",
                  "address" : "694 Hewes Street"
              }
          },
          "tags" : [ 
              "enim", 
              "id", 
              "velit", 
              "ad", 
              "consequat"
          ]
      }
