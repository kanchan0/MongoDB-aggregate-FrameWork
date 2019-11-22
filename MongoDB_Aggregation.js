*******************************MongoDB_Aggregation_FrameWork***************************************************************

/*
// The following query will give every details in the collection person.
                   
                   db.person.aggregate([{$match:{}}])
                   db.person.aggregate([])
*/

/*
Stage Operator used in aggregation framework :--
1.$match                         2.$group
3.$project                       4.$sort
5.$count                         6.$limit
7.$skip                          8.$out 
*/

/*
## aggregation expression refers to the name of the field in input documents
  { $group : { _id : "$age" } }
  { $group : { _id : "$company.location.country" } }
  { $group : { _id : "$name" , total : { $sum : "$price" } }      ***two expressions*** 
*/

/*
// If match is not used with any other stages then match acts same as the Find operator with the same object.
                  
                    db.person.aggregate([
                        //stage 1
                        {$match:{tags:{$size:3}}}
                    ])
*/


/*
// ** _id is a mandatory **
// This will give all the different gender in our collection
                   
                   db.person.aggregate([
                        //stage 1
                        {$group:{_id:"$gender"}}
                    ])
*/    

/*
// ***** Nested fields can also be grouped  .... *****
                      
                      db.person.aggregate([
                          {$group:{_id:"$company.location.country"}}
                      ])
*/


/*
// Grouping by two or more fields ....
                   
                    db.person.aggregate([
                        {$group:{_id:{eyecolor:"$eyeColor",
                                      Fruits:"$favoriteFruit",age:"$age"
                                      }
                                }
                        }
                    ])
*/


/*
                    db.person.aggregate([
                        //stage 1
                        {$match:{gender:"female"}},
                        //stage 2
                        {$group:{_id:{eyecolor:"$eyeColor",age:"$age",gender:"$gender"}}}
])
*/

/*
// ******* If we use $group operator before $match it will give us an error,so order is important **********
                    
                    db.person.aggregate([
                        //stage 1
                        {$group:{_id:{eyecolor:"$eyeColor",age:"$age"}}},
                        //stage 2
                        {$match:{gender:"female"}}
                    ])
                    
// This happends because after stage 1 we get the documens as id , eyecolour , age AND then when we try to match gender,it
   has no gender field ,so 0 results will be found. 
*/


/*
// The above query will work in if we use it like below :--
                    
                    db.person.aggregate([
                        //stage 1
                        {$group:{_id:{eyeColor:"$eyeColor",age:"$age"}}},
                        //stage 2
                        {$match:{"_id.eyeColor" : "green"}}
                    ])
*/


// ************************************** Count **************************************************************************
// ** Methods for counting the number of the documents**

/*
// the following query will give the total no. of documents
// ----> This is a server-side method,so it fastest { always use this method }
                   
                   db.person.aggregate([
                        {$count:"allDoc"}
                    ])
*/


/*  
// The following method is Client-Side method 
// --->It is slow because they iterate through the cursor to the end {slower than server}
                 db.person.aggregate([]).toArray().length
*/  
 
 
/*  
// Client-Side method {slower than server-side method}
                 db.person.aggregate([]).itcount()  
*/


/*
// Server-Side method so it as fast as our first Server-Side method  
                 db.person.find({}).count() 
*/


//  *********************************** $Count with $Group *****************************************************************

/*
// It will give total number of distinct age values
                    db.person.aggregate([
                        {$group:{_id:"$age"}},
                        {$count:"age"}
                    ])
*/

/*
// Total no distinct documents grouped by eyecolor and age 
                   db.person.aggregate([
                        //stage 1
                        {$match:{age:{$gte:25}}},
                        //stage 2
                        {$group:{_id:{eyeColor:"$eyeColor",age:"$age"}}},
                        //stage 3
                        {$count:"eyeColorAndAge"}
                  ])
*/


// ********************************************* $Sort ******************************************************************
// -1 is for sorting in Descending order         1 is for sorting in Ascending odrder

/*
                    db.person.aggregate([
                        {$sort:{age:-1,gender:-1,eyeColor:1}}
                    ])
*/


// $Sort with $group operator ($group --> sort order is important else there will be no use)

/* 
                   db.person.aggregate([
                      {$group:{_id:"$age"}},
                      {$sort:{_id:1}}
                   ])
*/ 
   
/*   
                  db.person.aggregate([
                      {$group:{_id:"$eyeColor"}},
                      {$sort:{_id:1}}
                   ])     
 */
 
/* 
                  db.person.aggregate([
                      {$match:{eyeColor:{$ne:"blue"}}},
                      {$group:{_id:{eyeColor:"$eyeColor",
                              favoriteFruit:"$favoriteFruit"
                          }}},
                      {$sort:{"_id.eyeColor":1,"_id.favoriteFruite":-1}}
                  ]) 
*/


// ************************************ $Project Operator *****************************************************************

/* 
   ### _id will be always included in the output untill it is excluded
   
          {$project:{name:1,"company.title":1}}      // only name and title field will be included along with default _id
          {$project:{_id:0,name:1,age:1}}            // name and age will be included but id will be excluded
          {$project:{eyeColor:0,age:0}}              // all fields will be there except eyeColor and age
          {$project:{name:1,newAge:"$age"}}          // 3 fields -id,name,age renamed as newAge
*/

/*
// _id will be included by default,result will be all document with fields _id ,isActive ,name ,gender
                        db.person.aggregate([
                            {$project:{isActive:1,name:1,gender:1}} 
                        ])
*/


