[HOME](../README.md)

# Crudio Syntax Introduction

Crudio provides a convenient method of describing a data model, which describes how a database should be created, then populated with test data.

For example, we can quickly describe an organisation, departments, and roles, then place people in those roles and departments, but moreover, we can create many organisations, and they will all be automatically populated with users. 

Crudio creats test data very quickly, and requires no user input after configuration, therefore it is perfect for quickly generating awesome databases for prototype apps and services.

Read on to understand how to:
- describe a data model
- populate the data model with Entities
- ensure Entities have data values which look sensible, even though they are randomly created
- connect Entities using relationships

# Describing a Data Model - Key Aspects

## Entities
Entities can be thought of as data objects and rows of data in a database table.

Examples of an Entity could be Organisation, Employee, Department, IoT Device, etc.

Think of the data model as a world, and inside that world there are types of objects (Entity Definitions), and instances (Entity Instances). 

`Person` is an example of an Entity Definition, it is generic, a general description of a person, such as the name, age and address they live at.

`You` are a great example of an Entity Instance. You are a `Person`, and the data which is captured about you, is defined by the `Person` Entity Definition.

## Fields

Fields are the attributes of an Entity and have values. Just like you have an `age` attribute.

Other examples of attributes are `name`, `address`, and `height`.

## Generators

Generators are the means by which data is randomly created, and assigned to Entity Fields.

An example of a Generator is, `transport: "car;boat;plane;scooter;bus;train"`, which instructs Crudio to randomly select one of the possible values.

Also, `age: "10>87"`, instructs Crudio to create a random number within the specified range.

## Relationships

One of two relationship types are available to connect Entities to each other:

`one to many` - For example, an employee has an employer, therefore the employee record carries the ID field of the employer organisation.

and

`many to many` - For example, a blog tag and blog post, where the blog tag can be used on many blog posts. Therefore neither record can have the ID field of the other. 

Instead, we use a join table, where a row in such a table, carries the ID of the blog post, and the ID of a blog tag. Many rows are created in the join table, showing that blogs have many tags, and there can be many blog posts. 

`one to many` and `many to many` relationship types are very common, in database design. If these concepts are unfamiliar to you, it is worth taking some time to study a little bit more about database design. It will help you understand even more about why Crudio is so useful.  

## Scripts (Triggers)

Currently, the concept of a Script is only applied to what is internally referred to as a Trigger, in Crudio. Meaning, when a new instance of an Entity is created, Crudio looks for scripts that have to be run for that new Entity instance. This is how Organisations, Users, Roles and Departments are all perfectly interconnected when a new Organisation is created.

The term `Triggers` is used to describe actions which are executed when a specfic event occurs, currently only when a new Entity Instance is created.

When setting up complex data models, Crudio can handle special cases where entity relationships exist within a very contrained context. The best way to describe how Scripts work is to think of them like triggers, which are executed every time an Entity is created.

In the example data model provided in Crudio, we create Organisations, and when each Organisation is created, we create related Users, and some Users are placed in special roles, and all Users are placed in departments. 

An example is a CEO role, being assigned to a specific User. When Crudio creates the Organisation, only one of its Users is assigned the role of CEO. This demonstrates that Crudio can create very specific relationships between objects in accordance with our requirements.

See more on scripts below.

# Describing Entities in the Data model

Let's being with a simple example of a blog and blog tag, describing how a blog post can have several tags applied, involving what we would call a many to many relationship.

The `inherits` field tells Crudio to copy fields from a related object. You can only have one `inherits` per data object.

If you refer to the repo file, you can see how a `User` inherits all of the field of a `Person`. But, `Person` is also marked as `abstract` so a database table is not created for `Person`, instead, we just get a table for `Users` and `Clients`. 

`Clients` is also built by inheriting the `Person` date fields, so now you can see how a base record can ensure that two other records maintain a consistent set of fields.

`required` specifies that the data field must have a value.

`unique` specifies that the data field must have a value which is unique to that table.

Both `required` and `unique` will be implemented in the database as constraints.

```json
		"Tag": {
			"count": "[tag]",
			"inherits": "Entity",
			"name": {
				"unique": true,
				"required": true,
				"generator": "[tag]"
			}
		},
		"Blog": {
			"count": 20,
			"inherits": "Entity",
			"article": {
				"generator": "[article]"
			},
			"published_date": {
				"type": "timestamp",
				"name": "published_date",
				"generator": "[timestamp]"
			},
			"relationships": [
				{
					"type": "many",
					"to": "Tag",
					"name": "BlogTags",
					"count": 2
				},
				{
					"type": "one",
					"to": "User",
					"name": "Author"
				}
			]
		}
```

# Specify Required Number of Objects 

There is something very powerful going on in this example and it is here in these parts:

Let's start with the blog post, as it's easy to understand that we are requesting 20 blog posts should be created.

For `Blog`
```
"count": 20,
```

If we do not provide a `count` value, then by default Crudio will create 50 objects. 

However, please read more below about the `unique` constraint as it can conflict with `count` and cause errors, where it is not possible for Crudio to create sufficient unique values.

