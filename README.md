```
    -------------------------------------------------
    |  Hey, do you want to organize your life? 📅   |
    -------------------------------------------------
    /                                               \
   / Yes! 😃                                    ☹ No.\
  /                                                   \
-------------------------                       ------------------------------------
| This tool is for you! |                       | This tool is definetely for you! |
-------------------------                       ------------------------------------
```

# What does this tool do?
This tool creates a card everyday in a trello list which goes by the name of the month, it contains various checklist items which I want to keep track of regularly, like 'did I meditate?', or 'did I go out for a run?', my reading list for the day, coding tasks for the day, and so on!

This is pretty much WIP thing, I intend to come back to it once I am done building all of the organizational tools, I will collate all these pieces into one tool, possibly an android app so that it can be easily used by masses. 🎉

# Why am I doing this?

This tool uses trello to organize your life, read more on [Why Trello?](#whyyyy?), this is one of the various tools that I intend to build to organize my life cozz I am way too disorganized, because of which I have existential crisis, and philosphical questions pop-up in my head all the time, like 'What am I doing with my life?', 'What do you need to do to be content with life?', the list goes on........

Q - So, why am I doing this?
A - I want these questions to stop popping up in my head. 💯


Example List-

```
-----------------
|   August      |
|               |
|   Day 1       |
|               |
|   Day 2       |
|               |
-----------------
```

Example Card Contents -

```
-----------------
|   Day 1       |
|               |
| Essentials    |
|               |
| Did you wake  |
|  up early?    |
|               |
|  Did you go   |
|  for a run?   |
|               |
| Did you have  |
| healthy food? |
-----------------
```

# <a name="whyyyy?"></a> Why trello?
Trello is much more than just a simple TODO software, it is a lot more customizable, and hence organizable, and that's what I like about Trello. The REST API available is very clean and easy to use. I just hope that the API remains free forever! 🤞

# How to execute the application?

Before you execute the script you need to set up a [config file](#configFile).

Okay, done that, install the dependencies.
`npm install`

Once you have done that do,
`npm run exec`

# <a name="configFile?"></a> Config file
There is a config.json file in the root directory. Intially, it contains placeholder values--you need to replace the placeholders with the appropriate values, the instructions are embedded in the file itself.


# TODO
- Make the typescript bindings for the trello API and then use them in the code instead of talking in the air.
- Handle Rate Limiter.
- Come up with better build system.
- Make powerups to fill up the details about the tasks.
- Make a command line tool to keep track of the TODOs.
- Make android, and iOS app to have a better easier integration with phone.
- Build reports of the daily cards.
- Build analytics tool on top of the reports.
- Integrate with google fit.