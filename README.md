# People List Parser

This is a super-experimental thing to see if it's possible to create an
embeddable widget that generates a list of organizers from a
spreadsheet.

![Screenshot of spreadsheet and rendered grid](/docs/screenshot.png)

## Usage

This app is designed to be hosted on GitHub Pages.

[Hosted version][4]

   [4]: https://civictechto.github.io/people-list-parser/

## Technologies Used

- GitHub Pages.
  - Jekyll.
- Bootstrap.
- Javascript
  - VueJS.
  - PapaParse.
- Google Spreadsheets.
- CircleCI. (optional)
  - Python.
    - Click.

## Rationale

Communities like Civic Tech Toronto have some features that are unique:

- Any member of community is welcome to participate in organizing.
- One's status as an organizer is largely self-assessed.
- The list of active organizers is often in flux.
- There are multiple generations of leadership in the community.
- The organization is predisposed to be a bit ahistorical, as in current leaders
  don't always know how to situate themselves in leadership. ("Everyone I
understood to be in charge is gone, so does that mean I'm in charge? Is
this healthy and ok?")
- Newcomers tend to assume that anyone who was there when they arrived
  was "in charge" or "senior", though in fact they often arrive just before.
- People who don't attend regularly still feel ownership.
- Outsiders are rightfully curious who is stewarding the community.
- A static list is hard to keep up-to-date.
- Organizers have diverse skills and experiences outside tech that might
  not be apparent to outsiders.

For the reasons above, the goal of this experiment is to see if
something can be created that involves:

1. A spreadsheet of "member roster" data [(example)][1], ostensibly
   "organizers" but can be any group.
  - This can include data like Linkedin or Twitter links, among other
    things.
  - An eventual scheduled script to update some of this tedious
    organizer data automatically based on membership in a Slack channel
-- username, images, name, but also perhaps "last slack login", "last
meetup RSVP", count of "total meetup RSVPs", etc.
2. An optional spreadsheet of "checkin" data [(example)][2], with each
   row noting a member status on a certain date -- for example, "active"
or "alum".
  - An eventual scheduled script to send interactive Slack messages to
    members of a specific Slack channel, from which a button click will
add a new row to the checkin data.
3. A small embeddable app that can render the two tables above in a
   visual and explorable way.
  - A way to scan through the history of the organization and see how
    it's evolved and changed over time. [Demo of control interface.][3]
  - Should work without the need for the automated update scripts
    mentioned above -- manual updates should be just as simple.


**The idea is to create a widget that can be used by grassroots
organizations with similar constraints and ways of operating --
solidarity through shared infrastructure.**

The hope is that offering something that can make "chaordic" organizing
more legible will help alleviate pressure on grassroots groups to favour
certain forms of hierarchy. The hypothesis is that sometimes these
groups might lean toward hierarchy simply to make themselves legible to
themselves and others, but finding other ways to be legible (like this
tool) might help. Ideally, even non-technical groups would be able to
make use of this tool to add clarity to their composition and history.

   [1]: https://docs.google.com/spreadsheets/d/1LCVxEXuv70R-NozOwhNxZFtTZUmn1FLMPVD5wgIor9o/edit#gid=642523045
   [2]: https://docs.google.com/spreadsheets/d/1LCVxEXuv70R-NozOwhNxZFtTZUmn1FLMPVD5wgIor9o/edit#gid=1061878392
   [3]: https://civictechto.github.io/people-list-parser/slider-demo.html

## Local Development

```
bundle install
bundle exec jekyll serve
```

A local demo will be available at: http://localhost:4000
