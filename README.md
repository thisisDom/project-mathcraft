# Project-Mathcraft [![Build Status](https://travis-ci.org/thisisDom/project-mathcraft.svg?branch=master)](https://travis-ci.org/thisisDom/project-mathcraft)

An app that combines fundamental math concepts with the engaging elements of mobile gaming.

![Project MathCraft Logo](/public/images/logo.png)

## Watch Full Demo

[![Watch the video](/public/readme_images/youtube_screen.png)](https://youtu.be/aAwIbdGh1go)

## Authored by

* Chinmay Banker ([@chinmaybanker](http://github.com/chinmaybanker))
* Lukas Kuhn ([@lucaskuhn](https://github.com/LucasKuhn))
* Dominique Crowther ([@thisisDom](https://github.com/thisisdom))
* Roger Li ([@mrrogerino](http://github.com/MrRogerino))

## MVP functionalities

* Decoupled architecture consisting of:
  * [Rails back-end API](http://github.com/thisisdom/project-mathcraft-api)
  * [Rails and JS front-end web application](http://github.com/thisisdom/project-mathcraft)

* Rails back-end API features:
  * Persistent storage of players' resources, buildings, and levels across multiple play sessions
    * Updates and stores players' towns and resources based on various in-game actions
  * Loads assets (music, sfx, sprites, etc.) for each level and building
  * Dynamically generates math questions of varying type and difficulty
  * Uses authorization security to prevent player info from being accessed and hacked

* Rails front-end web app features
  * Displays buildings by parsing back-end requests for players to view, build, and edit
  initializes creation of resources in back-end API database from user input
  * Integrates data visualization from parsed data from back-end API
  * Allows players to play various levels, visualizing their resource gains as they answer different questions

## App Usage Flow

* Players will take on the responsibility of building their town from the ground up.

* Upon logging in, players will be presented with a view of their town. Core gameplay is centered around two mechanics:
  * [Harvesting](#harvesting)
  * [Building](#building)

## Harvesting
  * In order to generate resources to build their town, players must play various levels- each level asks different types of math questions designed to hone the repititions needed to reinforce a strong math foundation.
  * As they level up, players gain access to levels with more difficult questions and more advanced mathematical and logical concepts.

    ![Level Select](/public/readme_images/level_select.png)  

### Level Select
  * After they select a level, players are taken to the harvesting minigame. Currently, there are two supported game modes:
    * Time Attack: Players are given 45 seconds to answer as many questions correctly as possible. Players are incentivized to not only be quick, but accurate. Besides being penalized for wrong answers, players are offered the chance to encounter rare enemies by building their combo multiplier; defeating these rare monsters will increase their total resource gain at the end of the level.
    
     ![Forest Level Start](/public/readme_images/forest_start.gif)
     ![Forest Level End](/public/readme_images/forest_end.gif)

    * Boss Battle: Players must answer 10 questions of increased difficulty within 30 seconds. They are given 3 lives, which deplete with each wrong answer. They must answer each question correctly before the timer expires. These levels serve as a checkpoint to ensure that players have sufficiently mastered the concepts presented in earlier levels- in order to unlock the next set of levels, players must beat the corresponding boss.
    
     ![Boss Level Right Answer](/public/readme_images/boss_right_answer.gif)
     ![Boss Level Wrong Answer](/public/readme_images/boss_wrong_answer.gif)
     ![Boss Level Death](/public/readme_images/boss_death.gif)

    
## Building
  * After players have gathered the requiste resources, they can head back to town and enter building mode. Building is separated into two different actions:
    * Building: Players can place buildings on any open plot of land in their town, as long as they meet the structure's resource cost.
    
    ![Town Build](/public/readme_images/build_house.gif)

    * Upgrading: After placing a building, players are also given the option to upgrade their buildings. Clicking on a pre-existing building brings up the upgrade button. Besides the visual upgrade, higher-level buildings offer players more bonuses and privileges, such as increased resource gain or unlocking new structures.

    ![Building Upgrade](/public/readme_images/upgrade_building.gif)

  * TODO: Create a player profile screen, where they can see their results and progress. Ideally, players can see which categories they've excelled at and which they need to improve on. Feedback screen is VERY important.

## Team Dynamics

* Schedule
  * 8am - 8pm (very flexible)

* Stand-Ups
  * 9am
  * 2pm
  * 6pm

* Check-In Protocol
  * Victories
  * Blockers & resolutions
  * Goals

* Slicing
  * Horizontal slice
  * Pair for challenging features
  * PR author does not merge their own PR
  * Collaborate to fix and solve merge conflicts
  * Branch for each feature

## Special Thanks

We would like to thank all of the DBC teachers, mentors, Sea Lions, Rock Doves, Fiery Skippers of SF 2017 for their endless support and encouragement!