/*
// This query will remove fields --> isActive ,name ,gender from all the fields.
                      db.person.aggregate([
                          {$project:{isActive:0,name:0,gender:0}} 
                      ])
*/

// If we have 1000 fields then project will return 1000 rows { meaning it does not reduce the no. of rows }

/*
// With the help of $project we can even rename fields and even restructure the output
                      db.person.aggregate([
                          {$project:{
                             _id:0,
                              index:1,
                              name:1,
                              info:{
                                  eyes:"$eyeColor",
                                  company:"$company.title",
                                  country:"$company.location.country"
                                  }
                              }} 
                      ])
// our documents will be restructred as above.
*/


// ******************************** $limit stage *******************************************************************

// Output the first N documents from input

/*
     ## We use the limit it in following cases:-
      1.Sampled aggregation requests with $limit as first stage.
      2. after $sort to produce topN results.
*/


/*
// $limit ,$match and $group

                    db.person.aggregate([
                        //stage 0 
                         {$limit:100},
                        //stage 1
                         {$match:{eyeColor:{$ne:"blue"}}},
                        //stage 2
                         {$group:{_id:{eyeColor:"$eyeColor",
                          favoriteFruit:"$favoriteFruit"
                          }}},
                          //stage 3
                        {$sort:{"_id.eyeColor":1,"_id.favoriteFruit":-1}}  
                    ])
*/


// ************************************** unwind stage ********************************************************************
// Unwind splits each document {with specified array} to serveral documents-one document per array element

/*
    ==> Let's understand,tags field has array as datatype so unwind will take each element of the array and make it another 
        document.
    ==> If we have 4 rows and a field contains array of 3 element each, total fields wil be 4*3=12
        out of three three element will have only on filed will differ that is field with array peroiviosly
*/
                   db.person.aggregate([
                       {$unwind:"$tags"},
                       {$project:{name:1,index:1,tags:1}}
                   ])
*/

/*
                   db.person.aggregate([
                       {$unwind:"$tags"},
                       {$group:{_id:"$tags"}}
                   ])
*/



// *********************************** Accumulators ************************************************************************

/*
      Accumulator operators:---
      1.$sum
      2.$avg
      3.$max
      4.$min
*/

// *** Most of the accumulatos are used only in $group stage ****

/*
     {total:{$sum:"$quantity"}}      //will give a new column Count
     {count:{$sum:1}}               //simple way to count the no. of document in each group
*/

// ############# $Sum ######################
/*
                    db.person.aggregate([
                        {
                            $group:{
                                _id:"$age",
                                count:{$sum:1}    //accumulator-->sum
                                }
                            }
                    ])
*/        
 
/* 
                    db.person.aggregate([
                        {
                            $group:{
                                _id:"$favoriteFruit",
                                count:{$sum:1}    //accumulator-->sum
                                }
                            }
                    ])
*/


/*
                    db.person.aggregate([
                        //stage 1
                        {$unwind:"$tags"},
                        //stage 2
                        {
                            $group:{   
                                _id:"$tags",
                                count:{$sum:NumberInt(1)}    //NumberInt(1) will give count in integer
                                }
                            }
                    ])
*/


// #################### $Avg################################

/*
                    db.person.aggregate([
                    {
                        $group:{

                            _id:"$favoriteFruit",
                            avgAge:{$avg:"$age"}
                            }
                        }

                    ])
*/  
  
/*  
                    db.person.aggregate([
                    {
                        $group:{ 
                            _id:"$company.location.country",
                            avgAge:{$avg:"$age"}
                            }
                        }

                    ])
*/


// ************************************* Unary Operators******************************************************************

/*
 ## Unary operators works on each document ,not on a group.
    1> unary operators are usually used in the $project stage.  
    2>In the $group stage Unary Operators can be usedonly in the conjection with accummulators

1.$type                 4.$gt
2.$or                   5.$and
3.$lt                   6.$multiply

*/

// ###### $type ----> Returns BSON type of the field's value

/*
                  db.person.aggregate([
                      {$project:{
                          name:1,
                          eyeColorType:{$type:"$eyeColor"},
                          ageType:{$type:"$age"}  
                       }
                   }
                  ])
*/

/* 
sample o/p--> {
    "_id" : ObjectId("5dd3cb21b6686ce0703dd745"),
    "name" : "Aurelia Gonzales",
    "eyeColorType" : "string",
    "ageType" : "int"
}
*/
 

// **********************************$ out Stage ************************************************************************
/*
  --> writes resulting documnets to the MongoDB collection
  --> $out MUST be the last stage in the pipeline
  --> If output collection does'nt exist,it will be created automatically.
*/

/*
// Document from the $group stage will be written to the collection 
                      db.person.aggregate([
                      //stage 1
                      {$group:{_id:{age:"$age",eyeColor:"$eyeColor"}}},
                      {$out:"aggregate_out_test"}    //if this database does'nt exist mongodb will create one.
                      ])
*/

/*
                    db.person.aggregate([
                        {$project:{
                            name:1,
                            eyeColorType:{$type:"$eyeColor"},
                            ageType:{$type:"$age"}     
                         }
                     },
                     {$out:"out_test_2"}
                    ])
*/


// ***************************** {allowDiskUse:true }***********************************************************************

/*
    1. All aggregation stages can use maximum 100MB of RAM.
    2. server will return error if RAM limit is exceeded.
    3. Following option will enable MongoDB to Write stages data to teporal files.
          {allowDiskUse:true}

eg --> db.person.aggregate([],{allowDiskUse:true})
 
## If we have large collection then will need to use the this option.

*/










