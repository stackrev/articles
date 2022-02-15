# What's the Story on Story Points?

<!-- title: What's the Story on Story Points? -->
 
![Image: WeAreTeachers Staff on February 5, 2021](Best-Short-Stories-for-Middle-School.jpg "Image: WeAreTeachers Staff on February 5, 2021")
 
Say you are sitting with your scrum teams, planning for their sprints. When suddenly, an engineer barges in professing they are now a 10X engineer.

"Why?" everybody asks, to which he exclaims "because your average sprint velocity is 10 story points, and I closed at 100 points last sprint! "

![Image: NBC Universal Television](dwight-schrute-quotes.jpg "Image: NBC Universal Television")


We know that estimation is the hardest part of software development. If done well though, good estimations will be the cause of good requirements capturing and Story Points - these are your key to good estimations.

## Story Points are Nothing and Everything

Story points are an abstraction used to measure the EFFORT in delivering a piece of work from your backlog. Dates and hours don't assume scope-creep or business-as-usual (BAU) efforts. We also know that dates don't play well with software engineers, having a detrimental effect on them.

Why abstract? To quote Mike Cohn's Agile Estimation and Planning:

> `We are better at estimating  “this is like that” than we are at estimating the absolute size of things`

We need to know how much software **increments we can ship** – this is size, not time. Sprints and PIs are all about deliveries and software increment.

Story points are meaningless without a velocity. A **velocity is only possible with consistency**: the number of team members, the time-box (sprint) and the consensus of the story point metric. These should be unchanging across a long period of time.

Using story points with a time-box causes large and uncertain pieces of work to be broken down into **VISIBLE and ACTIONABLE increments**. This abstraction helps to create certainty, visible delivery, commitment and consensus to the solution you wish to deliver.

Teams work in different velocities and with different opinions on what constitutes complexity and difficulty. The team is consistent though, therefore the Story points are stable - 1 story point for an easy piece of work now, should be 1 story point for an easy task next year.

## Pitfalls in using Story points 

Story points should not be used in ranking and reviewing individuals’ productivity. The team is assigned the story, because the team has a predictable velocity not the individual. 

A story is a software increment not an individual task. E.g. *“Provide this API for XYZ”.*

- To deliver this story, you need to: code in the logic, test the logic, provision the infrastructure, deploy the piece, etc.
- If a similar historic story was a huge effort , barely delivered in 2 sprints, then we know that we need to break this down into 2 manageable stories: Create the API - and - Create the Infrastructure. Both 4 story points, which we know through consensus that we can definitely increment 4 story points every sprint.
- BAUs are the exceptions here, and are efforts we have to do to maintain the business. 
- There is no issue if the capacity drops in a sprint.  In the long run everything normalizes and the product managers can still estimate on the average velocity.

![Image: The Office: 10 Memes That Describe Michael Scott Perfectly by Screen rant.](michael-scott-the-office-memes.jpg "Image: The Office: 10 Memes That Describe Michael Scott Perfectly by Screen rant.")


What about our 10x engineer in the introduction, closing 100 story point against the team's average of 10!  

This doesn’t mean that person did x10 more than the others, it only means that **person was not part of the team** and was operating on their own cadence and preconceptions.

## Any Alternatives?

If this abstract measurement doesn’t work for your or your team, the next best alternative is ideal days. 

If you love that digital taylorism and want to go down the path of worker surveillance and scientific management in a software house - Person Hours are the hill to die on. 

To have the best estimates:

- Use retros to recalibrate your definition of story points and/or find reference story points that fit that definition, which you can compare to.
- The best estimates always come from the story’s implementers.
- Items deep in the backlog should have a rough estimate erring on the side of an overestimation, until the planning meeting.
  
## Don't forget to Measure

Burnups and velocity charts give you the necessary feedback to mitigate and improve your sprints, PIs and general direction.


## References

- [Mike Cohn Agile estimating and planning](https://www.mountaingoatsoftware.com/books/agile-estimating-and-planning)
- [Story Points: Why are they better than hours?](https://www.scruminc.com/story-points-why-are-they-better-than//)

## Github

Code and article shown here are available on [github](https://github.com/adamd1985/articles/tree/main/story_of_storypoints).

#
<div align="right">Made with :heartpulse: by <b>Adam</b></div>