Continuing to the blog tag, we see a different way of stating how many objects are to be created. 

For `Tag`
```
"count": "[tag]",
```

We might think of `Tag` as a lookup type, i.e. it is a list of values having unique names. So if we create random tags from "a;b;c;d", we can only have a maximum of 4 tag values, as all the values are to be unique. Note that the name field of `tag` has the `unique` constraint applied. 

So by using the `[tag]` text as the value of count, we are telling Crudio to only allow as many blog tags, as there are values available from its generator, which might look like "cars;pets;food", hence three values is the maximum. Put simply, we just let Crudio figure out what to do. 

Please take a moment to truly understand the implications here. It means Crudio will do a lot of heavy lifting for you, i.e. create tables, where rows can have unique values for each row.

Use numbers where you want to have a large number of data objects created, and use the generator name, e.g. `"[tag]"` where you want to limit the number of objects based on the number of values available in the generator. 

# Describing Relationships

This snippet is taken from the above description of blogs and tags.

```json
    "relationships": [
        {
            "type": "many",
            "to": "Tag",
            "name": "BlogTags",
            "count": 2
        },
        {
            "type": "one",
            "to": "User",
            "name": "Author"
        }
```

Here we see relationships between a blog post, and a user which is the author of the blog post. There is only one author of a blog post, so we use a one to many relationship. Crudio takes care of everything here. Creating the blog, the authoer and the connection between the two.

Next, we see a blog poast can have many blog tags. In database designs, it's normal to create a join table, i.e. a table is created, and each row of the table has a reference to a blog post and a blog tag. This way we can have "Blog 1" connected to multiple tags, "tag1,tag2,tag3".

Crudio will again take care of everything. Our earlier descriptions express how we want blogs and tags to be created. Crudio will populate the many to many join table (BlogTags), ensuring that every blog post has tags, and that any tag only occurs once for each blog post.

Finally, if we omit the name of the relationship (i.e. the name of the join table) then Crudio will form it by joining the related table names together, e.g. BlogTag.

# Crudio Scripts

Below is a simple description of an `Organisation` data object, which will lead to the creation of an `Organisations` data table in the database.

Normally, if we leave out the `count` field, by default Crudio will create 50 objects in the table. But in the following example, we will see it's not sufficient to simply create 50 random `Users`. Rather, we want randomly created users to be placed in very specific relationships with the `Organisation`.

Complex relationships between users, roles and departments are required, so we want to create the data a different way. So we specify `count:0` which tells Crudio not to automatically generate data, but rather, use our `scripts` node which will point to instructions of how to create data and connect objects for us.

```json		
"Organisation": {
    "count": 0,
    "inherits": "Entity",
    "name": {
        "required": true,
        "unique": true,
        "generator": "[organisation_name]"
    },
    "address": {
        "generator": "[address]"
    },
    "email": {
        "generator": "contact@[!name].org.au"
    }

...lines removed...

    "scripts": ["repo/org_users.json"]

}
```

# Crudio Scripts - Creating Special Relationships Between Objects

The `sripts` node can specify multiple script files to import and use.

Imagine a typical organisation structure, having one CEO, one CFO, one Head of HR, but many people working in HR, Marketing and IT, then lots of other people in the role of Staff are assigned to departments, and these are not Head of Department, but more like Team Members.

In plain English, it is easy to say, "every organisation must have one CEO, one CFO, one head of department for each department", etc.

## Specifying Crudio Scripts

Refer to `org_users.json` for examples.

Crudio makes it really easy to build relationships between objects using a simple script notation.

The script below says:
- We are filling the Organisations table
- We are creating 4 data records
- Every Organisation data record gets connected to a bunch of users
- The users are automatically created
- Specific roles are then connected to a user, like CEO, CFO...
- Groups of users are created and connected to specific departments, like Board, HR, IT, etc.


```json
{
	"Organisations": {
		"count": 4,
		"scripts": [
			"Users(0).OrganisationRole?name=CEO",
			"Users(0).OrganisationDepartment?name=Board",
			"Users(3).OrganisationRole?name=Head of Sales",
			"Users(3).OrganisationDepartment?name=Sales",
			"Users(6-10).OrganisationRole?name=Staff",
			"Users(6-10).OrganisationDepartment?name=Sales",
		]
	}
}
```
The above is a snippet with lines deleted. Refer to `org_users.json` for complete file.

# How to Interpret Script Syntax

We specify `Organisations` first, as the primary table that we are thinking about, as we are building an organisation and its team.

We need to create a `User` next and assign it to the role of `CEO` with a department of `Board`:

```json
    "Users(0).OrganisationRole?name=CEO",
    "Users(0).OrganisationDepartment?name=Board",
```

We this approach over and over until we have populated all the key leadership roles.

Next, we need to create a lot of users, all with the `Staff` role, but placed in different departments, like Sales and Marketing teams:

Imagine we have built User 0, 1, 2, 3, 4...and  then connected them with specific roles and teams, we are gradually filling our list of users.

We continue to fill the list of users under the organisation, by using start - end notation, like (6-10).

So we continue creating user 6 to 10 and place them in the `Staff` role and `Sales` team.
Next, we create users 11 to 20 and place them in the `Staff` role and `Sales` team.

```json
    "Users(6-10).OrganisationRole?name=Staff",
    "Users(6-10).OrganisationDepartment?name=Sales",
    "Users(10-20).OrganisationRole?name=Staff",
    "Users(10-20).OrganisationDepartment?name=Marketing",
```

Basically, every time you ask for a record using the indexed notation `(record_number)` or `(start_record_number-end_record_number)`, Crudio will do its best to ensure that record exists.

OK, so now you can see how easy it is to build very specific scenarios, which commonly occur in data models. Lots of apps deal with organisations, people, teams, roles etc. We can use the pre-defined data models in Crudio, or start and build our own data model from the ground up. There are lots of useful examples in demonstration files in the `repo` folder.

# Generating Field values

## Background
Crudio started our as a way of creating random data objects which could be participants in surveys, and then random answers for those surveys. But the idea grew and we needed more and more ways to create data, which looked sensible.

Put another way... If you rely on people to create test data, a few things generally happen:

- They get bored, and you start to see text like this appearing in fields: "asjboijbfi aihioaghoiadhg lhfgshdfgdhf". Now if you get a bug in your system, and you try to debug it, and attempt to form an image of the data which is involved, it gets hard! Well, it just doesn't make sense that customer "saldlsfjj flsdhig" bought 10 "isgoihogihoh iudsfuhfiufdg" and then asked a question on the chat channel "sfsddsh1767221212".
- People tend not to create "enough" test data. They create a few rows of data, and then say the system works. But to load test your system, you sometimes want thousands of records.
- People don't test all of the possible scenarios, all of the time. When we first think of a way to break our system, we test very carefully. But months down the track, our attention moves to new problems, so we stop looking for regressions.
- People are likely to play by the rules. We tend to avoid breaking things, which is not a good habbit as a tester. So we tend not to try typing "Apple" in to date fields. So we never know if our user interface can handle such instances.

So the mission for Crudio started out with needing to create lots of data, that looked like people might have created it, but which included a good range of values, and lots and lots of rows where required.

## Getting started

Take a look in the `repo` folder at `base_generators.json`.

it doesn't need much explaination:

```json
    "title": "Dr;Mr;Miss;Mrs;Ms;Sir;Lady;Prof;",
    "firstname": "Emma;Isabella;Emily;Madison;Ava;Olivia;Sophia;Abigail;Elizabeth;Chloe;Samantha;Addison;",
    "lastname": "Smith;Johnson;Williams;Brown;Jones;",
    "fullname": "[title] [firstname] [lastname]",
```

This is just a simple way of sayin, whenver we need the title, firstname and lastname of a person, we can selet from these lists of words.

We can easily create a fullname, by taking a random word from the other generators and joining them all together in a string.

## Generating Different Types of Data

### Dates
Here is a quick and easy way to create dates. 
TODO: We actually need to improve date creation though.

```json
		"day": "1>28",
		"month": "1>12",
		"year": "1970>2021",
```

The generators above create a random day, month and year ranging from the low number to the high number, i.e. "low>high"
This is great, but not awesome. We want to avoid creating a date for 31st of February, which is why our day generator is "1>28"

### Technical Data

See how the generators below all interconnect to create ranges of IP Addresses and MAX addresses.

It all a simple question of how do you create a little snippet of information, that looks sensible, and then use snippets to build more complex types of data.

```json
    "positive_byte": "1>255",
    "byte": "0>255",
    "hex_digit": "0;1;2;3;4;5;6;7;8;9;A;B;C;D;E;F;",
    "hex": "[hex_digit][hex_digit]",
    "mac_address": "[hex]:[hex]:[hex]:[hex]:[hex]:[hex]",
    "ipaddress": "[positive_byte].[byte].[byte].[byte]",
    "ipv6address": "[hex][hex]:[hex][hex]:[hex][hex]:[hex][hex]:[hex][hex]:[hex][hex]:[hex][hex]:[hex][hex]",
```

### Using Lookup and Cleanup

Consider the following generator
```
		"user_email": "[!~firstname].[!~lastname]@[!~Organisation.name].com",
```

Get the firstname field from the current record then make it lower case and remove any spaces `[!~firstname]`
Same for lastname `[!~lastname]`

Next, get the name field from the Organisation, which is connected to the current record, and remove spaces and make it lowercase `[!~Organisation.name]`

This is really powerful, because now when we generate users, their emails can look like they below to the organisation which they are connected to. 

All we have to do is use the `[user_email]` generator like this:

```json
    "User": {
        "count": 0,
        "inherits": "Person",
        "email": {
            "unique": true,
            "generator": "[user_email]"
        },
        "relationships": [
            {
                "type": "one",
                "to": "Organisation"
            },
            {
                "type": "one",
                "to": "OrganisationDepartment"
            },
            {
                "type": "one",
                "to": "OrganisationRole"
            }
        ]
    }
```